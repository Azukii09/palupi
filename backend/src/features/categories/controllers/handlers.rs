use axum::extract::{Path, State};
use axum::Json;
use http::StatusCode;
use crate::core::errors::error::AppError;
use crate::features::categories::adapters::repo_sqlx::CategoryRepoSqlx;
use crate::features::categories::controllers::dto::{CategoryResponse, CreateCategoryRequest, UpdateCategoryRequest};
use crate::features::categories::services::use_cases::{AddCategory, DeleteCategory, GetAll, GetById, UpdateCategory};

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

pub async fn create_category(State(state): State<AppState>, Json(payload): Json<CreateCategoryRequest>) -> Result<(StatusCode, Json<CategoryResponse>), AppError> {
    let uc = AddCategory(state.repo);
    let c = uc.run(&payload.name).await?;
    Ok((StatusCode::CREATED, Json(CategoryResponse { id: c.id, name: c.name })))
}

pub async fn update_category(State(state): State<AppState>, Path(id): Path<i32>, Json(payload): Json<UpdateCategoryRequest>) -> Result<Json<CategoryResponse>, AppError> {
    let uc = UpdateCategory(state.repo);
    let c = uc.run(id, &payload.name).await?;
    Ok(Json(CategoryResponse { id: c.id, name: c.name }))
}

pub async fn delete_category(State(state): State<AppState>, Path(id): Path<i32>) -> Result<StatusCode,AppError>{
    let uc = DeleteCategory(state.repo);
    uc.run(id).await?;
    Ok(StatusCode::NO_CONTENT)
}
