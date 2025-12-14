# Quick Start: Video Recording & Screenshot Testing

## 🎯 Apa yang Sudah Di-Setup?

### ✅ Video Recording
- Konfigurasi: HD 1280x720
- Mode: `retain-on-failure` (hanya simpan video test yang gagal)
- Lokasi: `test-results/artifacts/`

### ✅ Screenshot Capture
- Mode: `only-on-failure` (screenshot otomatis saat test gagal)
- Tipe: Full-page screenshot
- Lokasi: `test-results/artifacts/screenshots/`

---

## 🚀 Cara Menjalankan Demo Test

### 1. Video Recording Test
Test lengkap: **Register → Login → Upload Profile Photo**

```bash
# Jalankan test dengan video recording
npx playwright test demo-video-recording --project=chromium

# Lihat video di HTML report
npx playwright show-report
```

**Apa yang Akan Direkam:**
- ✅ Proses registrasi dengan upload foto
- ✅ Login dengan kredensial yang baru dibuat
- ✅ Upload foto profile baru setelah login
- ⏱️ Durasi: ~35 detik

### 2. Screenshot Test
Test berbagai cara mengambil screenshot:

```bash
# Jalankan demo screenshot
npx playwright test demo-screenshot-capture --project=chromium

# Lihat screenshot yang dihasilkan
ls test-results/artifacts/screenshots/
```

**Apa yang Akan Di-Screenshot:**
- 📸 Halaman registrasi (kosong, sebagian, lengkap, error)
- 📸 Element spesifik (form, button, error message)
- 📸 Viewport vs full page
- 📸 Before/after comparison
- 📸 Mobile vs desktop view

---

## 📁 Struktur File

```
RegistrationForm/
├── playwright.config.ts          # Konfigurasi video & screenshot
├── test-results/
│   └── artifacts/
│       ├── videos/               # Video recordings (.webm)
│       └── screenshots/          # Screenshot files (.png)
├── tests/e2e/
│   ├── demo-video-recording.spec.ts      # Demo video test
│   └── demo-screenshot-capture.spec.ts   # Demo screenshot test
└── docs/testing/
    ├── video-screenshot-guide.md         # Panduan lengkap
    └── README-VIDEO-SCREENSHOT.md        # File ini
```

---

## 🎬 Video Recording - Quick Guide

### Mode Video

| Mode | Deskripsi | Kapan Digunakan |
|------|-----------|-----------------|
| `'on'` | Selalu rekam | Demo, tutorial, portfolio |
| `'retain-on-failure'` | Hanya simpan yang gagal | Testing, debugging (REKOMENDASI) |
| `'off'` | Tidak rekam | Performance testing |

### Override Video Mode

```typescript
// Paksa rekam video meskipun test berhasil
test.describe('My Demo', {
  use: { video: 'on' }
}, () => {
  test('demo test', async ({ page }) => {
    // Video akan selalu tersimpan
  });
});
```

### Lihat Video

```bash
# Cara 1: Buka HTML report (REKOMENDASI - video embedded!)
npx playwright show-report

# Cara 2: Buka file langsung
open test-results/artifacts/[test-name]/video.webm
```

---

## 📸 Screenshot - Quick Guide

### Cara Mengambil Screenshot

#### 1. Otomatis (Test Gagal)
```typescript
test('my test', async ({ page }) => {
  await page.goto('/registration');

  // Jika assertion ini gagal, screenshot otomatis tersimpan!
  await expect(page).toHaveTitle(/Registration/);
});
```

#### 2. Manual (Kapan Saja)
```typescript
test('my test', async ({ page }) => {
  await page.goto('/registration');

  // Screenshot full page
  await page.screenshot({
    path: 'test-results/artifacts/screenshots/registration.png',
    fullPage: true
  });

  // Screenshot element saja
  await page.locator('form').screenshot({
    path: 'test-results/artifacts/screenshots/form.png'
  });
});
```

### Tipe Screenshot

| Tipe | Kode | Kapan Digunakan |
|------|------|-----------------|
| **Full Page** | `fullPage: true` | Dokumentasi, bug report |
| **Viewport** | `fullPage: false` | Above-the-fold testing |
| **Element** | `element.screenshot()` | Component testing |
| **Custom Area** | `clip: {x, y, w, h}` | Specific region |

---

## 💡 Use Cases - Untuk Apa Ini?

### 1. Testing & Debugging
```bash
# Run test, jika gagal otomatis dapat video + screenshot
npx playwright test --project=chromium

# Review video untuk lihat kenapa gagal
npx playwright show-report
```

### 2. Portfolio & Demo
```bash
# Buat video demo untuk recruiter
npx playwright test demo-video-recording --project=chromium

# Video menunjukkan aplikasi Anda bekerja dengan baik!
# Share: test-results/artifacts/[test]/video.webm
```

### 3. Bug Report
```bash
# Jalankan test yang bug
npx playwright test registration --project=chromium

# Attach video + screenshot ke issue/ticket
# Video = bukti visual untuk developer
```

### 4. Documentation
```bash
# Screenshot berbagai state aplikasi
npx playwright test demo-screenshot-capture --project=chromium

# Gunakan screenshot untuk docs/README
ls test-results/artifacts/screenshots/
```

---

## 📊 Contoh Skenario Real

### Skenario 1: Test Flow Lengkap
**Goal:** Buktikan aplikasi bekerja end-to-end

```bash
# 1. Jalankan test dengan video 'on'
npx playwright test demo-video-recording -g "Happy Path" --project=chromium

# 2. Video menunjukkan:
#    - User registrasi ✓
#    - Login berhasil ✓
#    - Upload foto ✓

# 3. Share video ke recruiter/team
# File: test-results/artifacts/.../video.webm
```

