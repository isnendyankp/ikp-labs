# Skill: C# Programming Standards

**Category**: Software Engineering
**Purpose**: Idiomatic C# patterns, .NET conventions, async/await, NuGet, and xUnit testing
**Used By**: swe-csharp-dev

---

## Overview

C# is a strongly-typed, object-oriented language running on the .NET platform. Modern C# (10+) emphasizes concise syntax, nullable reference types, and async-first programming.

**Core philosophy**: Explicit over implicit. Use the type system and async/await to write readable, safe code.

---

## Project Structure

```text
MyProject/
├── MyProject.sln                   # Solution file
├── src/
│   ├── MyProject.Api/              # Web API project
│   │   ├── MyProject.Api.csproj
│   │   ├── Program.cs
│   │   ├── Controllers/
│   │   ├── Services/
│   │   └── Models/
│   └── MyProject.Core/             # Domain/business logic
│       ├── MyProject.Core.csproj
│       ├── Entities/
│       └── Interfaces/
└── tests/
    └── MyProject.Tests/
        ├── MyProject.Tests.csproj
        └── Services/
```

---

## .NET CLI and NuGet

```bash
dotnet new webapi -n MyProject.Api   # Create Web API project
dotnet new xunit -n MyProject.Tests  # Create test project
dotnet build                         # Build
dotnet run                           # Run
dotnet test                          # Run tests
dotnet add package PackageName       # Add NuGet package
dotnet restore                       # Restore dependencies
```

**`.csproj` example:**

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="8.0.0" />
    <PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="8.0.0" />
  </ItemGroup>
</Project>
```

---

## Idiomatic C# Patterns

### Records (immutable data)

```csharp
public record User(int Id, string Name, string Email);

// With mutation via with-expression
var updated = user with { Name = "Alice Updated" };
```

### Nullable Reference Types

Always enable `<Nullable>enable</Nullable>` in `.csproj`.

```csharp
// Non-nullable — compiler enforces initialization
public string Name { get; set; } = string.Empty;

// Nullable — must check before use
public string? MiddleName { get; set; }

if (user.MiddleName is not null)
{
    Console.WriteLine(user.MiddleName.ToUpper());
}
```

### Pattern Matching

```csharp
var message = status switch
{
    Status.Active => "User is active",
    Status.Inactive => "User is inactive",
    Status.Suspended { Reason: var reason } => $"Suspended: {reason}",
    _ => "Unknown status"
};
```

### Dependency Injection

Use constructor injection — .NET's built-in DI container handles wiring.

```csharp
public class UserService
{
    private readonly IUserRepository _repo;
    private readonly ILogger<UserService> _logger;

    public UserService(IUserRepository repo, ILogger<UserService> logger)
    {
        _repo = repo;
        _logger = logger;
    }
}

// Register in Program.cs
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
```

---

## Async/Await

All I/O operations must be async. Never block async code with `.Result` or `.Wait()`.

```csharp
// Good
public async Task<User?> GetByIdAsync(int id, CancellationToken ct = default)
{
    return await _repo.FindByIdAsync(id, ct);
}

// Good — ConfigureAwait in library code
var user = await _repo.FindByIdAsync(id).ConfigureAwait(false);

// Bad — blocks the thread
var user = _repo.FindByIdAsync(id).Result; // deadlock risk
```

### Controller Example

```csharp
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _service;

    public UsersController(IUserService service) => _service = service;

    [HttpGet("{id:int}")]
    public async Task<ActionResult<User>> GetUser(int id, CancellationToken ct)
    {
        var user = await _service.GetByIdAsync(id, ct);
        return user is null ? NotFound() : Ok(user);
    }
}
```

---

## Error Handling

Use exceptions for exceptional conditions — not flow control.

```csharp
// Custom exception
public class UserNotFoundException : Exception
{
    public UserNotFoundException(int id)
        : base($"User {id} not found") { }
}

// Global exception handler (Program.cs)
app.UseExceptionHandler(builder =>
{
    builder.Run(async context =>
    {
        context.Response.StatusCode = 500;
        await context.Response.WriteAsJsonAsync(new { error = "Internal server error" });
    });
});
```

---

## Testing with xUnit

```csharp
public class UserServiceTests
{
    private readonly Mock<IUserRepository> _repoMock = new();
    private readonly UserService _sut;

    public UserServiceTests()
    {
        _sut = new UserService(_repoMock.Object, NullLogger<UserService>.Instance);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsUser_WhenFound()
    {
        // Arrange
        var user = new User(1, "Alice", "alice@example.com");
        _repoMock.Setup(r => r.FindByIdAsync(1, default)).ReturnsAsync(user);

        // Act
        var result = await _sut.GetByIdAsync(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Alice", result.Name);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsNull_WhenNotFound()
    {
        _repoMock.Setup(r => r.FindByIdAsync(99, default)).ReturnsAsync((User?)null);

        var result = await _sut.GetByIdAsync(99);

        Assert.Null(result);
    }

    [Theory]
    [InlineData(1, "Alice")]
    [InlineData(2, "Bob")]
    public async Task GetByIdAsync_ReturnsCorrectName(int id, string expectedName)
    {
        _repoMock.Setup(r => r.FindByIdAsync(id, default))
            .ReturnsAsync(new User(id, expectedName, $"{expectedName}@example.com"));

        var result = await _sut.GetByIdAsync(id);

        Assert.Equal(expectedName, result?.Name);
    }
}
```

Run: `dotnet test` | `dotnet test --logger "console;verbosity=detailed"`

---

## Common Conventions

| Convention | Rule |
|---|---|
| Naming | `PascalCase` for types/methods/properties, `camelCase` for locals |
| Interfaces | Prefix with `I`: `IUserService`, `IRepository<T>` |
| Async methods | Suffix with `Async`: `GetByIdAsync`, `SaveAsync` |
| Private fields | Prefix with `_`: `_repository`, `_logger` |
| `var` | Use when type is obvious from the right side |
| Nullable | Enable globally, annotate `?` explicitly |

---

## Related Skills

- **swe-developing-applications-common** — General dev workflow (branching, commits, PRs)

---

**Last Updated**: 2026-06-18
