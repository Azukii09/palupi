use async_trait::async_trait;
use sqlx::PgPool;
use crate::features::categories::models::entity::Category;
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

#[async_trait]
impl CategoryRepo for CategoryRepoSqlx {
    async fn get_all(&self) -> Result<Vec<Category>, DomainError> {
        let row = sqlx::query!("SELECT id, name FROM categories ORDER BY id")
            .fetch_all(&self.pool).await
            .map_err(|e| DomainError::Conflict(e.to_string()))?;

        Ok(row.into_iter().map(|r| Category::new(r.id, r.name)).collect())
    }
}
