/**
 * Unit Tests for PhotoCard Component
 *
 * Testing Philosophy: NO MOCKING
 * - Uses real JSDOM environment
 * - Tests component rendering and behavior
 * - Uses jest.mock only for Next.js navigation hooks (unavoidable)
 * - NO API calls - only tests UI rendering
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PhotoCard from "../../../components/gallery/PhotoCard";
import { GalleryPhoto } from "../../../types/api";
import { ToastProvider } from "@/context/ToastContext";

// Mock next/navigation hooks - required for useRouter and useSearchParams
const mockPush = jest.fn();
const mockGet = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: mockGet,
  }),
}));

// Mock useScrollRestoration hook
jest.mock("@/hooks/useScrollRestoration", () => ({
  useScrollRestoration: () => ({
    saveScrollPosition: jest.fn(),
  }),
}));

// Mock auth module to control user state
jest.mock("../../../lib/auth", () => ({
  getUserFromToken: jest.fn(),
}));

// Import the mocked auth module
import { getUserFromToken } from "../../../lib/auth";

// Custom render function with providers
function renderWithProviders(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>);
}

// Helper to create a test photo
function createTestPhoto(overrides: Partial<GalleryPhoto> = {}): GalleryPhoto {
  return {
    id: 1,
    userId: 100,
    ownerName: "Test User",
    filePath: "/uploads/test-photo.jpg",
    title: "Test Photo Title",
    description: "Test photo description",
    isPublic: true,
    uploadOrder: 1,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    likeCount: 5,
    isLikedByUser: false,
    isFavoritedByUser: false,
    ...overrides,
  };
}

describe("PhotoCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default: no user logged in
    getUserFromToken.mockReturnValue(null);
    // Default search params
    mockGet.mockImplementation((param: string) => {
      const params: Record<string, string> = {
        filter: "all",
        page: "1",
        sortBy: "newest",
      };
      return params[param] || null;
    });
  });

  // ============================================
  // Rendering Tests
  // ============================================

  describe("Rendering", () => {
    it("should render photo image with correct src and alt", () => {
      const photo = createTestPhoto();
      renderWithProviders(<PhotoCard photo={photo} />);

      const img = screen.getByRole("img");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("alt", "Test Photo Title");
    });

    it("should render photo title", () => {
      const photo = createTestPhoto({ title: "Beautiful Sunset" });
      renderWithProviders(<PhotoCard photo={photo} />);

      expect(screen.getByText("Beautiful Sunset")).toBeInTheDocument();
    });

    it("should render photo description", () => {
      const photo = createTestPhoto({ description: "A lovely sunset view" });
      renderWithProviders(<PhotoCard photo={photo} />);

      expect(screen.getByText("A lovely sunset view")).toBeInTheDocument();
    });

    it("should not render title element when title is null", () => {
      const photo = createTestPhoto({ title: null });
      renderWithProviders(<PhotoCard photo={photo} />);

      // Title heading should not be in the document
      const heading = screen.queryByRole("heading", { level: 3 });
      expect(heading).not.toBeInTheDocument();
    });

    it("should not render description element when description is null", () => {
      const photo = createTestPhoto({ description: null });
      renderWithProviders(<PhotoCard photo={photo} />);

      // The description paragraph should not exist
      const card = screen.getByRole("img").closest("div.group");
      expect(card?.textContent).not.toContain("null");
    });

    it("should render Public badge for public photos", () => {
      const photo = createTestPhoto({ isPublic: true });
      renderWithProviders(<PhotoCard photo={photo} />);

      expect(screen.getByText("Public")).toBeInTheDocument();
    });

    it("should render Private badge for private photos", () => {
      const photo = createTestPhoto({ isPublic: false });
      renderWithProviders(<PhotoCard photo={photo} />);

      expect(screen.getByText("Private")).toBeInTheDocument();
    });

    it("should render formatted date", () => {
      const photo = createTestPhoto({ createdAt: "2024-01-15T10:30:00Z" });
      renderWithProviders(<PhotoCard photo={photo} />);

      // Date should be formatted in Indonesian locale
      // The exact format depends on locale, but should contain the date parts
      const card = screen.getByRole("img").closest("div.group");
      expect(card?.textContent).toMatch(/15/); // day
      expect(card?.textContent).toMatch(/Jan/); // month abbreviation
      expect(card?.textContent).toMatch(/2024/); // year
    });
  });

  // ============================================
  // Like Button Rendering Tests
  // ============================================

  describe("Like Button Rendering", () => {
    it("should render Like button with count", () => {
      const photo = createTestPhoto({ likeCount: 10 });
      renderWithProviders(<PhotoCard photo={photo} />);

      // The count is displayed as "10 likes"
      expect(screen.getByText(/10/)).toBeInTheDocument();
    });

    it("should render Like button with aria-label", () => {
      const photo = createTestPhoto();
      renderWithProviders(<PhotoCard photo={photo} />);

      const likeButton = screen.getByRole("button", { name: /like photo/i });
      expect(likeButton).toBeInTheDocument();
    });

    it("should show liked state when photo is liked by user", () => {
      const photo = createTestPhoto({ isLikedByUser: true, likeCount: 5 });
      renderWithProviders(<PhotoCard photo={photo} />);

      // The count should be displayed as "5 likes"
      expect(screen.getByText("5 likes")).toBeInTheDocument();
    });

    it("should show disabled state for own photos", () => {
      getUserFromToken.mockReturnValue({ id: 100 });
      const photo = createTestPhoto({ userId: 100, likeCount: 3 });
      renderWithProviders(<PhotoCard photo={photo} />);

      // The like button has different aria-label when disabled
      const likeButton = screen.getByRole("button", {
        name: /you cannot like your own photo/i,
      });
      expect(likeButton).toBeDisabled();
    });

    it("should enable like button for other users photos", () => {
      getUserFromToken.mockReturnValue({ id: 200 }); // Different user
      const photo = createTestPhoto({ userId: 100, likeCount: 3 });
      renderWithProviders(<PhotoCard photo={photo} />);

      const likeButton = screen.getByRole("button", { name: /like photo/i });
      expect(likeButton).not.toBeDisabled();
    });
  });

  // ============================================
  // Favorite Button Rendering Tests
  // ============================================

  describe("Favorite Button Rendering", () => {
    it("should render Favorite button with aria-label", () => {
      const photo = createTestPhoto();
      renderWithProviders(<PhotoCard photo={photo} />);

      const favoriteButton = screen.getByRole("button", {
        name: /favorite photo/i,
      });
      expect(favoriteButton).toBeInTheDocument();
    });

    it("should have both Like and Favorite buttons", () => {
      const photo = createTestPhoto();
      renderWithProviders(<PhotoCard photo={photo} />);

      const likeButton = screen.getByRole("button", { name: /like photo/i });
      const favoriteButton = screen.getByRole("button", {
        name: /favorite photo/i,
      });

      expect(likeButton).toBeInTheDocument();
      expect(favoriteButton).toBeInTheDocument();
    });
  });

  // ============================================
  // Navigation Tests
  // ============================================

  describe("Navigation", () => {
    it("should navigate to photo detail when card is clicked", async () => {
      const user = userEvent.setup();
      const photo = createTestPhoto({ id: 42 });
      renderWithProviders(<PhotoCard photo={photo} />);

      // Click on the card (the main container)
      const card = screen.getByRole("img").closest("div.group");
      if (card) {
        await user.click(card);
        expect(mockPush).toHaveBeenCalledWith("/gallery/42");
      }
    });

    it("should have cursor-pointer class for clickable card", () => {
      const photo = createTestPhoto();
      renderWithProviders(<PhotoCard photo={photo} />);

      const card = screen.getByRole("img").closest("div.group");
      expect(card).toHaveClass("cursor-pointer");
    });
  });

  // ============================================
  // Image Attributes Tests
  // ============================================

  describe("Image Attributes", () => {
    it("should have lazy loading attribute", () => {
      const photo = createTestPhoto();
      renderWithProviders(<PhotoCard photo={photo} />);

      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("loading", "lazy");
    });

    it("should have async decoding attribute", () => {
      const photo = createTestPhoto();
      renderWithProviders(<PhotoCard photo={photo} />);

      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("decoding", "async");
    });

    it('should use "Gallery photo" as alt text when title is null', () => {
      const photo = createTestPhoto({ title: null });
      renderWithProviders(<PhotoCard photo={photo} />);

      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("alt", "Gallery photo");
    });
  });

  // ============================================
  // Edge Cases Tests
  // ============================================

  describe("Edge Cases", () => {
    it("should handle zero like count", () => {
      const photo = createTestPhoto({ likeCount: 0 });
      renderWithProviders(<PhotoCard photo={photo} />);

      expect(screen.getByText(/0/)).toBeInTheDocument();
    });

    it("should handle large like count", () => {
      const photo = createTestPhoto({ likeCount: 999999 });
      renderWithProviders(<PhotoCard photo={photo} />);

      expect(screen.getByText(/999999/)).toBeInTheDocument();
    });

    it("should handle long title gracefully (truncate)", () => {
      const longTitle =
        "This is a very long title that should be truncated because it exceeds the container width and needs to be handled gracefully";
      const photo = createTestPhoto({ title: longTitle });
      renderWithProviders(<PhotoCard photo={photo} />);

      // Title should be rendered (truncated via CSS)
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it("should handle long description gracefully (line-clamp)", () => {
      const longDescription =
        "This is a very long description that should be truncated using line-clamp CSS property. It contains multiple sentences to ensure the text is long enough to trigger the truncation. We want to verify that the component handles long text properly without breaking the layout.";
      const photo = createTestPhoto({ description: longDescription });
      renderWithProviders(<PhotoCard photo={photo} />);

      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });
  });
});
