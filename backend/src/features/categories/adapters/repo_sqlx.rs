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

    async fn get_by_id(&self, id: i32) -> Result<Category, DomainError> {
        let row = sqlx::query!("SELECT id, name FROM categories WHERE id = $1", id)
            .fetch_optional(&self.pool).await
            .map_err(|e| DomainError::Conflict(e.to_string()))?;

        match row {
            Some(r) => Ok(Category::new(r.id, r.name)),
            None => Err(DomainError::NotFound),
        }
    }

    async fn create(&self, name: &str) -> Result<Category, DomainError> {
        let row = sqlx::query!("INSERT INTO categories (name) VALUES ($1) RETURNING id, name", name)
            .fetch_one(&self.pool).await
            .map_err(|e| DomainError::Conflict(e.to_string()))?;
        Ok(Category::new(row.id, row.name))
    }

    async fn update(&self, id: i32, name: &str) -> Result<Category, DomainError> {
        let row = sqlx::query!("UPDATE categories SET name = $1 WHERE id = $2 RETURNING id, name", name, id)
        .fetch_optional(&self.pool).await
        .map_err(|e| DomainError::Conflict(e.to_string()))?;

        match row {
            Some(r) => Ok(Category::new(r.id, r.name)),
            None => Err(DomainError::NotFound),
        }
    }
}
