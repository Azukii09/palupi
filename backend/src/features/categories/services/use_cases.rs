use uuid::Uuid;
use crate::features::categories::models::entity::{ CategoryI18n, CategoryTranslation};
use crate::features::categories::models::repo::{CategoryRepo, DomainError};

pub struct GetAllCategory<R: CategoryRepo>(pub R);
impl<R: CategoryRepo> GetAllCategory<R> {
    pub async fn run(&self, locale: &str) -> Result<Vec<CategoryI18n>, DomainError> {
        // Validasi format locale via domain (placeholder name yang valid)
        let _ = CategoryTranslation::try_new(Uuid::now_v7(), locale, "placeholder", None)?;
        // Delegasi ke repo (query sudah punya fallback ke default-locale)
        self.0.get_all(locale).await
    }
}

pub struct GetCategoryById<R: CategoryRepo>(pub R);
impl<R: CategoryRepo> GetCategoryById<R> {
    pub async fn run(&self, id: Uuid, locale: &str) -> Result<CategoryI18n, DomainError> {
        // Validasi format locale (tanpa membuat perubahan apa pun)
        let _ = CategoryTranslation::try_new(id, locale, "placeholder", None)?;
        self.0.get_by_id(id, locale).await
    }
}

pub struct SoftDeleteCategory<R: CategoryRepo>(pub R);
impl<R: CategoryRepo> SoftDeleteCategory<R> {
    pub async fn run(&self, id: Uuid) -> Result<(),DomainError> {
        self.0.soft_delete(id).await
    }
}
