use async_trait::async_trait;
use sqlx::{Postgres, Transaction};
use uuid::Uuid;
use crate::core::errors::error::DomainError;
use crate::core::errors::map_db_err::map_db_err;
use crate::features::categories::adapters::repo_sqlx::CategoryRepoSqlx;
use crate::features::categories::models::entity::CategoryI18n;
use crate::features::categories::models::repo::{CategoryCreateRepo};

#[async_trait]
impl CategoryCreateRepo for CategoryRepoSqlx {
    async fn create(&self, locale: &str, name: &str, description: Option<&str>, status: bool) -> Result<CategoryI18n, DomainError> {
        let mut tx: Transaction<'_, Postgres> = self.pool.begin().await.map_err(map_db_err)?;

        // Gunakan UUID v7 agar index lebih "time-ordered"
        let id = Uuid::now_v7();

        // Parent
        sqlx::query!(
            r#"INSERT INTO categories (id, status) VALUES ($1, $2)"#,
            id,
            status
        )
            .execute(&mut *tx)
            .await
            .map_err(map_db_err)?;

        // Ambil default locale
        let def_locale: String = sqlx::query_scalar(
            r#"SELECT code FROM languages WHERE is_default = true LIMIT 1"#,
        )
            .fetch_one(&mut *tx)
            .await
            .map_err(map_db_err)?;

        // Translation untuk locale yang diminta
        sqlx::query!(
            r#"
            INSERT INTO category_translations (category_id, locale, name, description)
            VALUES ($1, $2, $3, $4)
            "#,
            id,
            locale,
            name,
            description
        )
            .execute(&mut *tx)
            .await
            .map_err(map_db_err)?;

        // Jika bukan default-locale, tambahkan default juga (biar lulus constraint)
        if locale != def_locale {
            sqlx::query!(
                r#"
                INSERT INTO category_translations (category_id, locale, name, description)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (category_id, locale) DO NOTHING
                "#,
                id,
                def_locale,
                name,
                description
            )
                .execute(&mut *tx)
                .await
                .map_err(map_db_err)?;
        }

        // Ambil hasil gabungan untuk locale diminta
        let created = sqlx::query_as::<_, CategoryI18n>(
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
        Ok(created)
    }
}
