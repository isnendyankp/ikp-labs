# Requirements - Public Gallery

## Functional Requirements

### FR-1: Public Gallery Access
- **FR-1.1**: User non-login dapat mengakses halaman `/gallery`
- **FR-1.2**: Gallery menampilkan foto-foto real dari database
- **FR-1.3**: Gallery mendukung pagination (12 photos per page)
- **FR-1.4**: Gallery responsive untuk mobile dan desktop

### FR-2: Soft Gate Pattern
- **FR-2.1**: Ketika user non-login klik foto untuk detail, redirect ke `/login`
- **FR-2.2**: Login page menerima parameter `returnUrl`
- **FR-2.3**: Setelah login sukses, user diarahkan ke `returnUrl`
- **FR-2.4**: Jika tidak ada `returnUrl`, default redirect ke `/myprofile`

### FR-3: Footer Navigation
- **FR-3.1**: Footer "Gallery" button berfungsi dan navigate ke `/gallery`
- **FR-3.2**: Footer link accessible dari semua halaman

### FR-4: Authenticated User Experience
- **FR-4.1**: User yang sudah login tetap bisa akses gallery seperti biasa
- **FR-4.2**: User yang sudah login bisa klik foto untuk detail tanpa redirect

## Non-Functional Requirements

### NFR-1: Performance
- Gallery load time < 2 seconds
- Image lazy loading implemented

### NFR-2: UX
- Smooth transition antar halaman
- Clear visual indicator untuk login prompt

## Acceptance Criteria

### AC-1: Public Gallery
```
GIVEN user belum login
WHEN user navigate ke /gallery
THEN user bisa melihat foto-foto di gallery
AND pagination berfungsi normal
```

### AC-2: Login Redirect
```
GIVEN user belum login
AND user berada di gallery page
WHEN user klik foto untuk detail
THEN user di-redirect ke /login?returnUrl=/gallery
```

### AC-3: Return After Login
```
GIVEN user di-redirect ke login dengan returnUrl
WHEN user berhasil login
THEN user di-redirect ke returnUrl (gallery)
```

### AC-4: Authenticated User
```
GIVEN user sudah login
WHEN user klik foto di gallery
THEN user bisa melihat detail foto tanpa redirect
```

### AC-5: Footer Link
```
GIVEN user di halaman manapun
WHEN user klik "Gallery" di footer
THEN user navigate ke /gallery
```
