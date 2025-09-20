use axum::{
    extract::{Path, Query, State},
    Json,
};
use http::StatusCode;
use uuid::Uuid;

use crate::core::errors::error::AppError;
use crate::core::response::global_response::ApiResponse;

use crate::features::categories::adapters::repo_sqlx::CategoryRepoSqlx;
use crate::features::categories::controllers::dto::{
    CategoryResponse, CreateCategoryRequest, UpdateCategoryRequest, LocaleParam,
};
use crate::features::categories::services::use_cases::{
    GetAllCategory, GetCategoryById, AddCategory, UpdateCategory, SoftDeleteCategory
};

#[derive(Clone)]
pub struct AppState {
    pub repo: CategoryRepoSqlx,
}

pub async fn list_categories(
    State(state): State<AppState>,
    Query(q): Query<LocaleParam>,
) -> Result<Json<ApiResponse<Vec<CategoryResponse>>>, AppError> {
    let uc = GetAllCategory(state.repo);
    let items = uc.run(&q.locale).await?; // -> Vec<CategoryI18n>
    let resp: Vec<CategoryResponse> = items.into_iter().map(Into::into).collect();
    Ok(Json(ApiResponse::success(resp)))
}

pub async fn get_category(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Query(q): Query<LocaleParam>,
) -> Result<Json<ApiResponse<CategoryResponse>>, AppError> {
    let uc = GetCategoryById(state.repo);
    let item = uc.run(id, &q.locale).await?; // -> CategoryI18n
    Ok(Json(ApiResponse::success(item.into())))
}

pub async fn create_category(
    State(state): State<AppState>,
    Query(q): Query<LocaleParam>,
    Json(payload): Json<CreateCategoryRequest>,
) -> Result<(StatusCode, Json<ApiResponse<CategoryResponse>>), AppError> {
    let uc = AddCategory(state.repo);
    let status = payload.status.unwrap_or(true);

    let created = uc
        .run(&q.locale, &payload.name, payload.description.as_deref(), status)
        .await?; // -> CategoryI18n

    Ok((
        StatusCode::CREATED,
        Json(ApiResponse::created(created.into())),
    ))
}

pub async fn update_category(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Query(q): Query<LocaleParam>,
    Json(payload): Json<UpdateCategoryRequest>,
) -> Result<Json<ApiResponse<CategoryResponse>>, AppError> {
    let uc = UpdateCategory(state.repo);

    let updated = uc
        .run(
            id,
            &q.locale,
            payload.status,
            payload.name.as_deref(),
            payload.description.as_deref(),
        )
        .await?; // -> CategoryI18n

    Ok(Json(ApiResponse::success(updated.into())))
}

pub async fn delete_category(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, AppError> {
    let uc = SoftDeleteCategory(state.repo);
    uc.run(id).await?;
    Ok(StatusCode::NO_CONTENT)
}
