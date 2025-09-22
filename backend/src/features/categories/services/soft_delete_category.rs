use uuid::Uuid;
use crate::core::errors::error::DomainError;
use crate::features::categories::models::repo::{CategorySoftDeleteRepo};

pub struct SoftDeleteCategory<R: CategorySoftDeleteRepo>(pub R);
impl<R: CategorySoftDeleteRepo> SoftDeleteCategory<R> {
    pub async fn run(&self, id: Uuid) -> Result<(),DomainError> {
        self.0.soft_delete(id).await
    }
}
