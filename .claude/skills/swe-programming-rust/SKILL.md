# Skill: Rust Programming Standards

**Category**: Software Engineering
**Purpose**: Idiomatic Rust patterns, ownership model, error handling with Result/Option, Cargo, and testing conventions
**Used By**: swe-rust-dev

---

## Overview

Rust is a systems programming language focused on safety, performance, and concurrency — without a garbage collector. The compiler enforces memory safety through the **ownership model** at compile time.

**Core philosophy**: If it compiles, it's (mostly) safe. Fight the borrow checker once; trust it forever.

---

## Project Structure

```text
my-project/
├── Cargo.toml          # Package manifest and dependencies
├── Cargo.lock          # Locked dependency versions (commit for binaries, gitignore for libs)
├── src/
│   ├── main.rs         # Binary entry point
│   ├── lib.rs          # Library entry point
│   └── module/
│       └── mod.rs      # Module definition
└── tests/
    └── integration.rs  # Integration tests
```

---

## Cargo Basics

```bash
cargo new my-project        # Create binary project
cargo new my-lib --lib      # Create library project
cargo build                 # Debug build
cargo build --release       # Optimized build
cargo run                   # Build and run
cargo test                  # Run all tests
cargo test user_service      # Run tests matching name
cargo clippy                # Linter
cargo fmt                   # Formatter
```

**`Cargo.toml` example:**

```toml
[package]
name = "my-project"
version = "0.1.0"
edition = "2021"

[dependencies]
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
anyhow = "1"
thiserror = "1"
```

---

## Ownership Model

Rust enforces three rules at compile time:

1. Each value has exactly one owner
2. When the owner goes out of scope, the value is dropped
3. There can be either one mutable reference OR any number of immutable references — never both simultaneously

```rust
// Move — ownership transferred
let s1 = String::from("hello");
let s2 = s1; // s1 is moved, no longer valid

// Clone — explicit deep copy
let s1 = String::from("hello");
let s2 = s1.clone(); // both valid

// Borrow — immutable reference
fn print_len(s: &String) {
    println!("{}", s.len());
}

// Mutable borrow
fn push_world(s: &mut String) {
    s.push_str(", world");
}
```

### Lifetimes

Lifetimes ensure references do not outlive the data they point to:

```rust
// Compiler infers lifetimes in simple cases
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
```

---

## Error Handling

### Result and Option

```rust
// Result<T, E> — operation that can fail
fn parse_port(s: &str) -> Result<u16, std::num::ParseIntError> {
    s.parse::<u16>()
}

// Option<T> — value that may be absent
fn find_user(id: u32) -> Option<User> {
    users.iter().find(|u| u.id == id).cloned()
}
```

### The ? Operator

Propagate errors up the call stack concisely:

```rust
fn read_config(path: &str) -> Result<Config, Box<dyn Error>> {
    let content = std::fs::read_to_string(path)?; // returns early on error
    let config: Config = serde_json::from_str(&content)?;
    Ok(config)
}
```

### Custom Error Types with thiserror

```rust
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("user not found: {id}")]
    UserNotFound { id: u32 },

    #[error("database error: {0}")]
    Database(#[from] sqlx::Error),

    #[error("io error: {0}")]
    Io(#[from] std::io::Error),
}
```

### anyhow for Application Code

```rust
use anyhow::{Context, Result};

fn run() -> Result<()> {
    let config = read_config("config.toml")
        .context("failed to read config")?;
    Ok(())
}
```

---

## Structs, Enums, and Traits

### Structs

```rust
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct User {
    pub id: u32,
    pub name: String,
    pub email: String,
}

impl User {
    pub fn new(id: u32, name: impl Into<String>, email: impl Into<String>) -> Self {
        Self { id, name: name.into(), email: email.into() }
    }
}
```

### Enums

```rust
#[derive(Debug)]
pub enum Status {
    Active,
    Inactive,
    Suspended { reason: String },
}

// Pattern matching
match user.status {
    Status::Active => println!("active"),
    Status::Inactive => println!("inactive"),
    Status::Suspended { reason } => println!("suspended: {reason}"),
}
```

### Traits (like interfaces)

```rust
pub trait Repository {
    type Error;
    fn find_by_id(&self, id: u32) -> Result<Option<User>, Self::Error>;
    fn save(&self, user: &User) -> Result<(), Self::Error>;
}
```

---

## Async with Tokio

```rust
use tokio;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let result = fetch_data().await?;
    println!("{result}");
    Ok(())
}

async fn fetch_data() -> anyhow::Result<String> {
    let response = reqwest::get("https://api.example.com/data").await?;
    let text = response.text().await?;
    Ok(text)
}
```

---

## Testing

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_user_new() {
        let user = User::new(1, "Alice", "alice@example.com");
        assert_eq!(user.id, 1);
        assert_eq!(user.name, "Alice");
    }

    #[test]
    fn test_parse_port_valid() {
        assert_eq!(parse_port("8080").unwrap(), 8080);
    }

    #[test]
    fn test_parse_port_invalid() {
        assert!(parse_port("not-a-port").is_err());
    }

    // Async test
    #[tokio::test]
    async fn test_fetch_user() {
        let result = fetch_user(1).await;
        assert!(result.is_ok());
    }
}
```

Run: `cargo test` and `cargo test -- --nocapture` for stdout.

---

## Common Conventions

| Convention | Rule |
|---|---|
| Naming | `snake_case` for functions/variables, `PascalCase` for types/traits |
| Error handling | Use `?` operator, never `unwrap()` in production code |
| `unwrap()` | Only in tests or when panic is truly impossible |
| `clone()` | Acceptable but prefer references where possible |
| Modules | One concept per module, keep `mod.rs` thin |
| Derives | Derive `Debug` on all public types |

---

## Related Skills

- **swe-developing-applications-common** — General dev workflow (branching, commits, PRs)

---

**Last Updated**: 2026-06-17
