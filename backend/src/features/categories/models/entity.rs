use uuid::Uuid;
use chrono::{DateTime, Utc};
use sqlx::FromRow;
use regex::Regex;
use crate::features::categories::models::repo::DomainError;

const NAME_MAX: usize = 255;

fn normalize_name(s: &str) -> String { s.trim().to_string() }

fn validate_name(s: &str) -> Result<(), DomainError> {
    let t = s.trim();
    if t.is_empty() {
        return Err(DomainError::Validation("name cannot be empty".into()));
    }
    if t.len() > NAME_MAX {
        return Err(DomainError::Validation(format!("name too long (>{})", NAME_MAX)));
    }
    Ok(())
}

/// Format sederhana: "xx" atau "xx-YY"
fn validate_locale_format(locale: &str) -> Result<(), DomainError> {
    // Regex dibuat sekali; di-prod bisa pakai lazy_static, tapi ini cukup.
    let re = Regex::new(r"^[a-z]{2}(-[A-Za-z]{2})?$").unwrap();
    if !re.is_match(locale) {
        return Err(DomainError::Validation("invalid locale format".into()));
    }
    Ok(())
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Category {
    pub id: Uuid,
    pub status: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
}

impl Category {
    pub fn new(id: Uuid, status: bool) -> Self {
        let now = Utc::now();
        Self { id, status, created_at: now, updated_at: now, deleted_at: None }
    }
    pub fn soft_delete(&mut self) { let now = Utc::now(); self.deleted_at = Some(now); self.updated_at = now; }
    pub fn restore(&mut self) { self.deleted_at = None; self.updated_at = Utc::now(); }
    pub fn is_active(&self) -> bool { self.deleted_at.is_none() }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CategoryTranslation {
    pub category_id: Uuid,
    pub locale: String,
    pub name: String,
    pub description: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
}

impl CategoryTranslation {
    pub fn try_new(
        category_id: Uuid,
        locale: impl Into<String>,
        name: impl Into<String>,
        description: Option<String>
    ) -> Result<Self, DomainError> {
        let locale = locale.into();
        validate_locale_format(&locale)?;
        let name = name.into();
        validate_name(&name)?;
        let now = Utc::now();
        Ok(Self {
            category_id,
            locale,
            name: normalize_name(&name),
            description,
            created_at: now,
            updated_at: now,
            deleted_at: None,
        })
    }

    pub fn set_name(&mut self, name: impl Into<String>) -> Result<(), DomainError> {
        let n = name.into();
        validate_name(&n)?;
        self.name = normalize_name(&n);
        self.updated_at = Utc::now();
        Ok(())
    }

    pub fn set_description(&mut self, description: Option<String>) {
        self.description = description;
        self.updated_at = Utc::now();
    }

    pub fn soft_delete(&mut self) { let now = Utc::now(); self.deleted_at = Some(now); self.updated_at = now; }
    pub fn restore(&mut self) { self.deleted_at = None; self.updated_at = Utc::now(); }
}

#[derive(Debug, Clone, PartialEq, Eq, FromRow)]
pub struct CategoryI18n {
    pub id: Uuid,
    pub status: bool,
    pub name: String,
    pub description: Option<String>,
}
