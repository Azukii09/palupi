use axum::{
    routing::{ get},
     Router,
};
use crate::core::database::connections_pool;
use crate::features::categories::adapters::repo_sqlx::CategoryRepoSqlx;
use crate::features::categories::controllers::handlers::{get_category, list_categories, AppState};

pub async fn category_router() -> Router {
    let pool = connections_pool().await.unwrap();
    let state = AppState { repo: CategoryRepoSqlx::new(pool) };
    Router::new()
        .route("/", get(list_categories))
        .route("/{:id}", get(get_category))
        .with_state(state)
}

