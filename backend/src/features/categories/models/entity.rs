use uuid::Uuid;
use chrono::{DateTime, Utc};
use sqlx::FromRow;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Category {
    pub id: Uuid,
    pub status: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
}

impl Category {
    // Creates a new Category instance with provided id and status
    // Sets created_at and updated_at to current time, and deleted_at to None
    pub fn new(
        id: Uuid,
        status: bool
    ) -> Self {
        let now = Utc::now();
        Self { id, status, created_at: now, updated_at: now, deleted_at: None }
    }

    // Performs a soft delete by setting deleted_at to current time
    // Also updates the updated_at timestamp
    pub fn soft_delete(&mut self) {
        let now = Utc::now();
        self.deleted_at = Some(now);
        self.updated_at = now;
    }

    // Restores a soft-deleted category by setting deleted_at to None
    // Updates the updated_at timestamp
    pub fn restore(&mut self) {
        self.deleted_at = None;
        self.updated_at = Utc::now();
    }

    // Checks if the category is active (not soft-deleted)
    // Returns true if deleted_at is None
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
    // Creates a new CategoryTranslation instance with provided details
    // Sets created_at and updated_at to current time, and deleted_at to None
    pub fn new(
        category_id: Uuid,
        locale: impl Into<String>,
        name: impl Into<String>,
        description: Option<String>
    ) -> Self {
        let now = Utc::now();
        Self {
            category_id,
            locale: locale.into(),
            name: name.into(),
            description,
            created_at: now,
            updated_at: now,
            deleted_at: None
        }
    }

    // Updates the name of the category translation
    // Also updates the updated_at timestamp
    pub fn set_name(
        &mut self,
        name: impl Into<String>
    ) {
        self.name = name.into();
        self.updated_at = Utc::now();
    }

    // Updates the description of the category translation
    // Also updates the updated_at timestamp
    pub fn set_description(
        &mut self,
        description: Option<String>
    ) {
        self.description = description;
        self.updated_at = Utc::now();
    }

    // Performs a soft delete by setting deleted_at to current time
    // Also updates the updated_at timestamp
    pub fn soft_delete(&mut self) {
        let now = Utc::now();
        self.deleted_at = Some(now);
        self.updated_at = now;
    }

    // Restores a soft-deleted category translation by setting deleted_at to None
    // Updates the updated_at timestamp
    pub fn restore(&mut self) {
        self.deleted_at = None;
        self.updated_at = Utc::now();
    }
}

#[derive(Debug, Clone, PartialEq, Eq, FromRow)]
pub struct CategoryI18n {
    pub id: Uuid,
    pub status: bool,
    pub name: String,
    pub description: Option<String>,
}
