# How to Upload and Manage Profile Pictures

This guide shows you how to implement profile picture upload functionality in the Registration Form application, including file upload, display, and deletion.

## Prerequisites

- Basic understanding of React and Next.js
- Understanding of JWT authentication
- Familiarity with multipart/form-data file uploads
- Spring Boot backend running on port 8081
- Frontend running on port 3000

## Overview

The profile picture feature allows authenticated users to:
- Upload profile pictures (JPEG, PNG, GIF)
- View their current profile picture
- Delete their profile picture
- See default avatar with initials when no picture exists

Files are stored in the `uploads/profiles/` directory and served via `/uploads/**` URL pattern.

## Backend Implementation

### Step 1: Configure File Upload Settings

Add file upload configuration to `application.properties`:

```properties
# File Upload Configuration
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB

# File Storage
file.upload.directory=uploads/profiles/
```

**What this does:**
- Enables multipart file upload
- Sets maximum file size to 5MB
- Configures storage directory path

### Step 2: Create File Storage Service

Create a service to handle file operations:

```java
// backend/src/main/java/com/registrationform/api/service/FileStorageService.java

@Service
public class FileStorageService {

    @Value("${file.upload.directory:uploads/profiles/}")
    private String uploadDirectory;

    public String storeFile(MultipartFile file, Long userId) {
        // Validate file
        if (file.isEmpty()) {
            throw new FileUploadException("File is empty");
        }

        // Generate unique filename
        String filename = "user-" + userId + getFileExtension(file);
        Path filePath = Paths.get(uploadDirectory, filename);

        // Save file
        Files.copy(file.getInputStream(), filePath, REPLACE_EXISTING);

        return "profiles/" + filename;
    }

    public void deleteFile(String filePath) {
        Path path = Paths.get("uploads/" + filePath);
        Files.deleteIfExists(path);
    }
}
```

### Step 3: Create Profile Controller

Create REST endpoints for upload and delete:

```java
// backend/src/main/java/com/registrationform/api/controller/ProfileController.java

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/upload-picture")
    public ResponseEntity<ProfilePictureResponse> uploadProfilePicture(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {

        // Get user from JWT token
        User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Delete old picture if exists
        if (user.getProfilePicture() != null) {
            fileStorageService.deleteFile(user.getProfilePicture());
        }

        // Store new file
        String filePath = fileStorageService.storeFile(file, user.getId());

        // Update user entity
        user.setProfilePicture(filePath);
        userRepository.save(user);

        // Return response
        return ResponseEntity.ok(new ProfilePictureResponse(user));
    }

    @DeleteMapping("/delete-picture")
    public ResponseEntity<ProfilePictureResponse> deleteProfilePicture(
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Delete file
        if (user.getProfilePicture() != null) {
            fileStorageService.deleteFile(user.getProfilePicture());
            user.setProfilePicture(null);
            userRepository.save(user);
        }

        return ResponseEntity.ok(new ProfilePictureResponse(user));
    }
}
```

### Step 4: Configure Static Resource Handler

Enable serving uploaded files via HTTP:

```java
// backend/src/main/java/com/registrationform/api/config/WebConfig.java

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/")
                .setCachePeriod(3600); // 1 hour cache
    }
}
```

**What this does:**
- Maps `/uploads/**` URL to `uploads/` directory
- Example: `http://localhost:8081/uploads/profiles/user-83.jpg`
- Enables browser caching for 1 hour

### Step 5: Update Security Configuration

Allow public access to view pictures, protect upload endpoints:

```java
// backend/src/main/java/com/registrationform/api/config/SecurityConfig.java

.authorizeHttpRequests(auth -> auth
    // Public - anyone can view pictures
    .requestMatchers("/uploads/**").permitAll()

    // Protected - must be authenticated to upload/delete
    .requestMatchers("/api/profile/**").authenticated()

    .anyRequest().authenticated()
)
```

## Frontend Implementation

### Step 6: Create Profile Service

Create a service to communicate with the backend API:

```typescript
// frontend/src/services/profileService.ts

export async function uploadProfilePicture(file: File): Promise<ApiResponse<ProfilePictureResponse>> {
  const token = getToken();
  if (!token) {
    return { error: { message: 'Not authenticated' }, status: 401 };
  }

  // Create FormData for multipart upload
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:8081/api/profile/upload-picture', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData,
    credentials: 'include',
  });

  const data = await response.json();
  return { data, status: response.status };
}

export async function deleteProfilePicture(): Promise<ApiResponse<ProfilePictureResponse>> {
  const token = getToken();

  const response = await fetch('http://localhost:8081/api/profile/delete-picture', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const data = await response.json();
  return { data, status: response.status };
}

export function validateImageFile(file: File): string | null {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Only JPEG, PNG, and GIF images are allowed';
  }

  if (file.size > MAX_SIZE) {
    return 'File size must be less than 5MB';
  }

  return null;
}
```

**Key Points:**
- Use `FormData` for multipart file upload
- Don't set `Content-Type` header (browser sets it automatically with boundary)
- Include JWT token in `Authorization` header
- Validate file before upload (client-side)

### Step 7: Create Upload Component

Create a React component for uploading pictures:

