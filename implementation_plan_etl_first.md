# Implementation Plan: Data Engineer Showcase Video (Remotion)

Video ini akan dibuat menggunakan **Remotion**, dibagi menjadi beberapa komponen *scene* agar kode tetap rapi dan mudah di-maintain. Kita akan menggunakan `<Sequence>` untuk menyusun setiap *scene* secara berurutan.

## 1. Spesifikasi Teknis Utama
- **Resolusi:** 1080x1080 (1:1 / Square)
- **FPS:** 30 frame per detik
- **Total Durasi Estiminasi:** 35 Detik (1050 Frame)
- **Styling:** Inline CSS React, SVG Icon, dan font sans-serif (Minimalis).

## 2. Struktur File & Folder
```text
my-video/
 ┣ src/
 ┃ ┣ Root.tsx              (Entry point, mendaftarkan composition)
 ┃ ┣ Showcase.tsx          (Komponen utama penggabung semua scene)
 ┃ ┣ index.css             (Global style, grid background)
 ┃ ┗ scenes/               (Folder khusus untuk tiap adegan)
 ┃   ┣ Scene1_Problem.tsx  (Data berantakan)
 ┃   ┣ Scene2_Solution.tsx (Muncul ETL & Airflow)
 ┃   ┣ Scene3_Workflow.tsx (Animasi Trigger -> Load)
 ┃   ┗ Scene4_Outro.tsx    (Logo & Penutup)
```

## 3. Breakdown Timings & Scene

### 🎬 Scene 1: The Problem (Frame 0 - 210 | Durasi: 7 Detik)
- **Visual:** Teks "Monthly Report" di tengah layar, dikelilingi oleh ikon-ikon data (JSON, Excel, Database) yang bergerak melayang. Tanda tanya berkedip-kedip di atasnya.
- **Konsep Animasi Remotion:**
  - `spring()` untuk memunculkan ikon satu per satu (efek *pop up*).
  - `Math.sin()` dikombinasikan dengan `useCurrentFrame()` untuk membuat ikon melayang (*floating effect*) terus-menerus.
  - `interpolate()` dengan `extrapolate: 'clamp'` untuk opasitas tanda tanya (efek kedip).

### 🎬 Scene 2: The Solution (Frame 210 - 360 | Durasi: 5 Detik)
- **Visual:** Ikon-ikon dari Scene 1 terbang keluar layar (tersapu). Di tengah muncul teks "Solusinya: ETL & Apache Airflow" dengan animasi halus, disertai ikon kincir angin Airflow.
- **Konsep Animasi Remotion:**
  - `spring()` untuk transisi teks membesar dari tengah.
  - `interpolate()` pada frame untuk memutar (rotasi) ikon Airflow secara elegan.

### 🎬 Scene 3: The Workflow (Frame 360 - 810 | Durasi: 15 Detik)
- **Visual:** Pipa/Garis terhubung dari kiri ke kanan.
  1. **Trigger:** Ikon jari menekan tombol.
  2. **Extract:** Data (titik-titik putih) ditarik mengalir melewati garis.
  3. **Transform:** Roda gigi berputar memproses titik-titik tersebut (warna berubah).
  4. **Load:** Titik masuk ke dalam ikon Data Warehouse.
- **Konsep Animasi Remotion:**
  - Menggunakan `<Sequence from={X}>` secara bertingkat (nested sequence) agar animasi berantai (Trigger selesai, lanjut Extract, dst).
  - Animasi SVG `strokeDashoffset` untuk garis pipa yang tergambar perlahan.

### 🎬 Scene 4: Outro (Frame 810 - 1050 | Durasi: 8 Detik)
- **Visual:** Latar belakang transisi warna (dari gelap ke warna favorit). Menampilkan SVG logo pribadi.
- **Konsep Animasi Remotion:**
  - `interpolateColors()` untuk efek perubahan warna latar belakang.
  - `spring()` lambat (high damping) untuk memunculkan logo.

## 4. Langkah Eksekusi (Roadmap Kita)
1. **[Tahap 1]** Setup struktur file, bikin file `Showcase.tsx` dan layout Scene 1.
2. **[Tahap 2]** Mengimplementasikan `<Sequence>` di `Showcase.tsx`.
3. **[Tahap 3]** Menyempurnakan pergerakan melayang dan efek kedip di Scene 1.
4. **[Tahap 4]** Melanjutkan ke Scene 2, 3, dan 4 secara bertahap.
5. **[Tahap 5]** Integrasi warna khusus dan Logo SVG.
