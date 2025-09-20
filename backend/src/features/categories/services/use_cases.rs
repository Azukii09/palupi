use uuid::Uuid;
use crate::features::categories::models::entity::{ CategoryI18n};
use crate::features::categories::models::repo::{CategoryRepo, DomainError};

pub struct GetAllCategory<R: CategoryRepo>(pub R);
impl<R: CategoryRepo> GetAllCategory<R> {
    pub async fn run(&self, locale: &str) -> Result<Vec<CategoryI18n>,DomainError> {
        self.0.get_all(locale).await
    }
}

pub struct GetCategoryById<R: CategoryRepo>(pub R);
impl<R: CategoryRepo> GetCategoryById<R> {
    pub async fn run(&self, id: Uuid, locale:&str) -> Result<CategoryI18n,DomainError> {
        self.0.get_by_id(id,locale).await
    }
}

pub struct AddCategory<R: CategoryRepo>(pub R);
impl<R: CategoryRepo> AddCategory<R> {
    pub async fn run(
        &self,
        locale: &str,
        name: &str,
        description: Option<&str>,
        status: bool,
    ) -> Result<CategoryI18n,DomainError> {
        self.0.create(locale,name,description,status).await
    }
}

pub struct UpdateCategory<R: CategoryRepo>(pub R);
impl<R: CategoryRepo> UpdateCategory<R> {
    pub async fn run(
        &self,
        id: Uuid,
        locale: &str,
        status: Option<bool>,
        name: Option<&str>,
        description: Option<&str>,
    ) -> Result<CategoryI18n,DomainError> {
        self.0.update(id,locale,status,name,description).await
    }
}

pub struct SoftDeleteCategory<R: CategoryRepo>(pub R);
impl<R: CategoryRepo> SoftDeleteCategory<R> {
    pub async fn run(&self, id: Uuid) -> Result<(),DomainError> {
        self.0.soft_delete(id).await
    }
}

pub struct HardDeleteCategory<R: CategoryRepo>(pub R);
impl<R: CategoryRepo> HardDeleteCategory<R> {
    pub async fn run(&self, id: Uuid) -> Result<(),DomainError> {
        self.0.hard_delete(id).await
    }
}
