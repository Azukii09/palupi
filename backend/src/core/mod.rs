use std::env;
use dotenvy::dotenv;
use sqlx::{Connection, Error, PgConnection};
use crate::core::database::db::init_pool;

pub mod database;

pub async fn connections_pool() -> Result<(), Error> {
    let cfg = crate::core::database::db_config::DBConfig::from_env_cfg();

    let pool = init_pool(&cfg).await?;
    pool.close().await;
    Ok(())
}
