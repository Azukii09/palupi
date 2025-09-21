use serde::{Deserialize, Serialize};
use uuid::Uuid;
use validator::Validate;
use crate::features::categories::models::entity::CategoryI18n;

#[derive(Serialize)]
pub struct CategoryResponse {
    pub id: Uuid,
    pub status: bool,
    pub name: String,
    pub description: Option<String>,
}

// Konversi dari read-model domain -> DTO response
impl From<CategoryI18n> for CategoryResponse {
    fn from(v: CategoryI18n) -> Self {
        Self {
            id: v.id,
            status: v.status,
            name: v.name,
            description: v.description,
        }
    }
}

#[derive(Deserialize, Validate)]
pub struct CreateCategoryRequest {
    #[validate(length(min = 1, max = 255))]
    pub name: String,
    pub description: Option<String>,
    pub status: Option<bool>,
}

#[derive(Deserialize, Validate)]
pub struct UpdateCategoryRequest {
    #[validate(length(min = 1, max = 255))]
    pub name: Option<String>,
    pub description: Option<String>,
    pub status: Option<bool>,
}

#[derive(Deserialize)]
pub struct LocaleParam {
    pub locale: String,
}
