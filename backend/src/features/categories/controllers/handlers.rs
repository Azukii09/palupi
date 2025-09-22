use axum::{
    extract::{Path, Query, State},
    Json,
};
use http::StatusCode;
use uuid::Uuid;

use crate::core::errors::error::{AppError, DomainError};
use crate::core::response::global_response::ApiResponse;

use crate::features::categories::adapters::repo_sqlx::CategoryRepoSqlx;
use crate::features::categories::controllers::dto::{
    CategoryResponse, CreateCategoryRequest, UpdateCategoryRequest, LocaleParam,
};
use crate::features::categories::services::create_category::CreateCategory;
use crate::features::categories::services::update_category::UpdateCategory;
use crate::features::categories::services::get_all_category::GetAllCategory;
use crate::features::categories::services::get_by_id_category::GetCategoryById;
use crate::features::categories::services::soft_delete_category::SoftDeleteCategory;

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
    // --- Validasi ringan di layer presentation (fail-fast) ---
    let name_trim = payload.name.trim();
    if name_trim.is_empty() {
        return Err(AppError::Domain(DomainError::Validation(
            "name cannot be empty".into(),
        )));
    }
    if name_trim.len() > 255 {
        return Err(AppError::Domain(DomainError::Validation(
            "name too long (>255)".into(),
        )));
    }
    // (Validasi format locale dilakukan di entity/usecase; optional kalau mau cek di sini juga)

    let status = payload.status.unwrap_or(true);

    // Catatan: clone repo agar tidak memindahkan state.repo
    let uc = CreateCategory(state.repo.clone());

    let created = uc
        .run(&q.locale, name_trim, payload.description.as_deref(), status)
        .await?; // -> CategoryI18n (akan tervalidasi lagi di domain)

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
