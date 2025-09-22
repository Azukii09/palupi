use async_trait::async_trait;
use uuid::Uuid;
use crate::core::errors::error::DomainError;
use crate::features::categories::adapters::repo_sqlx::{map_db_err, CategoryRepoSqlx};
use crate::features::categories::models::entity::CategoryI18n;
use crate::features::categories::models::repo::{CategoryGetByIdRepo};

#[async_trait]
impl CategoryGetByIdRepo for CategoryRepoSqlx {
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
}
