use axum::{serve, Json, Router};
use axum::extract::{Path, State};
use axum::response::IntoResponse;
use axum::routing::{delete, get, post, put};
use http::StatusCode;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, PgPool};
use tokio::net::TcpListener;
use crate::core::database::db::init_pool;
use crate::core::database::db_config::DBConfig;

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

async fn delete_categories(State(pool): State<PgPool>, Path(id): Path<i32>) -> impl IntoResponse {
    let rows: Vec<Category> = sqlx::query_as("SELECT * FROM categories WHERE id = $1").bind(&id).fetch_all(&pool).await.unwrap();

    if rows.len() == 0 {
        let msg = format!("No Categories id : {id} Found!");
        (StatusCode::NOT_FOUND, msg)
    } else {
        sqlx::query("DELETE FROM categories WHERE id = $1").bind(&id).execute(&pool).await.unwrap();
        (StatusCode::OK, "Delete Categories Successful!".to_string())
    }
}

async fn update_categories(State(pool): State<PgPool>, Path(id): Path<i32>, Json(todo_req): Json<CategoryDto>) -> impl IntoResponse {
    let rows: Vec<Category> = sqlx::query_as("SELECT * FROM categories WHERE id = $1").bind(&id).fetch_all(&pool).await.unwrap();

    if rows.len() == 0 {
        let msg = format!("No Categories id : {id} Found!");
        (StatusCode::NOT_FOUND, msg)
    } else {
        sqlx::query("UPDATE categories SET name = $1 WHERE id = $2").bind(&todo_req.name).bind(&id).execute(&pool).await.unwrap();

        (StatusCode::OK, "Update Categories Successful!".to_string())
    }
}

async fn app () -> Router {
    let db = DBConfig::from_env_cfg();
    let pool = init_pool(&db).await.unwrap();
    Router::new()
        .route("/categories", get(get_categories_list))
        .route("/categories/{:id}", get(get_single_categories))
        .route("/add_categories", post(add_categories))
        .route("/delete_categories/{:id}", delete(delete_categories))
        .route("/update_categories/{:id}", put(update_categories))
        .with_state(pool)

}
