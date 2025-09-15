use axum::{
    routing::{ get},
     Router,
};
use axum::routing::{delete, post, put};
use crate::{add_categories, delete_categories, get_categories_list, get_single_categories, update_categories};
use crate::core::connections_pool;

pub async fn category_router() -> Router {
    let pool = connections_pool().await.unwrap();
    Router::new()
        .route("/list", get(get_categories_list))
        .route("/{:id}", get(get_single_categories))
        .route("/add", post(add_categories))
        .route("/delete/{:id}", delete(delete_categories))
        .route("/update/{:id}", put(update_categories))
        .with_state(pool)
}

