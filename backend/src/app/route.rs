use axum::{
    routing::{ get},
     Router,
};
use serde_json::json;
use crate::core::connections_pool;
use crate::{connect_pool_new, list_categories};

pub fn category_router() -> Router {
    Router::new().route("/", get(get_item_handler))
}

async fn get_item_handler() -> impl axum::response::IntoResponse {
    let pool = connect_pool_new("postgres://admin:adminpalupi123456@localhost:5432/palupi_db").await.unwrap();
    match list_categories(&pool, "id").await {
        Ok(item) => axum::response::Json(json!(item)),
        Err(_) => axum::response::Json(json!({"error": "Item not found"})),
    }
}
