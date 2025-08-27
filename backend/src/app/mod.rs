use axum::Router;

pub mod route;

pub fn build_router() -> Router {
    // /api/v1/* diisi oleh sub-router
    let api_v1 = Router::new()
        .nest("/category", route::router());

    Router::new().nest("/api/v1", api_v1)
}
