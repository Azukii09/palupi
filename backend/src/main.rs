use std::env;
use axum::{serve, Json, Router};
use axum::extract::{Path, State};
use axum::response::IntoResponse;
use axum::routing::{get, post};
use dotenvy::dotenv;
use http::StatusCode;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, PgPool};
use tokio::net::TcpListener;

mod core;
mod app;

#[tokio::main]
async fn main() {

    let app = app().await;

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

async fn db() -> PgPool {
    dotenv().ok();
    let db_url = env::var("DATABASE_URL").unwrap();
    let pool = sqlx::postgres::PgPool::connect(&*db_url).await.unwrap();

    pool
}

async fn get_categories_list(State(pool): State<PgPool>) -> impl IntoResponse {
    let todos : Vec<Category> = sqlx::query_as("SELECT * FROM categories").fetch_all(&pool).await.unwrap();

    let todos_json = serde_json::to_string_pretty(&todos).unwrap();

    (StatusCode::OK, todos_json)
}

async fn get_single_categories(State(pool): State<PgPool>, Path(id): Path<i32>) -> impl IntoResponse {
    let rows: Vec<Category> = sqlx::query_as("SELECT * FROM categories WHERE id = $1").bind(&id).fetch_all(&pool).await.unwrap();

    if rows.len() == 0 {
        let msg = format!("No Categories id : {id} Found!");
        (StatusCode::NOT_FOUND, msg)
    } else {
        let todo_json = serde_json::to_string_pretty(&rows[0]).unwrap();
        (StatusCode::OK, todo_json)
    }
}

async fn add_categories(State(pool): State<PgPool>, Json(todo_req): Json<CategoryDto>) -> impl IntoResponse {
    sqlx::query("INSERT INTO categories (name) VALUES ($1)").bind(&todo_req.name).execute(&pool).await.unwrap();

    (StatusCode::OK, "Add new Categories Successful!")
}

async fn app () -> Router {
    let pool = db().await;
    Router::new()
        .route("/categories", get(get_categories_list))
        .route("/categories/{id}", get(get_single_categories))
        .route("/add_categories", post(add_categories))
        .with_state(pool)

}
