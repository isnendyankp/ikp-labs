# UX Components Documentation

This document describes all the UX improvement components implemented in the frontend application.

## Table of Contents

1. [Toast Notifications](#toast-notifications)
2. [Loading States](#loading-states)
3. [Confirmation Dialogs](#confirmation-dialogs)
4. [Empty States](#empty-states)
5. [Form Validation](#form-validation)
6. [Micro-interactions](#micro-interactions)

---

## Toast Notifications

### Components

- **ToastContainer** (`src/components/ui/ToastContainer.tsx`)
- **Toast** (`src/components/ui/Toast.tsx`)
- **ToastContext** (`src/context/ToastContext.tsx`)
- **useToast Hook** (`src/context/ToastContext.tsx`)

### Features

- Multiple toast types: `success`, `error`, `info`, `warning`
- Auto-dismiss after configurable duration
- Manual dismiss button
- Progress bar showing time remaining
- Stacked toasts (max 5 visible)
- Smooth enter/exit animations
- Keyboard accessible (Esc to dismiss)

### Usage

```tsx
import { useToast } from "@/context/ToastContext";

function MyComponent() {
  const { showSuccess, showError, showInfo, showWarning } = useToast();

  const handleSuccess = () => {
    showSuccess("Operation completed successfully!");
  };

  const handleError = () => {
    showError("Something went wrong. Please try again.");
  };

  return <button onClick={handleSuccess}>Show Success Toast</button>;
}
```

### Props

| Prop     | Type                                          | Default  | Description                 |
| -------- | --------------------------------------------- | -------- | --------------------------- |
| message  | `string`                                      | -        | The message to display      |
| type     | `'success' \| 'error' \| 'info' \| 'warning'` | `'info'` | Toast type                  |
| duration | `number`                                      | `3000`   | Auto-dismiss duration in ms |

### Accessibility

- ARIA live regions for screen readers
- Keyboard navigation support
- Focus management
- Proper color contrast ratios

---

## Loading States

### Components

- **Button** (`src/components/ui/Button.tsx`) - with loading prop
- **GalleryGridSkeleton** (`src/components/skeletons/GalleryGridSkeleton.tsx`)
- **PhotoCardSkeleton** (`src/components/skeletons/PhotoCardSkeleton.tsx`)

### Features

- Skeleton screens for content loading
- Loading spinners for buttons
- Optimistic UI updates
- Smooth transitions

### Usage

```tsx
import { Button } from "@/components/ui/Button";

function SubmitButton({ isLoading, onSubmit }) {
  return (
    <Button loading={isLoading} onClick={onSubmit}>
      {isLoading ? "Submitting..." : "Submit"}
    </Button>
  );
}
```

### Props

#### Button Props

| Prop      | Type                                   | Default     | Description        |
| --------- | -------------------------------------- | ----------- | ------------------ |
| loading   | `boolean`                              | `false`     | Show loading state |
| variant   | `'primary' \| 'secondary' \| 'danger'` | `'primary'` | Button style       |
| size      | `'small' \| 'medium' \| 'large'`       | `'medium'`  | Button size        |
| fullWidth | `boolean`                              | `false`     | Full width button  |

---

## Confirmation Dialogs

### Components

- **ConfirmDialog** (`src/components/ui/ConfirmDialog.tsx`)
- **useConfirmDialog** Hook (`src/hooks/useConfirmDialog.ts`)

### Features

- Modal dialog with overlay
- Customizable title, message, and buttons
- Keyboard accessible (Esc to close)
- Focus trap
- Smooth animations

### Usage

```tsx
import { useConfirmDialog } from "@/hooks/useConfirmDialog";

function DeleteButton({ onDelete }) {
  const { confirm, ConfirmDialogComponent } = useConfirmDialog();

  const handleClick = async () => {
    const result = await confirm({
      title: "Delete Photo",
      message:
        "Are you sure you want to delete this photo? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
    });

    if (result) {
      await onDelete();
    }
  };

  return (
    <>
      <button onClick={handleClick}>Delete</button>
      <ConfirmDialogComponent />
    </>
  );
}
```

### Props

| Prop        | Type                    | Default     | Description         |
| ----------- | ----------------------- | ----------- | ------------------- |
| title       | `string`                | -           | Dialog title        |
| message     | `string`                | -           | Dialog message      |
| confirmText | `string`                | `'Confirm'` | Confirm button text |
| cancelText  | `string`                | `'Cancel'`  | Cancel button text  |
| variant     | `'danger' \| 'primary'` | `'primary'` | Button variant      |

---

## Empty States

### Components

- **EmptyState** (`src/components/ui/EmptyState.tsx`)
- Integrated into **PhotoGrid** (`src/components/gallery/PhotoGrid.tsx`)

### Features

- Customizable icon (emoji or React node)
- Title and description
- Optional call-to-action button
- Centered layout
- Responsive design

### Usage

```tsx
import { EmptyState } from "@/components/ui/EmptyState";

function MyPhotos() {
  const { photos, loading } = usePhotos();

  if (loading) return <Skeleton />;
  if (photos.length === 0) {
    return (
      <EmptyState
        icon="📷"
        title="No photos yet"
        message="Upload your first photo to get started!"
        actionText="Upload Photo"
        onAction={() => router.push("/upload")}
      />
    );
  }

  return <PhotoGrid photos={photos} />;
}
```

### Props

| Prop       | Type                  | Default | Description         |
| ---------- | --------------------- | ------- | ------------------- |
| icon       | `string \| ReactNode` | -       | Icon to display     |
| title      | `string`              | -       | Title text          |
| message    | `string`              | -       | Description message |
| actionText | `string`              | -       | CTA button text     |
| onAction   | `() => void`          | -       | CTA click handler   |

---

## Form Validation

### Components

- **FormField** (`src/components/ui/FormField.tsx`)
- **PasswordStrengthIndicator** (`src/components/PasswordStrengthIndicator.tsx`)
- Integrated into **LoginForm** (`src/components/LoginForm.tsx`)

### Features

- Real-time validation on blur
- Error messages with icons
- Success messages with checkmarks
- Password strength indicator
- Required field indicators
- Clear errors when typing

### Usage

```tsx
import { FormField } from "@/components/ui/FormField";

function MyForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleBlur = () => {
    setTouched(true);
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email");
      setIsValid(false);
    } else {
      setError("");
      setIsValid(true);
    }
  };

  return (
    <FormField
      id="email"
      label="Email"
      error={touched ? error : ""}
      isValid={isValid}
      required
    >
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={handleBlur}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
    </FormField>
  );
}
```

### Props

#### FormField Props

| Prop     | Type        | Default | Description             |
| -------- | ----------- | ------- | ----------------------- |
| label    | `string`    | -       | Field label             |
| error    | `string`    | -       | Error message           |
| isValid  | `boolean`   | `false` | Is field valid          |
| required | `boolean`   | `false` | Show required indicator |
| id       | `string`    | -       | Field ID                |
| children | `ReactNode` | -       | Input element           |

#### PasswordStrengthIndicator Props

| Prop      | Type     | Default | Description            |
| --------- | -------- | ------- | ---------------------- |
| password  | `string` | -       | Password to analyze    |
| className | `string` | `''`    | Additional CSS classes |

---

## Micro-interactions

### Features

- Button hover effects with smooth transitions
- Input focus states
- Photo card hover zoom and shadow
- Like/Favorite button animations
- Toast enter/exit animations
- Dialog fade animations
- Pulse-once animation for feedback

### Animations

#### pulse-once

Subtle scale animation for tap feedback:

```css
@keyframes pulse-once {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.animate-pulse-once {
  animation: pulse-once 0.3s ease-in-out;
}
```

### Usage Examples

#### Button Hover

```tsx
<button className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
  Click Me
</button>
```

#### Photo Card Hover

```tsx
<div className="group hover:shadow-lg transition-shadow duration-200">
  <img className="group-hover:scale-105 transition-transform duration-200" />
</div>
```

#### Focus States

```tsx
<input className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
```

---

## Design Principles

All UX components follow these principles:

1. **Accessibility First**: WCAG 2.1 AA compliant
2. **Progressive Enhancement**: Works without JavaScript
3. **Mobile First**: Responsive design
4. **Performance**: Minimal bundle size
5. **Consistency**: Shared design tokens
6. **User Feedback**: Clear visual feedback for all actions

---

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Future Enhancements

- [ ] Dark mode support
- [ ] Internationalization (i18n)
- [ ] Advanced toast positioning options
- [ ] Virtualized lists for large datasets
- [ ] Gesture-based interactions for mobile
- [ ] Voice commands integration
- [ ] Offline support indicators
