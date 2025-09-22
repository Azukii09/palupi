use async_trait::async_trait;
use uuid::Uuid;
use crate::features::categories::models::entity::{ CategoryI18n};

#[derive(thiserror::Error, Debug)]
pub enum DomainError {
    #[error("Not Found")]
    NotFound,
    #[error("conflict: {0}")]
    Conflict(String),
    #[error("validation: {0}")]
    Validation(String),
    #[error("internal: {0}")]
    Internal(String),
}

#[async_trait]
pub trait CategoryGetAllRepo {
    async fn get_all(&self, locale: &str) -> Result<Vec<CategoryI18n>, DomainError>;
}
#[async_trait]
pub trait CategoryCreateRepo {
    async fn create(
        &self,
        locale: &str,
        name: &str,
        description: Option<&str>,
        status: bool,
    ) -> Result<CategoryI18n, DomainError>;
}

#[async_trait]
pub trait CategoryUpdateRepo {
    async fn update(
        &self,
        id: Uuid,
        locale: &str,
        status: Option<bool>,
        name: Option<&str>,
        description: Option<&str>,
    ) -> Result<CategoryI18n, DomainError>;
}


#[async_trait]
pub trait CategoryRepo {
    async fn get_by_id(&self, id: Uuid, locale: &str) -> Result<CategoryI18n, DomainError>;
    async fn soft_delete(&self, id: Uuid) -> Result<(), DomainError>;
    async fn hard_delete(&self, id: Uuid) -> Result<(), DomainError>;
}
