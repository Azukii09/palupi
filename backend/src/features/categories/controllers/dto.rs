use serde::Serialize;

#[derive(Serialize)]
pub struct CategoryResponse {
    pub id: i32,
    pub name: String,
}
