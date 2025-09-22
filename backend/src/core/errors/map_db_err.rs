use sqlx::Error as SqlxError;
use crate::core::errors::error::DomainError;

// Bisa dipakai lintas repo yang memakai Postgres.
pub fn map_db_err(e: SqlxError) -> DomainError {
    match &e {
        // 404 domain
        SqlxError::RowNotFound => DomainError::NotFound,

        // Error dari server Postgres (punya SQLSTATE)
        SqlxError::Database(db) => {
            // Hindari borrow dari temporer: simpan dulu Cow
            let code_cow = db.code();              // Option<Cow<'_, str>>
            let code = code_cow.as_deref();        // Option<&str> (aman)

            match code {
                // 23505 unique_violation
                Some("23505") if db.is_unique_violation() =>
                    DomainError::Conflict(hide_or_keep(db.message())),

                // 23503 foreign_key_violation (contoh: locale tidak ada di languages)
                Some("23503") =>
                    DomainError::Validation("foreign key violation".into()),

                // 23502 not_null_violation
                Some("23502") =>
                    DomainError::Validation("null value violates not-null constraint".into()),

                // 23514 check_violation
                Some("23514") =>
                    DomainError::Validation("check constraint violation".into()),

                // 23P01 exclusion_violation
                Some("23P01") =>
                    DomainError::Conflict("exclusion constraint violation".into()),

                // 22001 string_data_right_truncation (terlalu panjang utk kolom)
                Some("22001") =>
                    DomainError::Validation("value too long for column".into()),

                // 22P02 invalid_text_representation (UUID/enum/syntax)
                Some("22P02") =>
                    DomainError::Validation("invalid input syntax".into()),

                // 22003 numeric_value_out_of_range
                Some("22003") =>
                    DomainError::Validation("numeric value out of range".into()),

                // 40001 serialization_failure (biasanya retryable)
                Some("40001") =>
                    DomainError::Internal("serialization failure".into()),

                // 40P01 deadlock_detected (biasanya retryable)
                Some("40P01") =>
                    DomainError::Internal("deadlock detected".into()),

                // default fallback: internal (jangan leak pesan DB mentah ke klien)
                _ => DomainError::Internal("database error".into()),
            }
        }

        // Timeout pool / koneksi / protokol dll -> 500
        SqlxError::PoolTimedOut =>
            DomainError::Internal("database timeout".into()),
        SqlxError::Io(_) =>
            DomainError::Internal("database io error".into()),
        SqlxError::Tls(_) =>
            DomainError::Internal("database tls error".into()),
        SqlxError::Protocol(_) | SqlxError::Configuration(_) =>
            DomainError::Internal("database protocol/config error".into()),

        // Decode/kolom tidak cocok → bug di layer infra → 500
        SqlxError::ColumnNotFound(_) |
        SqlxError::ColumnIndexOutOfBounds { .. } |
        SqlxError::Decode(_) |
        SqlxError::TypeNotFound { .. } =>
            DomainError::Internal("database decoding error".into()),

        // catch-all
        _ => DomainError::Internal("internal database error".into()),
    }
}

// Jika kamu memang ingin mempertahankan pesan untuk 409 (unique) saja:
fn hide_or_keep(msg: &str) -> String {
    // Saran: parse nama constraint & ganti dg pesan human-readable.
    msg.to_string()
}
