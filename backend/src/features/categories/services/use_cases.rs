use uuid::Uuid;
use crate::features::categories::models::repo::{CategoryRepo, DomainError};


pub struct SoftDeleteCategory<R: CategoryRepo>(pub R);
impl<R: CategoryRepo> SoftDeleteCategory<R> {
    pub async fn run(&self, id: Uuid) -> Result<(),DomainError> {
        self.0.soft_delete(id).await
    }
}
