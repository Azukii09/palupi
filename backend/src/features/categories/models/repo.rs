use async_trait::async_trait;
use uuid::Uuid;
use crate::core::errors::error::DomainError;
use crate::features::categories::models::entity::{ CategoryI18n};

#[async_trait]
pub trait CategoryGetAllRepo {
    async fn get_all(&self, locale: &str) -> Result<Vec<CategoryI18n>, DomainError>;
}

#[async_trait]
pub trait CategoryGetByIdRepo {
    async fn get_by_id(&self, id: Uuid, locale: &str) -> Result<CategoryI18n, DomainError>;
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
pub trait CategorySoftDeleteRepo {
    async fn soft_delete(&self, id: Uuid) -> Result<(), DomainError>;
}

#[async_trait]
pub trait CategoryHardDeleteRepo {
    async fn hard_delete(&self, id: Uuid) -> Result<(), DomainError>;
}
