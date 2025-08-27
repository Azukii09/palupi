use axum::Router;

pub mod route;

pub fn build_router() -> Router {
    let api_v1 = Router::new()
        .nest("/category", route::category_router());

    Router::new().nest("/api/v1", api_v1)
}
