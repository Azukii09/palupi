#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Category {
    pub id: i32,
    pub name: String,
}

impl Category {
    pub fn new(id: i32, name: String) -> Self {
        Self {
            id,
            name,
        }
    }
}
