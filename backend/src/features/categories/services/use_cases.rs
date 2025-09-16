use crate::features::categories::models::entity::Category;
use crate::features::categories::models::repo::{CategoryRepo, DomainError};

pub struct GetAll<R: CategoryRepo>(pub R);
impl<R: CategoryRepo> GetAll<R> {
    pub async fn run(&self) -> Result<Vec<Category>,DomainError> {
        self.0.get_all().await
    }
}

pub struct GetById<R: CategoryRepo>(pub R);
impl<R: CategoryRepo> GetById<R> {
    pub async fn run(&self, id: i32) -> Result<Category,DomainError> {
        self.0.get_by_id(id).await
    }
}

pub struct AddCategory<R: CategoryRepo>(pub R);
impl<R: CategoryRepo> AddCategory<R> {
    pub async fn run(&self, name: &str) -> Result<Category,DomainError> {
        self.0.create(name).await
    }
}

pub struct UpdateCategory<R: CategoryRepo>(pub R);
impl<R: CategoryRepo> UpdateCategory<R> {
    pub async fn run(&self, id: i32, name: &str) -> Result<Category,DomainError> {
        self.0.update(id, name).await
    }
}
