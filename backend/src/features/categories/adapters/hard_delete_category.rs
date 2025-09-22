use async_trait::async_trait;
use uuid::Uuid;
use crate::core::errors::error::DomainError;
use crate::core::errors::map_db_err::map_db_err;
use crate::features::categories::adapters::repo_sqlx::{ CategoryRepoSqlx};
use crate::features::categories::models::repo::{CategoryHardDeleteRepo};

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
