use async_trait::async_trait;
use sqlx::{PgPool};
use uuid::Uuid;
use crate::features::categories::models::repo::{CategoryHardDeleteRepo, DomainError};

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
impl CategoryHardDeleteRepo for CategoryRepoSqlx {
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
