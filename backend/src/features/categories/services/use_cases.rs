use crate::features::categories::models::entity::Category;
use crate::features::categories::models::repo::{CategoryRepo, DomainError};

pub struct GetAll<R: CategoryRepo>(pub R);
impl<R: CategoryRepo> GetAll<R> {
    pub async fn run(&self) -> Result<Vec<Category>,DomainError> {
        self.0.get_all().await
    }
}
