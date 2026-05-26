# Skill: Frontend UI Development

**Category**: Software Engineering
**Purpose**: React + Tailwind 4 UI component standards for IKP-Labs
**Used By**: swe-ui-maker, swe-ui-checker, swe-ui-fixer

---

## Component Structure

### Standard Component Pattern

```tsx
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
          'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
        },
        {
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4 text-base': size === 'md',
          'h-12 px-6 text-lg': size === 'lg',
        },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="mr-2 animate-spin">⟳</span>}
      {children}
    </button>
  );
}
```

---

## Tailwind 4 Standards

### Do ✅

- Use semantic color names from design tokens
- Use `focus-visible:` (not `focus:`) for keyboard nav
- Use `disabled:` variants for disabled states
- Mobile-first: base styles for mobile, `md:` / `lg:` for larger
- Minimum touch target: `min-h-[44px]` for interactive elements
- Use `cn()` utility for conditional class merging

### Don't ❌

- No hardcoded hex colors in `className` — use Tailwind tokens
- No `!important` overrides
- No inline `style` for things Tailwind can handle
- No `transition-all` (too broad) — be specific: `transition-colors`
- No `focus:` without `focus-visible:` modifier

---

## Accessibility Requirements

Every interactive component must have:

```tsx
// Buttons — descriptive label
<button aria-label="Like photo">❤</button>

// Images — meaningful alt text
<img src={photo.url} alt={photo.title} />

// Form inputs — associated label
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// Loading states
<div aria-live="polite" aria-busy={loading}>
  {loading ? 'Loading...' : content}
</div>

// Error states
<input aria-invalid={!!error} aria-describedby="email-error" />
<span id="email-error" role="alert">{error}</span>
```

---

## State Management

### Loading States

```tsx
function PhotoGallery({ albumId }: { albumId: string }) {
  const { photos, loading, error } = useGallery(albumId);

  if (loading) return <GallerySkeleton />;
  if (error) return <ErrorMessage message={error} />;
  if (!photos.length) return <EmptyState message="No photos yet" />;

  return <PhotoGrid photos={photos} />;
}
```

### Error States

Always provide meaningful error messages and recovery actions:

```tsx
function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-md bg-red-50 p-4">
      <p className="text-red-800">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-2 text-red-600 underline">
          Try again
        </button>
      )}
    </div>
  );
}
```

---

## Form Patterns

```tsx
import { useState } from 'react';

function PhotoUploadForm({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Photo Title</label>
        <input
          id="title"
          name="title"
          required
          aria-invalid={!!error}
        />
      </div>
      {error && <p role="alert" className="text-red-600">{error}</p>}
      <Button type="submit" loading={submitting}>Upload</Button>
    </form>
  );
}
```

---

## Testing UI Components

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

describe('Button', () => {
  it('renders with correct label', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click</Button>);

    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## IKP-Labs Component Locations

```text
apps/kameravue-fe/src/
├── components/
│   ├── ui/           — reusable base components (Button, Input, Modal)
│   ├── gallery/      — gallery-specific components
│   ├── photo/        — photo-specific components
│   └── layout/       — layout components (Header, Sidebar)
└── app/              — Next.js pages (use components from above)
```

---

## Checklist for New Components

- [ ] TypeScript props interface defined
- [ ] `className` prop forwarded with `cn()`
- [ ] `focus-visible:` for keyboard navigation
- [ ] `disabled:` variant handled
- [ ] Loading and error states handled
- [ ] ARIA labels on interactive elements
- [ ] Alt text on images
- [ ] Mobile-first responsive
- [ ] Unit tests written
