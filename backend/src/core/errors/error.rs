use axum::response::{IntoResponse, Response};
use http::StatusCode;
use crate::features::categories::models::repo::DomainError;

#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error(transparent)]
    Domain(#[from] DomainError),
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        match self {
            AppError::Domain(DomainError::NotFound) =>
                (StatusCode::NOT_FOUND, "Not Found").into_response(),
            AppError::Domain(DomainError::Conflict(msg)) =>
                (StatusCode::CONFLICT, msg).into_response(),
            _ => (StatusCode::INTERNAL_SERVER_ERROR, "Internal Server Error").into_response(),
        }
    }
}
