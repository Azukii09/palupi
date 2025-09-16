use axum::extract::{Path, State};
use axum::Json;
use crate::core::errors::error::AppError;
use crate::features::categories::adapters::repo_sqlx::CategoryRepoSqlx;
use crate::features::categories::controllers::dto::CategoryResponse;
use crate::features::categories::services::use_cases::{GetAll, GetById};

#[derive(Clone)]
pub struct AppState {
    pub repo: CategoryRepoSqlx,
}

pub async fn list_categories(State(state): State<AppState>) -> Result<Json<Vec<CategoryResponse>>, AppError> {
    let uc = GetAll(state.repo);
    let items = uc.run().await?;
    let resp = items.into_iter().map(|c| CategoryResponse { id: c.id, name: c.name }).collect();
    Ok(Json(resp))
}

pub async fn get_category(State(state): State<AppState>, Path(id): Path<i32>) -> Result<Json<CategoryResponse>, AppError> {
    let uc = GetById(state.repo);
    let c = uc.run(id).await?;
    Ok(Json(CategoryResponse { id: c.id, name: c.name }))
}
