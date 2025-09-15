use axum::Router;

pub mod route;

pub async fn build_router() -> Router {
    let api_v1 = Router::new()
        .nest("/categories", route::category_router().await);

    Router::new().nest("/api/v1", api_v1)
}
