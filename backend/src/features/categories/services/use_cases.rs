use uuid::Uuid;
use crate::features::categories::models::entity::{Category, CategoryI18n, CategoryTranslation};
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
    ) -> Result<CategoryI18n, DomainError> {
        // ===== Domain validation & normalization =====
        // Gunakan ID sementara hanya untuk memanfaatkan validator di entity.
        let temp_id = Uuid::now_v7();

        // Validasi format locale + name (trim, non-empty, ≤255) dan normalisasi name
        let mut t = CategoryTranslation::try_new(temp_id, locale, name, None)?;

        // Validasi & normalisasi description (trim, "" -> None, batas panjang)
        // (method set_description kita kembalikan Result)
        t.set_description(description)?;

        // ===== Persist ke repo dengan nilai yang sudah dinormalisasi =====
        // - name: gunakan versi yang sudah dinormalisasi dari entity
        // - description: kirim as_deref() agar cocok dengan signature repo (Option<&str>)
        self.0
            .create(locale, &t.name, t.description.as_deref(), status)
            .await
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
