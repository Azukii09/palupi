use axum::Router;
use axum::routing::{delete, get, post, put};

#[tokio::main]
async fn main() {
    let router01 = Router::new()
        .route("/api/category", get(get_category))
        .route("/api/category", put(put_category))
        .route("/api/category", delete(delete_category))
        .route("/api/category", post(post_category));

    //IP and port
    let address = "0.0.0.0:8080";
    let listener = tokio::net::TcpListener::bind(address).await.unwrap();

    axum::serve(listener,router01).await.unwrap();
}

async fn get_category() {
    println!("Hello, from category!");
}

async fn post_category() {}

async fn put_category() {}

async fn delete_category() {}
