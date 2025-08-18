use axum::{routing::get, Router, response::Html};
use tokio::net::TcpListener;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let app = Router::new()
        .route("/", get(|| async { Html("<h1>OK</h1>") }))
        .route("/health", get(|| async { "ok" }));
    let listener = TcpListener::bind("0.0.0.0:8080").await?;
    axum::serve(listener, app).await?;
    Ok(())
}
