use serde::Serialize;

#[derive(Serialize)]
pub struct ApiResponse<T>
where
    T: Serialize,
{
    pub status_code: u16,
    pub message: String,
    pub data: T,
}

impl<T: Serialize> ApiResponse<T> {
    pub fn success(data: T) -> Self {
        Self {
            status_code: 200,
            message: "OK".into(),
            data,
        }
    }

    pub fn created(data: T) -> Self {
        Self {
            status_code: 201,
            message: "Created".into(),
            data,
        }
    }

    pub fn accepted(data: T) -> Self {
        Self {
            status_code: 202,
            message: "Accepted".into(),
            data,
        }
    }

    pub fn no_content(data: T) -> Self {
        Self {
            status_code: 204,
            message: "No Content".into(),
            data,
        }
    }

    pub fn with_message(status: u16, message: &str, data: T) -> Self {
        Self {
            status_code: status,
            message: message.into(),
            data,
        }
    }
}
