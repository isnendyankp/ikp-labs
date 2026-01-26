# Landing Page - Technical Design

**Plan**: Landing Page for Kameravue
**Version**: 1.0
**Last Updated**: January 19, 2026

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Component Design](#component-design)
3. [State Management](#state-management)
4. [Routing Architecture](#routing-architecture)
5. [Styling System](#styling-system)
6. [Testing Strategy](#testing-strategy)

---

## Architecture Overview

### System Architecture

**Current Architecture**:
```
/ (Root Page)
    ↓
    Check Auth via isAuthenticated()
    ↓
    ┌─────────────┬─────────────┐
    │             │             │
    ▼             ▼             ▼
Authenticated → /gallery    Unauthenticated → /login
```

**New Architecture**:
```
/ (Root Page)
    ↓
    Render LandingPage (always)
    ↓
┌──────────────────────────────────────────────┐
│              LandingPage                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Navbar  │  │   Hero   │  │ Features │   │
│  │ (auth-   │  │          │  │          │   │
│  │  aware)  │  │          │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  About   │  │   CTA    │  │  Footer  │   │
│  │          │  │          │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘   │
└──────────────────────────────────────────────┘
    ↓                     ↓
    │                     │
User clicks           User clicks
"Get Started"         "Go to Gallery"
    ↓                     ↓
/login                /gallery
```

### Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.5.0 | React framework with App Router |
| React | 19.1.0 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | v4 | Styling |

---

## Component Design

### Component Hierarchy

```
LandingPage (Main Container)
├── Navbar (Fixed Header)
│   ├── Logo
│   ├── Navigation Links
│   │   ├── Features
│   │   └── About
│   └── Auth Buttons
│       ├── Login
│       └── Get Started
│
├── HeroSection (Full viewport height)
│   ├── Headline (H1)
│   ├── Subheadline (P)
│   ├── CTA Buttons
│   │   ├── Primary: Get Started
│   │   └── Secondary: Learn More
│   ├── Trust Elements
│   └── Hero Visual (Image)
│
├── FeaturesSection
│   ├── Section Header
│   └── Features Grid (3 columns)
│       ├── FeatureCard (Upload & Organize)
│       ├── FeatureCard (Share Beautifully)
│       ├── FeatureCard (Discover Moments)
│       ├── FeatureCard (Privacy Control)
│       ├── FeatureCard (Mobile Friendly)
│       └── FeatureCard (Free Forever)
│
├── AboutSection
│   ├── Section Header
│   ├── Content Grid (2 columns)
│   │   ├── Text Content (Left)
│   │   └── Stats Cards (Right)
│   │       ├── Users Stat
│   │       ├── Photos Stat
│   │       └── Free Stat
│
├── CTASection (Dark background)
│   ├── Headline
│   ├── Subheadline
│   ├── CTA Button
│   └── Trust Elements
│
└── Footer
    ├── Logo
    ├── Link Columns
    │   ├── Product Links
    │   ├── Company Links
    │   └── Legal Links
    └── Copyright
```

---

### 1. LandingPage Component

**File**: `frontend/src/components/landing/LandingPage.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { AboutSection } from './AboutSection';
import { CTASection } from './CTASection';
import { Footer } from './Footer';

export default function LandingPage() {
  const router = useRouter();

  // Scroll to section handler
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Get Started handler
  const handleGetStarted = () => {
    router.push('/login');
  };

  // Learn More handler
  const handleLearnMore = () => {
    scrollToSection('features');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={scrollToSection} />
      <main>
        <HeroSection onGetStarted={handleGetStarted} onLearnMore={handleLearnMore} />
        <div id="features">
          <FeaturesSection features={featuresData} />
        </div>
        <div id="about">
          <AboutSection stats={statsData} />
        </div>
        <CTASection onGetStarted={handleGetStarted} />
      </main>
      <Footer onNavigate={scrollToSection} />
    </div>
  );
}
```

---

### 2. Navbar Component

**File**: `frontend/src/components/landing/Navbar.tsx`

**Props Interface**:
```typescript
interface NavbarProps {
  onNavigate?: (section: string) => void;
}
```

**State Management**:
```typescript
const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const [isScrolled, setIsScrolled] = useState(false);

// Check authentication on mount
useEffect(() => {
  setIsUserAuthenticated(isAuthenticated());
}, []);

// Scroll effect
useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 10);
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

**Conditional Rendering**:
```typescript
{/* Auth Buttons - Desktop */}
{isUserAuthenticated ? (
  <button onClick={handleGallery}>Go to Gallery</button>
) : (
  <>
    <button onClick={handleLogin}>Login</button>
    <button onClick={handleGetStarted}>Get Started</button>
  </>
)}
```

---

### 3. HeroSection Component

**File**: `frontend/src/components/landing/HeroSection.tsx`

**Props Interface**:
```typescript
interface HeroSectionProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
}
```

**Structure**:
```tsx
<section className="min-h-screen flex items-center pt-20 bg-gradient-to-br from-white via-gray-50 to-white">
  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Left: Text Content */}
      <div>
        <h1>Your perfect moments...</h1>
        <p>Share life's beautiful moments...</p>
        <div className="flex gap-4">
          <button onClick={onGetStarted}>Get Started Free</button>
          <button onClick={onLearnMore}>Learn More →</button>
        </div>
        <div className="flex gap-6">
          <span>✓ No credit card required</span>
          <span>✓ Free forever</span>
        </div>
      </div>

      {/* Right: Hero Image */}
      <div>
        <Image
          src="/images/hero-image.jpg"
          alt="Beautiful photography moment"
          width={800}
          height={600}
          priority
        />
      </div>
    </div>
  </div>
</section>
```

---

### 4. FeatureCard Component (Reusable)

**File**: `frontend/src/components/landing/FeatureCard.tsx`

**Props Interface**:
```typescript
interface FeatureCardProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}
```

**Implementation**:
```tsx
<article className="group p-6 bg-white border border-gray-200 rounded-xl hover:scale-105 hover:shadow-xl transition-all duration-300">
  {/* Icon */}
  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-black mb-4 group-hover:bg-black group-hover:text-white transition-colors duration-300">
    <Icon />
  </div>

  {/* Title */}
  <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>

  {/* Description */}
  <p className="text-gray-600 leading-relaxed">{description}</p>
</article>
```

**Hover Effect**:
- Background color transition: gray-100 → black
- Icon color transition: black → white
- Scale: 1 → 1.05
- Shadow: sm → xl

---

### 5. FeaturesSection Component

**File**: `frontend/src/components/landing/FeaturesSection.tsx`

**Props Interface**:
```typescript
interface FeaturesSectionProps {
  features: FeatureCardProps[];
}
```

**Grid Layout**:
```tsx
<section className="py-20 px-4 bg-gray-50">
  <div className="max-w-7xl mx-auto">
    {/* Section Header */}
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Features</h2>
      <p className="text-lg text-gray-600">Everything you need to share beautiful moments</p>
    </div>

    {/* Features Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  </div>
</section>
```

**Responsive Grid**:
- Mobile: `grid-cols-1` (1 column)
- Tablet: `md:grid-cols-2` (2 columns)
- Desktop: `lg:grid-cols-3` (3 columns)

---

### 6. AboutSection Component

**File**: `frontend/src/components/landing/AboutSection.tsx`

**Props Interface**:
```typescript
interface AboutSectionProps {
  stats?: {
    users: string;
    photos: string;
    tagline: string;
  };
}
```

**Structure**:
```tsx
<section className="py-20 px-4 bg-white">
  <div className="max-w-7xl mx-auto">
    {/* Section Header */}
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold">About Us</h2>
      <p className="text-lg text-gray-600">We're on a mission to preserve your memories</p>
    </div>

    {/* Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
      {/* Left: Mission Text */}
      <div className="space-y-6">
        <p>Kameravue was born from a simple belief...</p>
        <p>Our platform makes it easy...</p>
        <p>Join thousands of users...</p>
      </div>

      {/* Right: Stats Cards */}
      <div className="space-y-6">
        <StatCard value={stats.users} label="Active Users" icon={UserGroupIcon} />
        <StatCard value={stats.photos} label="Photos Shared" icon={PhotoIcon} />
        <StatCard value={stats.tagline} label="No hidden fees" icon={HeartIcon} />
      </div>
    </div>
  </div>
</section>
```

---

### 7. CTASection Component

**File**: `frontend/src/components/landing/CTASection.tsx`

**Props Interface**:
```typescript
interface CTASectionProps {
  onGetStarted: () => void;
}
```

**Structure**:
```tsx
<section className="py-20 px-4 bg-gradient-to-r from-gray-900 via-black to-gray-900">
  <div className="max-w-4xl mx-auto text-center">
    {/* Headline */}
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
      Ready to start sharing your moments?
    </h2>

    {/* Subheadline */}
    <p className="text-lg md:text-xl text-gray-300 mt-6 mb-10">
      Join thousands of users capturing life's beauty.
    </p>

    {/* CTA Button */}
    <button
      onClick={onGetStarted}
      className="px-10 py-4 bg-white text-black text-lg font-medium rounded-full hover:bg-gray-100 transition-all"
    >
      Get Started Free →
    </button>

    {/* Trust Elements */}
    <div className="flex justify-center gap-8 mt-8 text-sm text-gray-400">
      <span>✓ No credit card required</span>
      <span>✓ Free forever</span>
    </div>
  </div>
</section>
```

**Dark Gradient Background**:
- From: `from-gray-900`
- Via: `via-black`
- To: `to-gray-900`

---

### 8. Footer Component

**File**: `frontend/src/components/landing/Footer.tsx`

**Props Interface**:
```typescript
interface FooterProps {
  onNavigate?: (path: string) => void;
}
```

**Structure**:
```tsx
<footer className="bg-gray-50 border-t border-gray-200">
  <div className="max-w-7xl mx-auto px-4 py-12">
    {/* Main Footer Content */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {/* Brand Column */}
      <div>
        <h3 className="text-xl font-bold">Kameravue</h3>
        <p className="text-gray-600 text-sm mt-2">Your perfect moments...</p>
      </div>

      {/* Product Column */}
      <div>
        <h4 className="font-semibold mb-4">Product</h4>
        <ul className="space-y-3">
          <li><button onClick={() => onNavigate('features')}>Features</button></li>
          <li><a href="/gallery">Gallery</a></li>
        </ul>
      </div>

      {/* Company Column */}
      <div>
        <h4 className="font-semibold mb-4">Company</h4>
        <ul className="space-y-3">
          <li><button onClick={() => onNavigate('about')}>About Us</button></li>
          <li><a href="mailto:hello@kameravue.com">Contact</a></li>
        </ul>
      </div>

      {/* Legal Column */}
      <div>
        <h4 className="font-semibold mb-4">Legal</h4>
        <ul className="space-y-3">
          <li><a href="/terms">Terms of Service</a></li>
          <li><a href="/privacy">Privacy Policy</a></li>
        </ul>
      </div>
    </div>
  </div>

  {/* Bottom Bar */}
  <div className="border-t border-gray-200 py-6">
    <div className="max-w-7xl mx-auto px-4">
      <p className="text-gray-600 text-sm">
        © {new Date().getFullYear()} Kameravue. All rights reserved.
      </p>
      <p className="text-gray-600 text-sm">
        Made with ❤️ for beautiful moments
      </p>
    </div>
  </div>
</footer>
```

---

## State Management

### Authentication State

**Location**: `Navbar.tsx`

```typescript
const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

// Check auth on mount
useEffect(() => {
  setIsUserAuthenticated(isAuthenticated());
}, []);
```

**Behavior**:
- Check `isAuthenticated()` from `@/lib/auth` on component mount
- Store result in local state
- Used for conditional rendering of auth buttons

---

### Mobile Menu State

**Location**: `Navbar.tsx`

```typescript
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
```

**Behavior**:
- Toggle mobile menu visibility
- Close menu after navigation
- Controlled by hamburger button

---

### Scroll State

**Location**: `Navbar.tsx`

```typescript
const [isScrolled, setIsScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 10);
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

**Behavior**:
- Add shadow/backdrop when scrolled > 10px
- Event listener added on mount
- Cleanup on unmount

---

## Routing Architecture

### Page Routing Changes

**File**: `frontend/src/app/page.tsx`

**Before**:
```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../lib/auth';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/gallery');
    } else {
      router.push('/login');
    }
  }, [router]);

  return <div>Loading...</div>;
}
```

**After**:
```typescript
import LandingPage from '@/components/landing/LandingPage';

export default function RootPage() {
  return <LandingPage />;
}
```

**Benefits**:
- Landing page is always accessible
- Simplified routing logic
- Auth check moved to Navbar component

---

### Navigation Flow

**Unauthenticated User**:
```
/ → Landing Page
    ↓ Click "Get Started" or "Login"
/login → Login Form
    ↓ Successful login
/gallery → Gallery (now accessible via Navbar)
```

**Authenticated User**:
```
/ → Landing Page
    ↓ Click "Go to Gallery" in Navbar
/gallery → Gallery (direct access)
```

---

### Smooth Scroll Navigation

**Implementation**:
```typescript
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
```

**Section IDs**:
- `features` - Features section
- `about` - About section

**Usage**:
- Navbar links scroll to sections
- "Learn More" button scrolls to Features
- Footer links scroll to sections

---

## Styling System

### Color Palette

| Color | Tailwind Class | Usage |
|-------|---------------|-------|
| **Black** | `bg-black`, `text-black` | Primary actions, headings emphasis |
| **Gray 900** | `text-gray-900` | Headings |
| **Gray 600** | `text-gray-600` | Body text |
| **Gray 400** | `text-gray-400` | Subtle text |
| **Gray 100** | `bg-gray-100` | Feature card icon backgrounds |
| **Gray 50** | `bg-gray-50` | Section backgrounds (alternating) |
| **White** | `bg-white`, `text-white` | Card backgrounds, text on dark |

---

### Typography Scale

| Usage | Class | Size |
|-------|-------|------|
| **Hero Headline** | `text-4xl md:text-5xl lg:text-6xl` | 36px / 48px / 60px |
| **Section Headings** | `text-3xl md:text-4xl` | 30px / 36px |
| **Card Titles** | `text-xl font-semibold` | 20px |
| **Body Text** | `text-lg text-gray-600` | 18px |
| **Small Text** | `text-sm` | 14px |

---

### Responsive Breakpoints

| Breakpoint | Width | Prefix |
|------------|-------|--------|
| **Mobile** | < 640px | default |
| **Tablet** | 640px - 1023px | `md:` |
| **Desktop** | ≥ 1024px | `lg:` |

---

### Spacing System

| Element | Padding/Margin |
|---------|---------------|
| **Section Vertical** | `py-20 md:py-24 lg:py-32` |
| **Container Horizontal** | `px-4 sm:px-6 lg:px-8` |
| **Card Internal** | `p-6` |
| **Grid Gap** | `gap-8` |

---

### Border Radius

| Usage | Class | Radius |
|-------|-------|--------|
| **Buttons** | `rounded-lg` | 8px |
| **Feature Cards** | `rounded-xl` | 12px |
| **Hero Image** | `rounded-2xl` | 16px |
| **CTA Button** | `rounded-full` | Fully rounded |

---

### Shadows

| Usage | Class |
|-------|-------|
| **Feature Cards** | `shadow-sm hover:shadow-xl` |
| **Hero Image** | `shadow-2xl` |
| **Navbar (scrolled)** | `shadow-sm` |

---

## Testing Strategy

### Manual Testing Checklist

**Functional Testing**:
- [ ] Visit `/` and see landing page (not redirect)
- [ ] Hero section displays correctly
- [ ] All 6 feature cards render with icons
- [ ] About section with stats displays
- [ ] CTA section has dark background
- [ ] Footer links work
- [ ] "Get Started" buttons navigate to `/login`
- [ ] "Learn More" scrolls to Features section
- [ ] Navbar links scroll to sections
- [ ] Mobile hamburger menu works
- [ ] Authenticated users see "Gallery" button
- [ ] Unauthenticated users see "Login + Get Started"

**Responsive Testing**:
- [ ] Mobile (375px) - stacked layout
- [ ] Tablet (768px) - 2-column features
- [ ] Desktop (1280px+) - full layout

**Cross-Browser Testing**:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

### Visual Testing

**Design Consistency**:
- [ ] Colors match design system
- [ ] Typography scale is consistent
- [ ] Spacing is consistent
- [ ] Hover effects work smoothly
- [ ] Transitions are smooth (no jank)

**Accessibility Testing**:
- [ ] Semantic HTML (`<header>`, `<main>`, `<section>`, `<footer>`)
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA

---

## Performance Considerations

### Image Optimization

**Hero Image**:
```typescript
<Image
  src="/images/hero-image.jpg"
  alt="Beautiful photography moment"
  width={800}
  height={600}
  priority  // LCP image
  className="rounded-2xl shadow-2xl"
/>
```

**Benefits**:
- Next.js Image component optimization
- Automatic responsive sizes
- Lazy loading for below-fold images (if added)
- WebP/AVIF format support

---

### Code Splitting

**Automatic** (Next.js App Router):
- Each section component is automatically code-split
- Navbar and Footer are shared (no duplication)
- Route-based splitting for `/login` and `/gallery`

---

### Font Optimization

**Current Setup**:
- Geist Sans font (already loaded in layout.tsx)
- No additional fonts needed

---

**Technical Design Version**: 1.0
**Last Updated**: January 19, 2026
**Ready for Implementation**: ✅ Yes (Already Implemented)
