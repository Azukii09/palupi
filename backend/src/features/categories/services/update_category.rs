use uuid::Uuid;
use crate::features::categories::models::entity::{CategoryI18n, CategoryTranslation};
use crate::features::categories::models::repo::{ CategoryUpdateRepo, DomainError};

pub struct UpdateCategory<R: CategoryUpdateRepo>(pub R);
impl<R: CategoryUpdateRepo> UpdateCategory<R> {
    pub async fn run(
        &self,
        id: Uuid,
        locale: &str,
        status: Option<bool>,
        name: Option<&str>,
        description: Option<&str>,
    ) -> Result<CategoryI18n,DomainError> {
        // Wajib ada perubahan
        if status.is_none() && name.is_none() && description.is_none() {
            return Err(DomainError::Validation("no changes provided".into()));
        }

        // Bangun entity sementara agar bisa pakai VALIDASI & NORMALISASI domain.
        // try_new memvalidasi format locale & name. Bila name tidak dikirim,
        // gunakan placeholder valid agar locale tetap tervalidasi.
        let placeholder = "placeholder";
        let initial_name = name.unwrap_or(placeholder);

        let mut tmp = CategoryTranslation::try_new(
            id,
            locale,
            initial_name,
            None, // description akan diproses di bawah via setter
        )?;

        // Jika name dikirim → validasi & normalisasi lewat setter
        if let Some(n) = name {
            tmp.set_name(n)?; // trim + ≤255 + non-empty
        }

        // Jika description dikirim → validasi & normalisasi lewat setter
        if description.is_some() {
            // set_description menerima Option<&str>
            tmp.set_description(description)?; // trim, "" -> None, batas panjang
        }

        // Teruskan nilai yang sudah DINORMALISASI ke repo.
        // - name hanya dikirim jika memang diminta update (hindari “insert baru tanpa name”).
        let name_arg: Option<&str> = name.map(|_| tmp.name.as_str());
        let desc_arg: Option<&str> = if description.is_some() {
            tmp.description.as_deref()
        } else {
            None
        };

        self.0.update(id, locale, status, name_arg, desc_arg).await
    }
}
