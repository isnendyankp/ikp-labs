/**
 * Unit Tests for PhotoUploadForm Component
 *
 * Testing Philosophy: NO MOCKING
 * - Uses real JSDOM environment
 * - Tests component rendering and behavior
 * - Uses jest.mock only for Next.js navigation hooks (unavoidable)
 * - NO API calls - only tests UI rendering
 */

import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PhotoUploadForm from "../../../components/gallery/PhotoUploadForm";
import { ToastProvider } from "@/context/ToastContext";

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Custom render function with providers
function renderWithProviders(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>);
}

// Helper to create a valid image file
function createImageFile(
  name = "test.jpg",
  type = "image/jpeg",
  size = 1024 * 100, // 100KB
): File {
  const file = new File([""], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
}

// Helper to create an invalid file
function createInvalidFile(name = "test.txt", type = "text/plain"): File {
  return new File(["test content"], name, { type });
}

describe("PhotoUploadForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================
  // Rendering Tests
  // ============================================

  describe("Rendering", () => {
    it("should render the upload form", () => {
      renderWithProviders(<PhotoUploadForm />);

      expect(screen.getByText("Photo *")).toBeInTheDocument();
    });

    it("should render drag & drop zone with instructions", () => {
      renderWithProviders(<PhotoUploadForm />);

      expect(
        screen.getByText(/click to select or drag & drop/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/JPG, PNG, GIF, WebP up to 5MB/i),
      ).toBeInTheDocument();
    });

    it("should render title input", () => {
      renderWithProviders(<PhotoUploadForm />);

      expect(screen.getByText(/title \(optional\)/i)).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/enter photo title/i),
      ).toBeInTheDocument();
    });

    it("should render description textarea", () => {
      renderWithProviders(<PhotoUploadForm />);

      expect(screen.getByText(/description \(optional\)/i)).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/enter photo description/i),
      ).toBeInTheDocument();
    });

    it("should render public checkbox", () => {
      renderWithProviders(<PhotoUploadForm />);

      expect(
        screen.getByLabelText(/make this photo public/i),
      ).toBeInTheDocument();
    });

    it("should render action buttons", () => {
      renderWithProviders(<PhotoUploadForm />);

      expect(
        screen.getByRole("button", { name: /upload photo/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /clear/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /cancel/i }),
      ).toBeInTheDocument();
    });

    it("should have submit button disabled initially", () => {
      renderWithProviders(<PhotoUploadForm />);

      const uploadButton = screen.getByRole("button", {
        name: /upload photo/i,
      });
      expect(uploadButton).toBeDisabled();
    });
  });

  // ============================================
  // Title Input Tests
  // ============================================

  describe("Title Input", () => {
    it("should update title value when user types", async () => {
      const user = userEvent.setup();
      renderWithProviders(<PhotoUploadForm />);

      const titleInput = screen.getByPlaceholderText(/enter photo title/i);
      await user.type(titleInput, "My Photo Title");

      expect(titleInput).toHaveValue("My Photo Title");
    });

    it("should show character count", async () => {
      const user = userEvent.setup();
      renderWithProviders(<PhotoUploadForm />);

      const titleInput = screen.getByPlaceholderText(/enter photo title/i);
      await user.type(titleInput, "Test");

      expect(screen.getByText(/4\/100 characters/i)).toBeInTheDocument();
    });

    it("should respect maxLength attribute", () => {
      renderWithProviders(<PhotoUploadForm />);

      const titleInput = screen.getByPlaceholderText(/enter photo title/i);
      expect(titleInput).toHaveAttribute("maxLength", "100");
    });
  });

  // ============================================
  // Description Input Tests
  // ============================================

  describe("Description Input", () => {
    it("should update description value when user types", async () => {
      const user = userEvent.setup();
      renderWithProviders(<PhotoUploadForm />);

      const descInput = screen.getByPlaceholderText(/enter photo description/i);
      await user.type(descInput, "A beautiful sunset");

      expect(descInput).toHaveValue("A beautiful sunset");
    });

    it("should show character count", async () => {
      const user = userEvent.setup();
      renderWithProviders(<PhotoUploadForm />);

      const descInput = screen.getByPlaceholderText(/enter photo description/i);
      await user.type(descInput, "Test description");

      expect(screen.getByText(/16\/500 characters/i)).toBeInTheDocument();
    });

    it("should respect maxLength attribute", () => {
      renderWithProviders(<PhotoUploadForm />);

      const descInput = screen.getByPlaceholderText(/enter photo description/i);
      expect(descInput).toHaveAttribute("maxLength", "500");
    });
  });

  // ============================================
  // Privacy Toggle Tests
  // ============================================

  describe("Privacy Toggle", () => {
    it("should be unchecked by default", () => {
      renderWithProviders(<PhotoUploadForm />);

      const checkbox = screen.getByLabelText(/make this photo public/i);
      expect(checkbox).not.toBeChecked();
    });

    it("should toggle when clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(<PhotoUploadForm />);

      const checkbox = screen.getByLabelText(/make this photo public/i);
      await user.click(checkbox);

      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
  });

  // ============================================
  // File Validation Tests
  // ============================================

  describe("File Validation", () => {
    it("should show error for invalid file type", async () => {
      renderWithProviders(<PhotoUploadForm />);

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const invalidFile = createInvalidFile();

      fireEvent.change(fileInput, { target: { files: [invalidFile] } });

      expect(screen.getByText(/only image files/i)).toBeInTheDocument();
    });

    it("should show error for file size exceeding limit", async () => {
      renderWithProviders(<PhotoUploadForm />);

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const largeFile = createImageFile(
        "large.jpg",
        "image/jpeg",
        6 * 1024 * 1024,
      ); // 6MB

      fireEvent.change(fileInput, { target: { files: [largeFile] } });

      expect(
        screen.getByText(/file size must be less than 5mb/i),
      ).toBeInTheDocument();
    });

    it("should accept valid image file types", async () => {
      renderWithProviders(<PhotoUploadForm />);

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const validFile = createImageFile("test.jpg", "image/jpeg");

      fireEvent.change(fileInput, { target: { files: [validFile] } });

      // Should show selected file name, not error
      expect(screen.getByText(/selected: test.jpg/i)).toBeInTheDocument();
    });

    it("should accept PNG files", async () => {
      renderWithProviders(<PhotoUploadForm />);

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const pngFile = createImageFile("test.png", "image/png");

      fireEvent.change(fileInput, { target: { files: [pngFile] } });

      expect(screen.getByText(/selected: test.png/i)).toBeInTheDocument();
    });

    it("should accept GIF files", async () => {
      renderWithProviders(<PhotoUploadForm />);

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const gifFile = createImageFile("test.gif", "image/gif");

      fireEvent.change(fileInput, { target: { files: [gifFile] } });

      expect(screen.getByText(/selected: test.gif/i)).toBeInTheDocument();
    });

    it("should accept WebP files", async () => {
      renderWithProviders(<PhotoUploadForm />);

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const webpFile = createImageFile("test.webp", "image/webp");

      fireEvent.change(fileInput, { target: { files: [webpFile] } });

      expect(screen.getByText(/selected: test.webp/i)).toBeInTheDocument();
    });
  });

  // ============================================
  // Clear Button Tests
  // ============================================

  describe("Clear Button", () => {
    it("should clear form when clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(<PhotoUploadForm />);

      // Fill in some data
      const titleInput = screen.getByPlaceholderText(/enter photo title/i);
      await user.type(titleInput, "Test Title");

      const descInput = screen.getByPlaceholderText(/enter photo description/i);
      await user.type(descInput, "Test Description");

      const checkbox = screen.getByLabelText(/make this photo public/i);
      await user.click(checkbox);

      // Clear the form
      const clearButton = screen.getByRole("button", { name: /clear/i });
      await user.click(clearButton);

      // Verify form is cleared
      expect(titleInput).toHaveValue("");
      expect(descInput).toHaveValue("");
      expect(checkbox).not.toBeChecked();
    });

    it("should clear selected file", async () => {
      renderWithProviders(<PhotoUploadForm />);

      // Select a file
      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const validFile = createImageFile();
      fireEvent.change(fileInput, { target: { files: [validFile] } });

      expect(screen.getByText(/selected: test.jpg/i)).toBeInTheDocument();

      // Clear the form
      const clearButton = screen.getByRole("button", { name: /clear/i });
      fireEvent.click(clearButton);

      // File should be cleared
      expect(screen.queryByText(/selected: test.jpg/i)).not.toBeInTheDocument();
    });
  });

  // ============================================
  // Cancel Button Tests
  // ============================================

  describe("Cancel Button", () => {
    it("should navigate to gallery when clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(<PhotoUploadForm />);

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockPush).toHaveBeenCalledWith("/gallery");
    });
  });

  // ============================================
  // Submit Button State Tests
  // ============================================

  describe("Submit Button State", () => {
    it("should be disabled when no file is selected", () => {
      renderWithProviders(<PhotoUploadForm />);

      const uploadButton = screen.getByRole("button", {
        name: /upload photo/i,
      });
      expect(uploadButton).toBeDisabled();
    });

    it("should be enabled when valid file is selected", async () => {
      renderWithProviders(<PhotoUploadForm />);

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const validFile = createImageFile();
      fireEvent.change(fileInput, { target: { files: [validFile] } });

      const uploadButton = screen.getByRole("button", {
        name: /upload photo/i,
      });
      expect(uploadButton).not.toBeDisabled();
    });
  });

  // ============================================
  // Error Display Tests
  // ============================================

  describe("Error Display", () => {
    it("should display error message when validation fails", async () => {
      renderWithProviders(<PhotoUploadForm />);

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const invalidFile = createInvalidFile();

      fireEvent.change(fileInput, { target: { files: [invalidFile] } });

      const errorDiv = screen.getByText(/only image files/i).closest("div");
      expect(errorDiv).toHaveClass("bg-red-50");
    });

    it("should clear error when valid file is selected", async () => {
      renderWithProviders(<PhotoUploadForm />);

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;

      // First select invalid file
      const invalidFile = createInvalidFile();
      fireEvent.change(fileInput, { target: { files: [invalidFile] } });
      expect(screen.getByText(/only image files/i)).toBeInTheDocument();

      // Then select valid file
      const validFile = createImageFile();
      fireEvent.change(fileInput, { target: { files: [validFile] } });
      expect(screen.queryByText(/only image files/i)).not.toBeInTheDocument();
    });
  });

  // ============================================
  // Image Preview Tests
  // ============================================

  describe("Image Preview", () => {
    it("should show file info when valid image is selected", async () => {
      renderWithProviders(<PhotoUploadForm />);

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const validFile = createImageFile();
      fireEvent.change(fileInput, { target: { files: [validFile] } });

      // File info should be shown (this is synchronous)
      expect(screen.getByText(/selected: test.jpg/i)).toBeInTheDocument();
    });

    it("should show file name and size when file is selected", async () => {
      renderWithProviders(<PhotoUploadForm />);

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const validFile = createImageFile(
        "my-photo.jpg",
        "image/jpeg",
        2048 * 100,
      ); // 200KB
      fireEvent.change(fileInput, { target: { files: [validFile] } });

      expect(screen.getByText(/selected: my-photo.jpg/i)).toBeInTheDocument();
      expect(screen.getByText(/200.00 kb/i)).toBeInTheDocument();
    });
  });

  // ============================================
  // Drag & Drop Tests
  // ============================================

  describe("Drag & Drop", () => {
    it("should handle drop event", async () => {
      renderWithProviders(<PhotoUploadForm />);

      const dropZone = screen
        .getByText(/click to select or drag & drop/i)
        .closest("div") as HTMLElement;

      const validFile = createImageFile();
      const dropEvent = new Event("drop", { bubbles: true });
      Object.defineProperty(dropEvent, "dataTransfer", {
        value: { files: [validFile] },
      });

      fireEvent(dropZone, dropEvent);

      // File should be selected (showing file name)
      expect(screen.getByText(/selected: test.jpg/i)).toBeInTheDocument();
    });

    it("should handle dragOver event", async () => {
      renderWithProviders(<PhotoUploadForm />);

      const dropZone = screen
        .getByText(/click to select or drag & drop/i)
        .closest("div") as HTMLElement;

      // Should not throw when dragOver is fired
      const dragOverEvent = new Event("dragover", { bubbles: true });
      expect(() => fireEvent(dropZone, dragOverEvent)).not.toThrow();
    });
  });
});
