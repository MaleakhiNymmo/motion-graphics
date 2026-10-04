# Skrip Video: Apache Airflow & ETL (Motion Graphic Remotion)

> Skrip dan gambaran scene untuk video penjelasan singkat tentang ETL dan Apache Airflow.
> Dibuat untuk dikerjakan di Remotion bersama agent Antigravity. Baca juga `remotion-learning-context.md` untuk konteks user dan aturan kerja agent.
> **Versi 2:** palet warna diganti dengan palet milik user ("Warm Tactile Linen / Paper Theme").

## Spesifikasi teknis

- Resolusi: **1080x1080**, **30 fps**
- Durasi total: **±50 detik (1500 frame)** (ini bisa diganti sih, bisa juga dipadetin jadi cuman 30 detik)
- Bahasa VO: Indonesia santai (campur istilah teknis Inggris)

| Scene | Judul | Detik | Frame |
|---|---|---|---|
| 1 | Masalah | 0-10 | 0-300 |
| 2 | Solusi | 10-18 | 300-540 |
| 3 | Cara kerjanya | 18-40 | 540-1200 |
| 4 | Penutup | 40-50 | 1200-1500 |

## Palet warna (milik user, WAJIB dipakai persis)

Tema "Warm Tactile Linen / Paper": meniru tekstur kertas linen/oatmeal yang hangat, kesan editorial dan organik.

| Token | Hex | Peran |
|---|---|---|
| `canvas` | `#E6E3DC` | Latar utama (krem / warm oatmeal) |
| `surface` | `#F2EEE8` | Permukaan elemen (chip, kartu, pill) |
| `surfaceElevated` | `#E5DFD5` | Lapisan kedua / bagian dalam kartu |
| `ink` | `#1C1C1C` | Teks utama (charcoal, bukan hitam pekat) |
| `inkSecondary` | `#5A5A5E` | Teks sekunder |
| `inkMuted` | `#84848A` | Teks redup |
| `accent` | `#78350F` | Status / aksen (coklat tua / amber) |
| `successOptional` | `#3F6B3A` | **OPSIONAL, nonaktif secara default.** Hijau lumut tua khusus untuk status sukses. Aktifkan hanya kalau user memutuskan setelah melihat hasil render. Kontras ±4,9:1 di atas `canvas`. |

Buat satu file tema, misalnya `src/theme.ts`, dan **semua komponen mengambil warna dari sana** (jangan menulis hex langsung di komponen):

```ts
export const theme = {
  canvas: '#E6E3DC',
  surface: '#F2EEE8',
  surfaceElevated: '#E5DFD5',
  ink: '#1C1C1C',
  inkSecondary: '#5A5A5E',
  inkMuted: '#84848A',
  accent: '#78350F',
  // OPSIONAL: jangan dipakai kecuali user memintanya.
  // successOptional: '#3F6B3A',
} as const;
```

### Catatan penting soal palet ini (hasil pengecekan kontras)

1. **`canvas` dan `surfaceElevated` hampir sama** (rasio kontras ±1,03:1). Kartu yang memakai `surfaceElevated` di atas `canvas` tidak akan terlihat "melayang" hanya dari warna. Solusi: chip dan kartu utama pakai **`surface`** (lebih terang dari canvas, ±1,11:1), lalu **selalu tambahkan bayangan lembut dan border 1px** (`ink` pada opasitas rendah) supaya terpisah dari latar. Pakai `surfaceElevated` hanya untuk lapisan dalam (mis. area teks di dalam chip).
2. **`inkMuted` kontrasnya rendah** (±2,9:1 di atas canvas). Pakai hanya untuk elemen dekoratif: label HUD, timecode, garis bingkai. **Jangan** dipakai untuk teks yang harus terbaca (nama chip, VO caption, angka). Untuk teks sekunder yang harus terbaca pakai `inkSecondary` (±5,4:1).
3. `ink` (±13:1) dan `accent` (±7:1) di atas canvas sudah aman untuk teks. Teks `surface` di atas `accent` juga aman (±7,8:1).
4. Palet hanya punya **satu aksen**. Jadi status (antri / berjalan / sukses / gagal) dibedakan lewat **bentuk, isi, dan ikon**, bukan lewat warna merah/hijau. Lihat aturan status di bawah.
5. Opsional untuk kesan kertas: tambahkan lapisan **grain/noise statis** sangat tipis (opasitas ±3-5%) di atas canvas. Jaga tetap statis (tidak dianimasikan) supaya render tidak berat.

## Gaya visual (berlaku untuk semua scene)

- **Tipografi:** judul campuran sans tebal dan serif miring (contoh: "Report bulanan, *datanya nyebar.*"), label kecil bergaya monospace.
- **Bingkai HUD:** sudut viewfinder dan garis tipis dengan `inkMuted`, label scene di kiri bawah (contoh: "01 · MASALAH"), timecode di pojok.
- **Ikon:** gambar sendiri sebagai SVG sederhana (silinder database, tabel, grafik batang), warna `ink`. Jangan memakai logo merek resmi dan jangan menambah library ikon tanpa bertanya dulu ke user.
- Semua animasi memakai `interpolate()` dan `spring()`, **bukan** CSS animation.

