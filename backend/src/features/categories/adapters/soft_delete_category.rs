use async_trait::async_trait;
use sqlx::{Postgres, Transaction};
use uuid::Uuid;
use crate::core::errors::error::DomainError;
use crate::features::categories::adapters::repo_sqlx::{map_db_err, CategoryRepoSqlx};
use crate::features::categories::models::repo::{CategorySoftDeleteRepo};

#[async_trait]
impl CategorySoftDeleteRepo for CategoryRepoSqlx{
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
}
