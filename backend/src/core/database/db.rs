use std::time::Duration;
use sqlx::{Error, Pool, Postgres};
use sqlx::postgres::PgPoolOptions;
use crate::core::database::db_config::DBConfig;

pub async fn init_pool(cfg: &DBConfig) -> Result<Pool<Postgres>,Error> {
    PgPoolOptions::new()
        .max_connections(cfg.database_max_connections)
        .min_connections(cfg.database_min_connections)
        .acquire_timeout(Duration::from_secs(cfg.database_acquire_timeout))
        .idle_timeout(Duration::from_secs(cfg.database_idle_timeout))
        .connect(&cfg.database_url).await
}
