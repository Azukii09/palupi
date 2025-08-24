mod core;
mod app;

fn main() {
    println!("Hello, world!");
}

#[cfg(test)]
mod test {
    use std::env;
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
}
