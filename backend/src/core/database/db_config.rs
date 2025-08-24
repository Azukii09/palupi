use std::env;
use dotenvy::dotenv;

pub struct DBConfig {
    pub database_url: String,
    pub database_max_connections: u32,
    pub database_min_connections: u32,
    pub database_acquire_timeout: u64,
    pub database_idle_timeout: u64,
}

impl DBConfig {
    pub fn from_env_cfg() -> Self {
        dotenv().ok();
        Self {
            database_url: env::var("DATABASE_URL").unwrap(),
            database_max_connections: env::var("DATABASE_MAX_CONNECTIONS").unwrap().parse().unwrap(),
            database_min_connections: env::var("DATABASE_MIN_CONNECTIONS").unwrap().parse().unwrap(),
            database_acquire_timeout: env::var("DATABASE_ACQUIRE_TIMEOUT").unwrap().parse().unwrap(),
            database_idle_timeout: env::var("DATABASE_IDLE_TIMEOUT").unwrap().parse().unwrap(),
        }
    }
}
