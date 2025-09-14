use axum::{serve};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use tokio::net::TcpListener;
use crate::app::build_router;

mod core;
mod app;

#[tokio::main]
async fn main() {

    let app = build_router();

    let listener = TcpListener::bind("0.0.0.0:8080").await.unwrap();
    serve(listener,app).await.unwrap()
}

#[derive(Serialize, FromRow)]
struct Category {
    id: i32,
    name: String,
}
#[derive(Deserialize)]
struct CategoryDto {
    name: String,
}