### Skenario 2: Debug Test yang Gagal
**Problem:** Test registrasi gagal, tidak tahu kenapa

```bash
# 1. Jalankan test (retain-on-failure sudah aktif)
npx playwright test registration --project=chromium

# 2. Test gagal → video otomatis tersimpan

# 3. Buka HTML report
npx playwright show-report

# 4. Play video, lihat detik keberapa error terjadi

# 5. Fix bug, run lagi sampai pass
```

### Skenario 3: Visual Regression Testing
**Goal:** Pastikan UI tidak berubah

```bash
# 1. Screenshot versi saat ini
npx playwright test demo-screenshot-capture -g "Before"

# 2. Ubah CSS/code

# 3. Screenshot lagi
npx playwright test demo-screenshot-capture -g "After"

# 4. Compare secara visual
open test-results/artifacts/screenshots/compare-before-*.png
open test-results/artifacts/screenshots/compare-after-*.png
```

---

## 🎓 Tutorial Pemula

### Step 1: Jalankan Demo Video
```bash
cd /Users/isnendyankp/Desktop/Programmer/Belajar/Project/Template/RegistrationForm

# Pastikan server running
# Frontend: http://localhost:3005
# Backend: http://localhost:8081

# Jalankan test video
npx playwright test demo-video-recording --project=chromium
```

**Hasil:**
- ✅ Test selesai
- 📹 Video tersimpan di `test-results/artifacts/`
- 📊 Report di `playwright-report/`

### Step 2: Lihat Hasilnya
```bash
# Buka HTML report
npx playwright show-report

# Klik test name → Lihat video embedded di report!
```

### Step 3: Jalankan Demo Screenshot
```bash
# Run screenshot demo
npx playwright test demo-screenshot-capture --project=chromium

# Lihat hasil screenshot
ls -la test-results/artifacts/screenshots/
```

**Hasil:**
- 📸 Multiple screenshots dengan berbagai teknik
- 🖼️ File PNG di folder screenshots/

### Step 4: Coba Bikin Test Sendiri
Edit file: `tests/e2e/demo-video-recording.spec.ts`

```typescript
test('My Custom Test with Video', async ({ page }) => {
  // Video akan otomatis terekam karena use: { video: 'on' }

  await page.goto('/registration');
  await page.fill('input[name="email"]', 'mytest@example.com');
  await page.fill('input[name="password"]', 'MyPass123!');

  // Screenshot manual
  await page.screenshot({
    path: 'test-results/artifacts/screenshots/my-test.png'
  });

  await page.click('button[type="submit"]');
});
```

Run test Anda:
```bash
npx playwright test demo-video-recording -g "My Custom Test" --project=chromium
```

---

## 🔧 Troubleshooting

### Video Tidak Muncul?

**Cek:**
1. Test berhasil semua? (dengan `retain-on-failure`, video dihapus jika pass)
2. Mode video = `'off'`? (cek `playwright.config.ts`)
3. Browser crash? (cek error log)

**Solusi:**
```typescript
// Force video untuk debugging
test.use({ video: 'on' });
```

### Screenshot Tidak Ada?

**Cek:**
1. Test pass semua? (screenshot hanya saat gagal jika mode = `only-on-failure`)
2. Path folder ada? (buat dulu: `mkdir -p test-results/artifacts/screenshots`)
3. Permission error? (cek write permission)

**Solusi:**
```typescript
// Screenshot manual untuk testing
await page.screenshot({ path: 'debug.png' });
```

### File Terlalu Besar?

**Video besar?**
- Reduce viewport size (config: 1280x720 → 1024x768)
- Shorten test (split jadi beberapa test kecil)
- Use `retain-on-failure` (delete passing videos)

**Screenshot besar?**
```typescript
// Gunakan JPEG + compression
await page.screenshot({
  path: 'screenshot.jpg',
  type: 'jpeg',
  quality: 80, // 0-100
  fullPage: false // viewport only
});
```

---

## 📚 Dokumentasi Lengkap

Untuk panduan lengkap, baca:
- **[Video & Screenshot Guide](./video-screenshot-guide.md)** - Complete documentation
- **[MCP Playwright Setup](../setup/mcp-playwright-setup.md)** - MCP configuration
- **[E2E Testing Guide](./e2e-testing-guide.md)** - General E2E testing

---

## 🎯 Quick Commands Cheat Sheet

```bash
# Video demo test
npx playwright test demo-video-recording --project=chromium

# Screenshot demo test
npx playwright test demo-screenshot-capture --project=chromium

# Run specific test
npx playwright test demo-video-recording -g "Happy Path"

# Open HTML report (with embedded videos!)
npx playwright show-report

# Run in UI mode (interactive)
npx playwright test --ui

# List all screenshots
ls -la test-results/artifacts/screenshots/

# Clean up artifacts
rm -rf test-results/artifacts/*
```

---

## ✅ Setup Checklist

- [x] Playwright config updated
- [x] Video recording configured (HD 1280x720)
- [x] Screenshot capture configured (full-page)
- [x] Artifact directories created
- [x] Demo video test created
- [x] Demo screenshot test created
- [x] Documentation completed
- [x] All changes committed to Git

---

## 🚀 Next Steps

1. **Run the demos** - Lihat hasilnya!
2. **Customize tests** - Sesuaikan dengan kebutuhan Anda
3. **Create portfolio videos** - Rekam demo untuk recruiter
4. **Document bugs** - Screenshot + video untuk bug reports
5. **Share with team** - Tunjukkan test coverage Anda

---

**Happy Testing! 🎉**

Last Updated: 2025-11-06
