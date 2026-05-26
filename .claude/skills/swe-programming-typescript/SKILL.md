# Skill: TypeScript Programming Standards

**Category**: Software Engineering
**Purpose**: TypeScript + Next.js + React coding standards for IKP-Labs
**Used By**: swe-typescript-dev, swe-code-checker

---

## Naming Conventions

| Context | Convention | Example |
|---------|-----------|---------|
| Types / Interfaces | PascalCase | `UserAccount`, `GalleryItem` |
| Functions / variables | camelCase | `fetchPhotos()`, `userId` |
| Constants | UPPER\_SNAKE\_CASE | `MAX_FILE_SIZE`, `API_BASE_URL` |
| Files | kebab-case | `photo-card.tsx`, `use-gallery.ts` |
| React components | PascalCase | `PhotoCard`, `GalleryGrid` |

---

## TypeScript Standards

### Type Safety

- **No `any`** — use `unknown` + type guard instead
- Enable strict mode in `tsconfig.json`
- Use generics for reusable code
- Prefer `interface` for object shapes, `type` for unions/intersections

```typescript
// ✅ Good
function parseResponse<T>(data: unknown): T {
  if (!isValidResponse(data)) throw new Error('Invalid response');
  return data as T;
}

// ❌ Bad
function parseResponse(data: any): any {
  return data;
}
```

### Modern TypeScript Features

Use utility types:

```typescript
Partial<T>    // all fields optional
Pick<T, K>    // select fields
Omit<T, K>   // exclude fields
Readonly<T>   // immutable
```

Use optional chaining and nullish coalescing:

```typescript
const name = user?.profile?.displayName ?? 'Anonymous';
```

---

## React / Next.js Standards

### Component Pattern

Use functional components with TypeScript props:

```typescript
interface PhotoCardProps {
  photo: Photo;
  onLike?: (id: string) => void;
  className?: string;
}

export function PhotoCard({ photo, onLike, className }: PhotoCardProps) {
  return (
    <div className={cn('rounded-lg', className)}>
      <img src={photo.url} alt={photo.title} />
    </div>
  );
}
```

### Hooks

- Custom hooks prefix: `use` (e.g., `useGallery`, `usePhotoLikes`)
- Keep hooks focused on one concern
- Return objects (not arrays) for multiple values

```typescript
function useGallery(albumId: string) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ... fetch logic

  return { photos, loading, error };
}
```

### Next.js 15 Patterns

- Prefer Server Components for data fetching
- Use `'use client'` only when browser APIs or interactivity needed
- Use `next/image` for all images (optimization)
- Use `next/link` for internal navigation

---

## Error Handling

Use typed errors:

```typescript
class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

Handle async errors explicitly:

```typescript
try {
  const photos = await fetchPhotos(albumId);
  return photos;
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API error ${error.status}: ${error.message}`);
  }
  throw error;
}
```

---

## Testing Standards (Jest + React Testing Library)

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { PhotoCard } from './photo-card';

describe('PhotoCard', () => {
  it('should display photo title', () => {
    const photo = { id: '1', title: 'Sunset', url: '/img/sunset.jpg' };
    render(<PhotoCard photo={photo} />);

    expect(screen.getByAltText('Sunset')).toBeInTheDocument();
  });

  it('should call onLike when like button clicked', () => {
    const onLike = jest.fn();
    const photo = { id: '1', title: 'Sunset', url: '/img/sunset.jpg' };
    render(<PhotoCard photo={photo} onLike={onLike} />);

    fireEvent.click(screen.getByRole('button', { name: /like/i }));

    expect(onLike).toHaveBeenCalledWith('1');
  });
});
```

### Test Coverage

- Minimum: **70% statement coverage**
- Run: `npx nx test kameravue-fe`
- Test files: `*.test.ts` / `*.test.tsx` co-located with source

---

## Security Practices

- No hardcoded secrets or API keys
- Validate all user input before processing
- Sanitize data before rendering (Next.js does this automatically for JSX)
- Use `next/headers` for secure cookie handling

---

## IKP-Labs Project Paths

```text
apps/kameravue-fe/
├── src/
│   ├── app/              — Next.js App Router pages
│   ├── components/       — shared React components
│   ├── hooks/            — custom React hooks
│   ├── lib/              — utilities and helpers
│   ├── services/         — API call functions
│   └── types/            — TypeScript type definitions
└── src/__tests__/        — test files
```

---

## Anti-Patterns to Avoid

- ❌ `useEffect` for data fetching (use Server Components or SWR)
- ❌ Prop drilling >2 levels (use Context or state management)
- ❌ Large components >200 lines (split into smaller components)
- ❌ Direct DOM manipulation (use React state)
- ❌ `any` type (use proper types)
