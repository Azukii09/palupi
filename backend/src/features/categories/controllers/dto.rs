use serde::{Deserialize, Serialize};

#[derive(Serialize)]
pub struct CategoryResponse {
    pub id: i32,
    pub name: String,
}

#[derive(Deserialize)]
pub struct CreateCategoryRequest {
    pub name: String,
}