### Aturan status (pengganti warna merah/hijau)

| Status | Tampilan chip/node |
|---|---|
| Antri | Isi `surface`, border `inkMuted` putus-putus, ikon jam kecil |
| Berjalan | Border `accent` 2px yang berdenyut, titik `accent` berkedip |
| Sukses | Isi `ink`, centang warna `surface` |
| Gagal / perlu retry | Isi `accent`, teks `surface`, label "retry 1/3" |
| "Manual…" (Scene 1) | Teks `accent` berkedip, huruf monospace kecil |

**Keputusan user:** bangun dulu dengan **satu aksen**. Jangan memakai `successOptional` kecuali user bilang akan mengaktifkannya. Kalau diaktifkan, hanya ubah status **Sukses**: isi `successOptional` (bukan `ink`), centang `surface`. Status lain tidak berubah, dan jangan menambah warna merah.

### Pemakaian aksen
`accent` adalah satu-satunya warna kuat, jadi pakai hemat: status, stabilo, dan **satu momen dramatis** (flash di Scene 2). Selebihnya biarkan layar didominasi canvas, surface, dan ink supaya nuansa kertasnya terjaga.

## Scene 1: Masalah (0-10 detik)

**Visual:** Latar `canvas`. Judul serif miring (`ink`) muncul dengan mask reveal: "Report bulanan, *datanya nyebar.*" Di bawahnya ada pill timer (isi `ink`, teks `surface`) **"WAKTU NARIK MANUAL 00:00:00"** yang terus berdetak. Empat chip (isi `surface`, bayangan lembut, border tipis) masuk dengan efek spring dan melayang di sekeliling judul. Tiap chip berisi ikon, nama, dan **teks hidup**:

| Chip | Teks yang berjalan | Status |
|---|---|---|
| PostgreSQL | `SELECT * FROM orders` diketik, lalu jadi `12.480 rows` | manual… |
| MongoDB | `db.users.find({})` diketik, lalu `3,2K docs` | manual… |
| Excel / CSV | `laporan_final_v7_REVISI.xlsx` | manual… |
| Google Analytics | `sessions: 48.210` (angka naik cepat) | manual… |

**Animasi:** chip bergetar kecil, teks "manual…" (`accent`) berkedip, angka timer melonjak. Di akhir kata "Capek" di-stabilo memakai `accent` pada opasitas ±25% di belakang teks `ink`, lalu semua chip tersedot ke tengah (transisi ke Scene 2).

**Voice Over:**
> "Report bulanan udah di depan mata. Tapi datanya? Ada di PostgreSQL, di MongoDB, di file Excel, plus Google Analytics. Narik satu-satu, tiap bulan? Capek, kan."

| Waktu | Kejadian visual | Potongan VO |
|---|---|---|
| 0-1,5 dtk | Judul mask reveal, timer mulai berdetak | "Report bulanan udah di depan mata." |
| 1,5-3,5 dtk | Chip PostgreSQL masuk, query diketik | "Tapi datanya? Ada di PostgreSQL," |
| 3,5-6,5 dtk | MongoDB, Excel/CSV, Google Analytics masuk satu per satu, pas dengan kata yang disebut | "di MongoDB, di file Excel, plus Google Analytics." |
| 6,5-9 dtk | Chip bergetar, angka timer melonjak, "manual…" berkedip | "Narik satu-satu, tiap bulan?" |
| 9-10 dtk | "Capek" di-stabilo, chip tersedot ke tengah | "Capek, kan." |

## Scene 2 & 3: Solusi & Cara Kerjanya (10-33 detik)

**Visual (Giant Panning Canvas):** 
Layar menjadi satu kanvas lebar di mana kamera akan bergeser (*panning*) ke kanan secara sinematik mengikuti alur data.
1. **Pembukaan ETL:** Tiga huruf **E T L** muncul dari bawah dengan efek *mask reveal* ala Apple.
2. **E - Extract (Tarik):** Kamera mendekat ke **E**. Huruf memanjang jadi **Extract**. Kotak `RAW_DATA` muncul, disusul ikon sumber data (PostgreSQL, MongoDB, Excel, Analytics) yang *pop-up* berurutan menembakkan garis putus-putus ke arah `RAW_DATA`.
3. **T - Transform (Rapikan):** Kamera bergeser ke **T**. Huruf memanjang jadi **Transform**. Muncul baris-baris data kotor. Satu baris duplikat dihapus, *scanner* menyapu data, lalu baris data berubah menjadi rapi.
4. **L - Load (Simpan):** Kamera bergeser ke **L**. Huruf memanjang jadi **Load**. Baris-baris data bersih tadi berjatuhan masuk ke dalam ikon dokumen Excel raksasa (mewakili laporan akhir).
5. **Airflow Reveal (Orkestrator):** Layar seketika *flash* penuh ke warna aksen coklat (`#78350F`). Kamera sedikit *zoom-out*, memunculkan logo/teks **Apache Airflow**. Tongkat konduktor berayun mengorkestrasi pipeline. (Transisi ke Scene 4).

