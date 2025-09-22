use async_trait::async_trait;
use sqlx::{PgPool, Postgres, Transaction};
use uuid::Uuid;
use crate::features::categories::models::entity::{ CategoryI18n};
use crate::features::categories::models::repo::{CategoryRepo, DomainError};

#[derive(Clone)]
pub struct CategoryRepoSqlx {
    pub pool: PgPool,
}

impl CategoryRepoSqlx {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

pub fn map_db_err(e: sqlx::Error) -> DomainError {
    match &e {
        sqlx::Error::RowNotFound => DomainError::NotFound,

        // Pelanggaran unik -> 409
        sqlx::Error::Database(db) if db.is_unique_violation() => {
            DomainError::Conflict(db.message().to_string())
        }

        // FK violation (23503) -> 422 (mis. locale tidak ada di languages)
        sqlx::Error::Database(db)
        if db.code().as_deref() == Some("23503") =>
            {
                DomainError::Validation("foreign key violation".into())
            }

        // Check constraint (23514) -> 422
        sqlx::Error::Database(db)
        if db.code().as_deref() == Some("23514") =>
            {
                DomainError::Validation("check constraint violation".into())
            }

        // String terlalu panjang untuk kolom (22001) -> 422
        sqlx::Error::Database(db)
        if db.code().as_deref() == Some("22001") =>
            {
                DomainError::Validation("value too long for column".into())
            }

        // Lainnya -> 500
        _ => DomainError::Internal(e.to_string()),
    }
}

#[async_trait]
impl CategoryRepo for CategoryRepoSqlx {
    async fn get_by_id(&self, id: Uuid, locale: &str) -> Result<CategoryI18n, DomainError> {
        let row = sqlx::query_as::<_, CategoryI18n>(
            r#"
            WITH def AS (SELECT code FROM languages WHERE is_default = true)
            SELECT
              c.id,
              c.status,
              COALESCE(tw.name, td.name)        AS name,
              COALESCE(tw.description, td.description) AS description
            FROM categories c
            LEFT JOIN LATERAL (
              SELECT name, description
              FROM category_translations
              WHERE category_id = c.id
                AND locale = $1
                AND deleted_at IS NULL
              LIMIT 1
            ) tw ON TRUE
            LEFT JOIN LATERAL (
              SELECT ct.name, ct.description
              FROM category_translations ct
              JOIN def ON def.code = ct.locale
              WHERE ct.category_id = c.id
                AND ct.deleted_at IS NULL
              LIMIT 1
            ) td ON TRUE
            WHERE c.id = $2
              AND c.deleted_at IS NULL
            "#
        )
            .bind(locale)
            .bind(id)
            .fetch_one(&self.pool)
            .await
            .map_err(map_db_err)?;

        Ok(row)
    }

    async fn soft_delete(&self, id: Uuid) -> Result<(), DomainError> {
        let mut tx: Transaction<'_, Postgres> = self.pool.begin().await.map_err(map_db_err)?;

        // Soft delete parent
        let n = sqlx::query!(
            r#"
            UPDATE categories
            SET deleted_at = now(), updated_at = now()
            WHERE id = $1 AND deleted_at IS NULL
            "#,
            id
        )
            .execute(&mut *tx)
            .await
            .map_err(map_db_err)?
            .rows_affected();

        if n == 0 {
            return Err(DomainError::NotFound);
        }

        // Soft delete children (hapus jika kamu pasang trigger cascade soft-delete, bagian ini bisa dihapus)
        sqlx::query!(
            r#"
            UPDATE category_translations
            SET deleted_at = now(), updated_at = now()
            WHERE category_id = $1 AND deleted_at IS NULL
            "#,
            id
        )
            .execute(&mut *tx)
            .await
            .map_err(map_db_err)?;

        tx.commit().await.map_err(map_db_err)?;
        Ok(())
    }

    async fn hard_delete(&self, id: Uuid) -> Result<(), DomainError> {
        // Anak ikut terhapus via FK ON DELETE CASCADE
        let n = sqlx::query!(r#"DELETE FROM categories WHERE id = $1"#, id)
            .execute(&self.pool)
            .await
            .map_err(map_db_err)?
            .rows_affected();

        if n == 0 {
            return Err(DomainError::NotFound);
        }
        Ok(())
    }
}
