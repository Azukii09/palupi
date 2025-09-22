use uuid::Uuid;
use crate::features::categories::models::entity::{CategoryI18n, CategoryTranslation};
use crate::features::categories::models::repo::{CategoryCreateRepo, DomainError};

pub struct CreateCategory<R: CategoryCreateRepo>(pub R);
impl<R: CategoryCreateRepo> CreateCategory<R> {
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
