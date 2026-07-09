# Absensi Santri — Ma'had Tahfizh

Aplikasi absensi santri: **database di Google Spreadsheet**, **backend API di Google Apps Script**,
**tampilan (frontend) di-hosting statis di GitHub Pages** dan bisa **di-install seperti aplikasi di HP Android/iOS** (PWA).

```
┌────────────────────┐        fetch (JSON)        ┌───────────────────────┐
│  GitHub Pages       │ ──────────────────────────▶│  Google Apps Script   │
│  (index.html, dll)  │◀────────────────────────── │  (Code.gs) → Sheets   │
└────────────────────┘                             └───────────────────────┘
   di-install di HP
   sebagai PWA
```

---

## Bagian 1 — Setup Backend (Google Apps Script)

1. Buka **Google Sheets** baru → **Extensions > Apps Script**.
2. Hapus isi `Code.gs` default, tempel isi file **`Code.gs`** yang ada di project ini.
3. Kembali ke Spreadsheet, **reload** halaman → muncul menu **📋 Absensi Santri**.
4. Klik **⚙️ Setup Awal (Buat Sheet & Data)** — ini membuat semua sheet (Kelas, Santri,
   Ustadz, Kegiatan, Jadwal, Absensi, Users) beserta jadwal KBM & akun login default.
5. Edit nama santri asli di sheet **Santri** (defaultnya masih placeholder).
6. **Deploy > New deployment**:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Klik **Deploy**, izinkan akses yang diminta.
7. Salin **URL Web app** yang muncul (diakhiri `/exec`). Atau, kapan pun butuh URL-nya lagi,
   buka menu **📋 Absensi Santri > 🌐 Tampilkan URL API**.

Login default (bisa diganti di sheet `Users`):
| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `admin123` |
| Ustadz Ibrohim | `ibrohim` | `ibrohim123` |
| Ustadz Husain | `husain` | `husain123` |
| Ustadz Ahsani | `ahsani` | `ahsani123` |

> Setiap kali kode `Code.gs` di-update, ulangi: timpa isi file → jalankan **Setup Awal** lagi
> (aman, tidak menghapus data, hanya menambah kolom/sheet baru yang belum ada) →
> **Deploy > Manage deployments > Edit ✏️ > Version: New > Deploy**.

---

## Bagian 2 — Setup Frontend (GitHub Pages)

### 2.1 Isi `config.js`

Buka file **`config.js`**, ganti baris ini dengan URL dari Bagian 1 langkah 7:

```js
const API_URL = 'https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXXXXXXX/exec';
```

### 2.2 Upload ke GitHub

1. Buat repository baru di GitHub, misal `absensi-santri`.
2. Upload **semua file di project ini** ke repo tersebut (pertahankan struktur folder `icons/`):
   ```
   index.html
   config.js
   manifest.json
   sw.js
   icons/
     favicon.ico
     icon-16.png
     icon-32.png
     icon-152.png
     icon-180.png
     icon-192.png
     icon-512.png
     icon-512-maskable.png
     logo-full.png
   ```
   (File `Code.gs` TIDAK perlu di-upload ke GitHub — itu tetap tinggal di Apps Script.)
3. Buka **Settings > Pages** di repo tersebut.
4. Source: **Deploy from a branch** → Branch: `main` → folder `/ (root)` → **Save**.
5. Tunggu 1–2 menit, GitHub akan memberi URL seperti:
   `https://<username-kamu>.github.io/absensi-santri/`

### 2.3 Buka & Install di HP Android

1. Buka URL GitHub Pages di atas pakai **Chrome** di HP.
2. Login seperti biasa untuk memastikan aplikasi bisa mengambil data dari Spreadsheet.
3. Ketuk menu **⋮ (titik tiga)** di Chrome → **"Install app"** atau **"Add to Home screen"**.
4. Ikon **Ma'had Tahfizh** akan muncul di home screen HP, dan terbuka full-screen
   tanpa address bar seperti aplikasi native.

Karena sekarang di-hosting sendiri di GitHub Pages (bukan lewat domain Google Apps Script),
manifest & service worker bekerja secara stabil/standar — instalasi PWA jauh lebih konsisten
dibanding versi sebelumnya.

---

## Kalau Ada Error "Gagal terhubung ke server"

- Pastikan `API_URL` di `config.js` sudah benar dan diakhiri `/exec`.
- Pastikan Web app di-deploy dengan **Who has access: Anyone**.
- Setelah mengubah `Code.gs`, jangan lupa **Manage deployments > Edit > Version: New > Deploy**
  (kalau tidak, URL lama tetap menjalankan kode lama).
- Coba buka `API_URL` langsung di browser — kalau muncul teks
  `{"status":"ok","message":"Absensi Santri API is running."}` berarti backend sudah aktif.

---

## Struktur & Fitur

Fitur aplikasi (Admin, Ustadz, Wali Santri) sama persis seperti versi sebelumnya:
absensi harian (Hadir/Telat+menit/Izin/Sakit/Alpha), dashboard, laporan & grafik
(pekanan/bulanan/semesteran/tahunan), ranking kedisiplinan, detail riwayat per santri,
cetak PDF, dark/light mode, dan akun wali santri (read-only untuk orang tua).
Semua data tetap tersimpan di Google Spreadsheet yang sama.
