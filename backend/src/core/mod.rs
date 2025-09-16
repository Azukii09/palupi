use sqlx::{ Error, PgPool};
use crate::core::database::db::init_pool;

pub mod database;
pub mod errors;

pub async fn connections_pool() -> Result<PgPool, Error> {
    let cfg = crate::core::database::db_config::DBConfig::from_env_cfg();
    let pool = init_pool(&cfg).await?;
    Ok(pool)
}
