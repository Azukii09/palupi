use async_trait::async_trait;
use crate::features::categories::models::entity::Category;

#[derive(thiserror::Error, Debug)]
pub enum DomainError {
    #[error("Not Found")]
    NotFound,
    #[error("conflict: {0}")]
    Conflict(String),
}

#[async_trait]
pub trait CategoryRepo {
    async fn get_all(&self) -> Result<Vec<Category>, DomainError>;
}
