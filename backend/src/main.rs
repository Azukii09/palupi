use std::time::Duration;
use axum::{serve};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, PgPool};
use sqlx::postgres::PgPoolOptions;
use tokio::net::TcpListener;
use uuid::Uuid;
use crate::app::build_router;

mod core;
mod app;

#[tokio::main]
async fn main() {

    let app = build_router();

    let listener = TcpListener::bind("0.0.0.0:8080").await.unwrap();
    serve(listener,app).await.unwrap()
}
