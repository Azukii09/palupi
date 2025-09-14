use std::env;
use axum::{serve};
use axum::extract::State;
use axum::response::IntoResponse;
use dotenvy::dotenv;
use http::StatusCode;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, PgPool};
use tokio::net::TcpListener;
use crate::app::build_router;

mod core;
mod app;

#[tokio::main]
async fn main() {

    let app = build_router();

    let listener = TcpListener::bind("0.0.0.0:8080").await.unwrap();
    serve(listener,app).await.unwrap()
}

#[derive(Serialize, FromRow)]
struct Category {
    id: i32,
    name: String,
}
#[derive(Deserialize)]
struct CategoryDto {
    name: String,
}

async fn db() -> PgPool {
    dotenv().ok();
    let db_url = env::var("DATABASE_URL").unwrap();
    let pool = sqlx::postgres::PgPool::connect(&*db_url).await.unwrap();

    pool
}

async fn get_categories_list(State(pool): State<PgPool>) -> impl IntoResponse {
    let todos : Vec<Category> = sqlx::query_as("SELECT * FROM categories").fetch_all(&pool).await.unwrap();

    let todos_json = serde_json::to_string_pretty(&todos).unwrap();

    (StatusCode::OK, todos_json)
}
