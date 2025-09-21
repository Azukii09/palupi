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