```typescript
// frontend/src/components/ProfilePictureUpload.tsx

export default function ProfilePictureUpload({ onUploadSuccess, onUploadError }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file
      const error = validateImageFile(file);
      if (error) {
        alert(error);
        return;
      }

      // Set file and create preview
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const response = await uploadProfilePicture(selectedFile);

    if (response.data) {
      onUploadSuccess(response.data);
      setSelectedFile(null);
      setPreviewUrl(null);
    } else {
      onUploadError(response.error.message);
    }

    setIsUploading(false);
  };

  return (
    <div>
      {/* File input */}
      <input
        type="file"
        accept="image/jpeg,image/png,image/gif"
        onChange={handleFileSelect}
      />

      {/* Preview */}
      {previewUrl && <img src={previewUrl} alt="Preview" />}

      {/* Upload button */}
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Upload Picture'}
      </button>
    </div>
  );
}
```

### Step 8: Create Display Component

Create a component to display profile pictures:

```typescript
// frontend/src/components/ProfilePicture.tsx

export default function ProfilePicture({ pictureUrl, userName, showDeleteButton }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Delete profile picture?')) return;

    setIsDeleting(true);
    const response = await deleteProfilePicture();

    if (response.data) {
      onDeleteSuccess(response.data);
    }

    setIsDeleting(false);
  };

  const fullUrl = pictureUrl
    ? `http://localhost:8081/uploads/${pictureUrl}`
    : null;

  return (
    <div>
      {fullUrl ? (
        <img src={fullUrl} alt="Profile" className="rounded-full" />
      ) : (
        <div className="rounded-full bg-blue-500">
          {getUserInitials(userName)}
        </div>
      )}

      {showDeleteButton && pictureUrl && (
        <button onClick={handleDelete} disabled={isDeleting}>
          Delete Picture
        </button>
      )}
    </div>
  );
}
```

### Step 9: Integrate into Home Page

Use both components in your home page:

```typescript
// frontend/src/app/home/page.tsx

export default function HomePage() {
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);

  const handleUploadSuccess = (response: ProfilePictureResponse) => {
    setProfilePictureUrl(response.profilePictureUrl);
  };

  const handleDeleteSuccess = (response: ProfilePictureResponse) => {
    setProfilePictureUrl(null);
  };

  return (
    <div>
      {/* Display current picture */}
      <ProfilePicture
        pictureUrl={profilePictureUrl}
        userName={user.fullName}
        showDeleteButton={true}
        onDeleteSuccess={handleDeleteSuccess}
      />

      {/* Upload new picture */}
      <ProfilePictureUpload
        onUploadSuccess={handleUploadSuccess}
        onUploadError={(error) => alert(error)}
      />
    </div>
  );
}
```

## Testing the Feature

### Test Upload

1. **Login** to the application
2. Navigate to `/home` page
3. Click **"Change Picture"** button
4. Select an image file (JPEG, PNG, or GIF, max 5MB)
5. Preview should appear
6. Click **"Upload Picture"**
7. Wait for success message
8. Picture should display in the profile section

### Test Delete

1. With a profile picture uploaded
2. Click **"Delete Picture"** button
3. Confirm the deletion
4. Picture should be removed
5. Avatar with initials should appear

### Test Validation

1. Try uploading a file larger than 5MB → Should show error
2. Try uploading non-image file (PDF, DOC) → Should show error
3. Try uploading without authentication → Should return 401

## Common Issues and Solutions

### Issue 1: "File is too large"

**Solution:** Check backend `application.properties`:
```properties
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB
```

### Issue 2: "Failed to load image" (404)

**Solution:** Verify:
- WebConfig is properly configured
- `uploads/` directory exists
- File was actually saved to disk
- URL pattern matches: `/uploads/profiles/user-83.jpg`

### Issue 3: "Unauthorized" (401)

**Solution:** Ensure:
- User is logged in
- JWT token exists in localStorage
- Token is included in Authorization header
- Security config allows authenticated access to `/api/profile/**`

### Issue 4: CORS Error

**Solution:** Add CORS configuration in Spring Boot:
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "DELETE")
                .allowCredentials(true);
    }
}
```

## Security Considerations

1. **File Validation:**
   - Validate file type (only images)
   - Validate file size (max 5MB)
   - Check file extension matches content type

2. **Authentication:**
   - Require JWT token for upload/delete
   - Users can only modify their own pictures
   - Public can view pictures (read-only)

3. **File Storage:**
   - Store files outside web root
   - Use unique filenames (user-based)
   - Delete old files when uploading new ones

4. **Access Control:**
   - `/uploads/**` → Public (permitAll)
   - `/api/profile/**` → Authenticated (authenticated())

## File Structure

```
backend/
├── src/main/java/com/registrationform/api/
│   ├── config/
│   │   ├── SecurityConfig.java          (Security rules)
│   │   └── WebConfig.java               (Static resource handler)
│   ├── controller/
│   │   └── ProfileController.java       (Upload/delete endpoints)
│   ├── service/
│   │   └── FileStorageService.java      (File operations)
│   └── dto/
│       └── ProfilePictureResponse.java  (Response DTO)
└── uploads/
    └── profiles/                        (Uploaded files)
        └── user-83.jpg

frontend/
├── src/
│   ├── components/
│   │   ├── ProfilePicture.tsx           (Display component)
│   │   └── ProfilePictureUpload.tsx     (Upload component)
│   ├── services/
│   │   └── profileService.ts            (API calls)
│   └── app/
│       └── home/
│           └── page.tsx                 (Integration)
```

## Summary

You have successfully implemented profile picture upload functionality with:

- ✅ File upload via multipart/form-data
- ✅ File storage in filesystem
- ✅ Static file serving via HTTP
- ✅ Secure upload/delete with JWT authentication
- ✅ Public read access for viewing pictures
- ✅ Client-side validation
- ✅ Preview before upload
- ✅ Default avatar with user initials

The feature is now ready for production use!
