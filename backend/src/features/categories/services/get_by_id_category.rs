use uuid::Uuid;
use crate::features::categories::models::entity::{CategoryI18n, CategoryTranslation};
use crate::features::categories::models::repo::{CategoryGetByIdRepo, DomainError};

pub struct GetCategoryById<R: CategoryGetByIdRepo>(pub R);
impl<R: CategoryGetByIdRepo> GetCategoryById<R> {
    pub async fn run(&self, id: Uuid, locale: &str) -> Result<CategoryI18n, DomainError> {
        // Validasi format locale (tanpa membuat perubahan apa pun)
        let _ = CategoryTranslation::try_new(id, locale, "placeholder", None)?;
        self.0.get_by_id(id, locale).await
    }
}
