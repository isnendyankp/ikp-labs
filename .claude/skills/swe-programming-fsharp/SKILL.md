# Skill: F# Programming Standards

**Category**: Software Engineering
**Purpose**: Idiomatic F# patterns, functional-first programming, discriminated unions, Railway-oriented programming, and xUnit testing
**Used By**: swe-fsharp-dev

---

## Overview

F# is a functional-first language on the .NET platform. It emphasizes immutability, expression-based programming, and algebraic data types. F# runs on the same runtime as C# and can interoperate with .NET libraries.

**Core philosophy**: Make illegal states unrepresentable. Use the type system to eliminate entire categories of bugs.

---

## Project Structure

```text
MyProject/
├── MyProject.sln
├── src/
│   ├── MyProject.Domain/           # Pure domain types and logic
│   │   ├── MyProject.Domain.fsproj
│   │   └── Domain.fs               # Types and pure functions
│   └── MyProject.Api/              # Application layer
│       ├── MyProject.Api.fsproj
│       ├── Program.fs
│       └── Handlers.fs
└── tests/
    └── MyProject.Tests/
        ├── MyProject.Tests.fsproj
        └── DomainTests.fs
```

**Important**: F# files are compiled in order — the order in `.fsproj` matters.

---

## .NET CLI with FSharp

```bash
dotnet new console -lang F# -n MyProject     # Console app
dotnet new webapi -lang F# -n MyProject.Api  # Web API
dotnet new xunit -lang F# -n MyProject.Tests # Test project
dotnet build && dotnet run
dotnet test
```

---

## Core F# Syntax

### Immutable by Default

```fsharp
// Immutable binding (default)
let name = "Alice"

// Mutable when needed
let mutable count = 0
count <- count + 1
```

### Functions

```fsharp
// Simple function
let add x y = x + y

// With type annotations
let greet (name: string) : string =
    $"Hello, {name}!"

// Pipe operator — chain transformations
let result =
    [1..10]
    |> List.filter (fun x -> x % 2 = 0)
    |> List.map (fun x -> x * x)
    |> List.sum
```

### Records

```fsharp
type User = {
    Id: int
    Name: string
    Email: string
}

// Create
let user = { Id = 1; Name = "Alice"; Email = "alice@example.com" }

// Update (copy-and-update expression)
let updated = { user with Name = "Alice Updated" }
```

---

## Discriminated Unions

Model domain states explicitly — make invalid states unrepresentable.

```fsharp
type UserStatus =
    | Active
    | Inactive
    | Suspended of reason: string

type ValidationError =
    | EmailInvalid of string
    | NameTooShort of minLength: int
    | NameTooLong of maxLength: int

// Pattern matching — compiler enforces exhaustiveness
let describeStatus status =
    match status with
    | Active -> "User is active"
    | Inactive -> "User is inactive"
    | Suspended reason -> $"Suspended: {reason}"
```

---

## Railway-Oriented Programming (ROP)

Model operations that can fail as a pipeline of `Result<'T, 'Error>`.

```fsharp
type AppError =
    | UserNotFound of int
    | ValidationFailed of string
    | DatabaseError of string

// Each step returns Result
let validateEmail (email: string) : Result<string, AppError> =
    if email.Contains("@") then Ok email
    else Error (ValidationFailed $"Invalid email: {email}")

let findUser (id: int) : Result<User, AppError> =
    match db.TryFindUser(id) with
    | Some user -> Ok user
    | None -> Error (UserNotFound id)

// Chain with Result.bind (flatMap)
let processUser id =
    findUser id
    |> Result.bind (fun user -> validateEmail user.Email)
    |> Result.map (fun email -> { user with Email = email })

// Computation expression (CE) for cleaner chaining
let processUserCE id = result {
    let! user = findUser id
    let! email = validateEmail user.Email
    return { user with Email = email }
}
```

---

## Option Type

Use `Option<'T>` instead of null.

```fsharp
let findUserById (id: int) : User option =
    users |> List.tryFind (fun u -> u.Id = id)

// Pattern match
match findUserById 1 with
| Some user -> printfn $"Found: {user.Name}"
| None -> printfn "Not found"

// Option.map — transform if present
let userName = findUserById 1 |> Option.map (fun u -> u.Name)
```

---

## Async Programming

```fsharp
open System.Threading.Tasks

// F# async workflow
let fetchDataAsync () = async {
    let! response = httpClient.GetStringAsync("https://api.example.com") |> Async.AwaitTask
    return response
}

// Task CE (F# 6+, interops better with .NET)
let fetchDataTask () = task {
    let! response = httpClient.GetStringAsync("https://api.example.com")
    return response
}

// Run async
let result = fetchDataAsync () |> Async.RunSynchronously
```

---

## Testing with xUnit

```fsharp
module UserServiceTests

open Xunit
open FsUnit.Xunit

[<Fact>]
let ``getById returns user when found`` () =
    let service = UserService(mockRepo)
    let result = service.GetById(1)
    result |> should equal (Some { Id = 1; Name = "Alice"; Email = "alice@example.com" })

[<Fact>]
let ``getById returns None when not found`` () =
    let service = UserService(mockRepo)
    let result = service.GetById(999)
    result |> should equal None

[<Theory>]
[<InlineData(1, "Alice")>]
[<InlineData(2, "Bob")>]
let ``getById returns correct name`` (id: int) (expectedName: string) =
    let result = service.GetById(id)
    result |> Option.map (fun u -> u.Name) |> should equal (Some expectedName)
```

Run: `dotnet test`

---

## Common Conventions

| Convention | Rule |
|---|---|
| Naming | `camelCase` for values/functions, `PascalCase` for types |
| Modules | Group related types and functions in a module |
| `let` bindings | Prefer immutable; use `mutable` only when necessary |
| `null` | Avoid — use `Option<'T>` instead |
| Exceptions | Use `Result<'T, 'Error>` for expected failures, exceptions for unexpected |
| Indentation | 4 spaces — F# is indentation-sensitive |

---

## Related Skills

- **swe-developing-applications-common** — General dev workflow (branching, commits, PRs)
- **swe-programming-csharp** — C# interop patterns when mixing F# and C# in a solution

---

**Last Updated**: 2026-06-18
