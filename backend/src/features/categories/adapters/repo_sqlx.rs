use sqlx::{PgPool};

#[derive(Clone)]
pub struct CategoryRepoSqlx {
    pub pool: PgPool,
}

impl CategoryRepoSqlx {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}
