use async_trait::async_trait;
use crate::core::errors::error::DomainError;
use crate::core::errors::map_db_err::map_db_err;
use crate::features::categories::adapters::repo_sqlx::{ CategoryRepoSqlx};
use crate::features::categories::models::entity::CategoryI18n;
use crate::features::categories::models::repo::{CategoryGetAllRepo};

#[async_trait]
impl CategoryGetAllRepo for CategoryRepoSqlx {
    async fn get_all(&self, locale: &str) -> Result<Vec<CategoryI18n>, DomainError> {
        let rows = sqlx::query_as::<_, CategoryI18n>(
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
            WHERE c.deleted_at IS NULL
            ORDER BY c.created_at DESC
            "#
        )
            .bind(locale)
            .fetch_all(&self.pool)
            .await
            .map_err(map_db_err)?;

        Ok(rows)
    }
}
