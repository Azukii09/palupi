use axum::{
    routing::{ get},
     Router,
};
use axum::routing::{delete, post, put};
use crate::core::database::connections_pool;
use crate::features::categories::adapters::repo_sqlx::CategoryRepoSqlx;
use crate::features::categories::controllers::handlers::{create_category, delete_category, get_category, list_categories, update_category, AppState};

pub async fn category_router() -> Router {
    let pool = connections_pool().await.unwrap();
    let state = AppState { repo: CategoryRepoSqlx::new(pool) };
    Router::new()
        .route("/", get(list_categories))
        .route("/{:id}", get(get_category))
        .route("/", post(create_category))
        .route("/{:id}", put(update_category))
        .route("/{:id}", delete(delete_category))
        .with_state(state)
}

