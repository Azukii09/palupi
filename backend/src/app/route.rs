use axum::{
    routing::{ get},
     Router,
};
use crate::core::connections_pool;
use crate::features::categories::adapters::repo_sqlx::CategoryRepoSqlx;
use crate::features::categories::controllers::handlers::{list_categories, AppState};

pub async fn category_router() -> Router {
    let pool = connections_pool().await.unwrap();
    let state = AppState { repo: CategoryRepoSqlx::new(pool) };
    Router::new()
        .route("/list", get(list_categories))
        .with_state(state)
}

