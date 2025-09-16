use axum::{serve};
use tokio::net::TcpListener;
use crate::app::build_router;

mod core;
mod app;
mod features;

#[tokio::main]
async fn main() {

    let app = build_router().await;

    let listener = TcpListener::bind("0.0.0.0:8080").await.unwrap();
    serve(listener,app).await.unwrap()
}
