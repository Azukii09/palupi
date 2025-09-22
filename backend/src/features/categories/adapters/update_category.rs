use async_trait::async_trait;
use sqlx::{Postgres, Transaction};
use uuid::Uuid;
use crate::core::errors::error::DomainError;
use crate::core::errors::map_db_err::map_db_err;
use crate::features::categories::adapters::repo_sqlx::{ CategoryRepoSqlx};
use crate::features::categories::models::entity::CategoryI18n;
use crate::features::categories::models::repo::{CategoryUpdateRepo};

#[async_trait]
impl CategoryUpdateRepo for CategoryRepoSqlx {
    async fn update(
        &self,
        id: Uuid,
        locale: &str,
        status: Option<bool>,
        name: Option<&str>,
        description: Option<&str>
    ) -> Result<CategoryI18n, DomainError> {
        let mut tx: Transaction<'_, Postgres> = self.pool.begin().await.map_err(map_db_err)?;

        // Update status parent bila ada
        if let Some(s) = status {
            let n = sqlx::query!(
                r#"
                UPDATE categories
                SET status = $2, updated_at = now()
                WHERE id = $1 AND deleted_at IS NULL
                "#,
                id,
                s
            )
                .execute(&mut *tx)
                .await
                .map_err(map_db_err)?
                .rows_affected();

            if n == 0 {
                return Err(DomainError::NotFound);
            }
        }

        // Upsert translation bila ada perubahan teks
        if name.is_some() || description.is_some() {
            sqlx::query!(
                r#"
                INSERT INTO category_translations (category_id, locale, name, description)
                VALUES ($1, $2, COALESCE($3, ''), $4)
                ON CONFLICT (category_id, locale)
                DO UPDATE SET
                    name        = COALESCE($3, category_translations.name),
                    description = COALESCE($4, category_translations.description),
                    updated_at  = now()
                "#,
                id,
                locale,
                name,
                description
            )
                .execute(&mut *tx)
                .await
                .map_err(map_db_err)?;
        }

        // Ambil hasil akhir
        let row = sqlx::query_as::<_, CategoryI18n>(
            r#"
            WITH def AS (SELECT code FROM languages WHERE is_default = true)
            SELECT
              c.id, c.status,
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
            .fetch_one(&mut *tx)
            .await
            .map_err(map_db_err)?;

        tx.commit().await.map_err(map_db_err)?;
        Ok(row)
    }
}