**Voice Over:**
> *(Kamera di E)* "Di sinilah proses ETL jadi penyelamat! Pertama, Extract: narik semua data mentah secara otomatis dari sumber yang beda-beda tadi."
> 
> *(Kamera di T)* "Kedua, Transform: bersihin data kotor, buang duplikat, dan ngubah struktur datanya biar sesuai sama kebutuhan kegunaannya."
> 
> *(Kamera di L)* "Ketiga, Load: nyimpen semua data yang udah diproses tadi jadi satu report siap pakai."
> 
> *(Flash ke Airflow)* "Dan yang jadi konduktor buat nge-orkestrasi semuanya biar jalan sendiri sesuai jadwal? Apache Airflow. Tiap hari, tiap jam, jalan otomatis."

## Scene 4: Penutup (40-50 detik)

**Visual:** Latar `canvas`. Pill timer dari Scene 1 berhenti di **00:00:00** dengan label "WAKTU NARIK MANUAL", lalu sebuah centang muncul. Judul akhir: "Data rapi, *bisnis happy.*" (`ink`, dengan "bisnis happy" di-stabilo `accent` ±25%). Di bawahnya tombol pill **"Let's connect →"** (isi `ink`, teks `surface`) dengan handle kontak user, dan kursor animasi mengklik tombol itu.

**Voice Over:**
> "Nggak ada lagi drama narik data manual. Data rapi, bisnis happy. Tertarik ngobrol soal otomatisasi pipeline data? Let's connect!"

## Catatan perubahan dari draf awal user

1. **"Anti gagal" diganti "dicoba ulang otomatis."** Airflow punya retry dan notifikasi, tapi tidak membuat pipeline kebal gagal. Janji yang lebih jujur lebih dipercaya klien.
2. **"Airflow yang ngatur urutannya"**, bukan "Airflow yang nge-extract". Kode ekstraksi dan transformasi tetap dibuat manusia (biasanya Python/SQL); Airflow menjadwalkan dan mengawasi.
3. **Sumber data disebut spesifik** (PostgreSQL, MongoDB, Excel/CSV, Google Analytics) supaya tiap kata di VO bisa disinkronkan dengan satu chip yang muncul.
4. **Palet warna diganti** ke palet user. Karena palet hanya punya satu aksen, status dibedakan lewat bentuk dan isi, bukan warna merah/hijau.

## Catatan implementasi Remotion

Teknik yang dibutuhkan, urut dari yang paling mudah:

- **Teks diketik:** potong string berdasarkan nomor frame (`text.slice(0, n)`), plus kursor berkedip.
- **Angka naik:** `interpolate()` lalu `Math.round()`.
- **Timer:** hitung dari `frame / fps`, format jadi jam:menit:detik.
- **Mask reveal:** wadah `overflow: hidden`, isi naik dengan `translateY` dari `spring()`.
- **Stabilo:** latar `accent` beropasitas rendah yang lebarnya dianimasikan dari 0% ke 100%.
- **Garis DAG tergambar:** SVG path dengan `strokeDashoffset` yang dikendalikan `interpolate()`.
- **Transisi antar scene:** `<Series>` atau `TransitionSeries`; circle wipe lewat `clip-path`.
- **Bayangan chip:** `box-shadow` berlapis dengan warna `ink` beropasitas rendah, supaya chip `surface` terpisah dari `canvas`.

Saran urutan kerja: buat `src/theme.ts` dulu, lalu bangun **Scene 1** sampai matang (chip + teks hidup + timer), karena komponennya bisa dipakai ulang di scene lain. Satu scene per sesi, satu fitur per prompt.

## Referensi gaya

Gaya mengacu pada video referensi dari akun TikTok @ngorzc (adegan "Deadline": chip dengan label teks, timer berdetak, mask reveal, stabilo). Pelajari **tekniknya**; desain, ikon, warna, dan branding di proyek ini adalah milik user.

## Pertanyaan terbuka

- "Teks yang jalan" diasumsikan berarti **teks diketik atau berhitung di dalam chip**. Kalau yang dimaksud user adalah **ticker yang bergeser horizontal** (seperti berita TV), tambahkan sebagai elemen di Scene 1 atau 3.
- Voice over: belum diputuskan apakah direkam sendiri atau memakai text-to-speech. Ini memengaruhi sinkronisasi timing (frame di atas perkiraan; sesuaikan dengan durasi audio asli).
- Warna semantik: **sudah diputuskan** pakai satu aksen dulu. Setelah Scene 3 dirender, tanyakan ke user apakah status "sukses" terasa kurang memuaskan; kalau ya, aktifkan `successOptional` (`#3F6B3A`).
