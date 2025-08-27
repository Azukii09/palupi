use axum::{serve};
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

#[cfg(test)]
mod test {
    use std::env;
    use axum::extract::Request;
    use axum::Router;
    use axum::routing::get;
    use axum_test::TestServer;
    use dotenvy::dotenv;
    use sqlx::{Connection, Error, PgConnection};
    use crate::core::database::db::init_pool;

    #[tokio::test]
    async fn connections_db() -> Result<(), Error> {
        dotenv().ok();
        let url = env::var("DATABASE_URL").unwrap();
        let conn = PgConnection::connect(&url).await?;
        conn.close().await?;

        Ok(())
    }

    #[tokio::test]
    async fn connections_pool() -> Result<(), Error> {
        let cfg = crate::core::database::db_config::DBConfig::from_env_cfg();

        let pool = init_pool(&cfg).await?;
        pool.close().await;
        Ok(())
    }

    #[tokio::test]
    async fn test_app() {
        async fn hello_world(request: Request) ->  String {
            format!("Hello, world! {}", request.uri().path())
        }
        let app = Router::new()
            .route("/get", get(hello_world));

        let server = TestServer::new(app).unwrap();
        let response = server.get("/get").await;

        response.assert_status_ok();
        response.assert_text("Hello, world! /get");
    }
}
