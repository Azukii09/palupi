use std::time::Duration;
use axum::{serve};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, PgPool};
use sqlx::postgres::PgPoolOptions;
use tokio::net::TcpListener;
use uuid::Uuid;
use crate::app::build_router;

mod core;
mod app;

#[tokio::main]
async fn main() {

    let app = build_router();

    let listener = TcpListener::bind("0.0.0.0:8080").await.unwrap();
    serve(listener,app).await.unwrap()
}

pub async fn connect_pool_new(database_url: &str) -> anyhow::Result<PgPool> {
    let pool = PgPoolOptions::new()
        .max_connections(10)                  // jumlah koneksi maksimal
        .min_connections(2)                   // koneksi standby
        .acquire_timeout(Duration::from_secs(5))
        .idle_timeout(Duration::from_secs(600))
        .after_connect(|conn, _meta| {
            Box::pin(async move {
                // Set timezone UTC untuk semua koneksi
                sqlx::query("SET TIME ZONE 'UTC'")
                    .execute(conn)
                    .await?;
                Ok(())
            })
        })
        .connect(database_url)
        .await?;

    Ok(pool)
}

// --- Enum status (pakai enum bawaan Postgres) ---
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "category_status", rename_all = "lowercase")]
pub enum CategoryStatus {
    Active,
    Inactive,
}

// --- Struct hasil query langsung dari DB (JOIN categories + categories_i18n) ---
#[derive(Debug, FromRow)]
pub struct CategoryRow {
    pub id: Uuid,
    pub status: CategoryStatus,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
    pub locale: String,
    pub name: String,
    pub description: Option<String>,
}

// --- Struct untuk output API (DTO) ---
#[derive(Debug, Serialize)]
pub struct CategoryOut {
    pub id: String,
    pub status: CategoryStatus,
    pub locale: String,
    pub name: String,
    pub description: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

// --- Mapping otomatis dari Row ke Out ---
impl From<CategoryRow> for CategoryOut {
    fn from(r: CategoryRow) -> Self {
        Self {
            id: r.id.to_string(), // UUID -> String
            status: r.status,
            locale: r.locale,
            name: r.name,
            description: r.description,
            created_at: r.created_at,
            updated_at: r.updated_at,
        }
    }
}

pub async fn list_categories(
    pool: &PgPool,
    locale: &str,
) -> Result<Vec<CategoryOut>, sqlx::Error> {
    let rows = sqlx::query_as::<_, CategoryRow>(
        r#"
        SELECT c.id, c.status, c.created_at, c.updated_at, c.deleted_at,
               i.locale, i.name, i.description
        FROM categories c
        JOIN categories_i18n i ON i.category_id = c.id
        WHERE i.locale = $1 AND c.deleted_at IS NULL
        ORDER BY i.name ASC
        "#
    )
        .bind(locale)
        .fetch_all(pool)
        .await?;

    Ok(rows.into_iter().map(Into::into).collect())
}
