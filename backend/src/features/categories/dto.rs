use axum_test::expect_json::__private::serde_trampoline::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Serialize, FromRow)]
pub struct Category {
    pub id: i32,
    pub name: String,
}
#[derive(Deserialize)]
pub struct CategoryDto {
    pub name: String,
}
