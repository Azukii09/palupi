use axum::{
    routing::{ get},
     Router,
};

pub fn category_router() -> Router {
    Router::new().route("/", get(|| async { "Hello World"}))
}

