use uuid::Uuid;
use crate::core::errors::error::DomainError;
use crate::features::categories::models::entity::{CategoryI18n, CategoryTranslation};
use crate::features::categories::models::repo::{CategoryGetAllRepo};

pub struct GetAllCategory<R: CategoryGetAllRepo>(pub R);
impl<R: CategoryGetAllRepo> GetAllCategory<R> {
    pub async fn run(&self, locale: &str) -> Result<Vec<CategoryI18n>, DomainError> {
        // Validasi format locale via domain (placeholder name yang valid)
        let _ = CategoryTranslation::try_new(Uuid::now_v7(), locale, "placeholder", None)?;
        // Delegasi ke repo (query sudah punya fallback ke default-locale)
        self.0.get_all(locale).await
    }
}
