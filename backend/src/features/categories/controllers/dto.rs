use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::features::categories::models::entity::CategoryI18n;

/// Response ke client (hasil mapping dari model domain CategoryI18n)
#[derive(Serialize)]
pub struct CategoryResponse {
    pub id: Uuid,                    // pastikan uuid punya fitur serde di Cargo.toml
    pub status: bool,
    pub name: String,
    pub description: Option<String>,
}

/// Body request untuk create
#[derive(Deserialize)]
pub struct CreateCategoryRequest {
    pub name: String,
    pub description: Option<String>,
    /// default-kan di handler ke true bila None
    pub status: Option<bool>,
}

/// Body request untuk update (semua opsional)
#[derive(Deserialize)]
pub struct UpdateCategoryRequest {
    pub name: Option<String>,
    pub description: Option<String>,
    pub status: Option<bool>,
}

/// Locale dikirim via query string, bukan body
#[derive(Deserialize)]
pub struct LocaleParam {
    pub locale: String, // "id" / "en" / dst.
}


impl From<CategoryI18n> for CategoryResponse {
    fn from(v: CategoryI18n) -> Self {
        Self { id: v.id, status: v.status, name: v.name, description: v.description }
    }
}
