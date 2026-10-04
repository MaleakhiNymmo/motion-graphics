# Konteks Proyek: Belajar Remotion + AI untuk Motion Graphic

> Dokumen serah-terima dari percakapan sebelumnya (4 Oktober 2026) antara user dan Claude di claude.ai.
> Dibuat supaya agent di Antigravity bisa membaca konteks ini dan melanjutkan membimbing user.
> Fakta teknis di bawah dikumpulkan lewat pencarian web pada tanggal tersebut. Kalau ada keraguan, verifikasi dengan skill `remotion-docs` atau dokumentasi resmi di remotion.dev.

## Instruksi untuk agent (baca dulu)

- Balas dalam **Bahasa Indonesia santai** (user memakai "aku/kamu").
- User adalah **pemula** yang ingin benar-benar **menguasai** Remotion, bukan sekadar menerima hasil jadi. Setelah menulis kode, **jelaskan per bagian** dan ajak user mengubah angka sendiri untuk melihat efeknya.
- Kerjakan **satu fitur per prompt**. Jangan menumpuk banyak perubahan sekaligus.
- **Jangan berasumsi setup user sudah selesai.** Status terakhir tidak diketahui (lihat bagian "Posisi terakhir"). Tanyakan dulu atau cek project-nya.
- Pakai **`interpolate()` dan `spring()`** untuk semua animasi. **Jangan** pakai CSS transition/animation, karena Remotion merender frame demi frame dan animasi CSS tidak terender dengan benar.
- Gunakan skill Remotion yang terpasang (`remotion-docs`, `remotion-captions`, dst.) sebelum mengimplementasikan API yang tidak pasti.
- Saat mengutip referensi gaya (lihat bawah), ajarkan **teknik**-nya, tapi desain, karakter, dan branding harus **orisinal buatan user**. Jangan menjiplak karakter atau merek kreator referensi.

## Profil dan tujuan user

- Sedang "gabut" dan ingin memakai waktu luang untuk membuat sesuatu yang bisa menghasilkan **uang tambahan** dan sekaligus **dipelajari**.
- Punya langganan **Google AI Pro** (Google One Pro). Dari pencarian: paket ini umumnya mencakup Gemini, Flow dengan Veo (±1.000 kredit AI/bulan), NotebookLM, Whisk, dan kemungkinan Flow Music. Ketersediaan fitur bisa beda per negara, jadi user perlu mengecek sendiri di akunnya.
- Minat: video dan **motion graphic**. Setelah membahas pilihan, user memutuskan belajar **Remotion** (framework React untuk membuat video lewat kode) dengan bantuan AI.
- Lokasi: Indonesia. Pasar sasaran untuk jasa: UMKM dan startup lokal, konten berbahasa Indonesia.

## Lingkungan user

- OS: **Windows**
- Editor: **Antigravity IDE** (agent di dalamnya memakai model Sonnet)
- Rencana folder kerja: `C:\personal\motion-graphocs\my-video` (hindari folder yang disinkronkan OneDrive)
- Node.js: versi LTS (belum dikonfirmasi sudah terpasang)

## Fakta penting tentang Remotion

- **Konsep inti:** video adalah fungsi dari nomor frame. Empat primitif: `<Composition>` (lebar, tinggi, fps, durasi dalam frame), `useCurrentFrame()`, `interpolate()` / `spring()`, dan `<Sequence>` / `<Series>` (mengatur waktu). Pendukung: `<AbsoluteFill>`, `<Img>`, `<Audio>`, `<OffthreadVideo>`.
- **Rendering:** Remotion membuka Chromium headless, mengambil screenshot tiap frame, lalu merangkainya dengan ffmpeg (sudah termasuk, tidak perlu install terpisah). Video 30 detik @30fps = 900 frame, jadi render butuh waktu.
- **Lisensi:** gratis, termasuk penggunaan komersial, untuk individu dan perusahaan sampai 3 orang. Perusahaan 4+ orang perlu Company License. Membangun layanan otomatis (mis. "ketik prompt, keluar video" untuk orang lain) masuk skema "Remotion for Automators" yang berbayar. Detail lengkap: remotion.dev/docs/license.
- **MCP vs Skills:** MCP dokumentasi resmi Remotion sudah **deprecated** dan digantikan **Agent Skills**. Tutorial lama yang menyuruh pasang "Remotion MCP" sudah ketinggalan zaman. Remotion juga punya WebMCP untuk Studio, tapi saat riset hanya agent tertentu (ChatGPT Codex) yang mendukungnya, jadi tidak relevan untuk setup ini.
- **Skill resmi:** dipasang dengan `npx skills add remotion-dev/skills`. Isinya antara lain `/remotion-captions` (subtitle), `/remotion-docs` (cari dokumentasi), `/remotion-saas`, `/remotion-upgrade`.
- **Lokasi skill di Antigravity:** workspace = `<project>/.agents/skills/`. Skill dimuat saat startup, jadi restart Antigravity setelah memasang skill.

## Referensi gaya yang ingin dituju user

User menyukai akun TikTok **@ngorzc**. Akun tidak bisa dibuka langsung, jadi user mengirim 2 video contoh. Hasil analisis frame:

### Video 1: perkenalan produk "Estra" (20 detik, 16:9, ada audio)
- Pembuka logo reveal dengan titik-titik berwarna, lalu 4 karakter maskot 3D imut (Medix biru-putih bertema dokter, Billie indigo dengan kalkulator, Opsy hijau dengan topi salib rumah sakit, Anomaly ungu dengan kaca pembesar). Tiap karakter punya satu adegan dengan warna latar sendiri.
- Tipografi besar tebal, tagline pendek ("Sees the pattern."), tag berbentuk pill berbahasa Indonesia, titik indikator progres di bawah, lingkaran tipis konsentris di belakang karakter.
- Transisi antar adegan memakai **circle wipe**. Penutup: keempat karakter berkumpul dan sedikit bergerak, lalu judul "Estra" dan tagline.
- Dugaan (belum pasti): karakter dibuat dengan generator gambar AI; tata letak, teks, dan animasi dari Remotion.

### Video 2: showreel animasi komponen UI (26,5 detik, 1:1, ada audio)
- Latar hitam bergrid tipis, bingkai sudut ala viewfinder, label kecil bergaya monospace di pojok, dan timecode (TC) di pojok kanan bawah (pembacaan teks HUD perkiraan).
- Komponen yang dianimasikan satu per satu dengan kursor animasi: tombol "Mulai →" yang berubah jadi centang, music player, slider, toggle "Motion blur", tab Harian/Mingguan/Bulanan dengan pill yang meluncur, kartu grafik (angka 12.480 dan garis yang tergambar), command palette (Render video, Render still, Ekspor MP4, ...), progress bar "Merender... 188 / 900", lalu kembali ke tombol awal (loop).
- Banyak memakai blur/motion blur pada transisi.

### Kesimpulan kecocokan
Video 2 hampir sepenuhnya cocok untuk Remotion (komponen UI = React yang dianimasikan, timecode = frame / fps). Video 1 gabungan: Remotion untuk tata letak, teks, dan transisi; karakter butuh generator gambar (tantangan utamanya menjaga konsistensi karakter antar gambar, bukan animasinya). **Urutan belajar yang disepakati: mulai dari gaya video 2, baru ke gaya video 1.**

## Peta jalan belajar

| Tahap | Proyek | Yang dipelajari |
|---|---|---|
| 1 | Tombol "Mulai →" berubah jadi centang, plus kursor bergerak | `spring`, `interpolate`, `AbsoluteFill` |
| 2 | Toggle, tab dengan pill meluncur, slider, music player | `Sequence`, easing, motion blur |
| 3 | Gabung jadi satu video loop 1:1: latar grid, bingkai HUD, timecode, angka naik, garis grafik tergambar | `TransitionSeries`, SVG, hitungan dari `useCurrentFrame` |
| 4 | Gaya video 1 dengan bentuk placeholder dulu: judul besar, pill, circle wipe, titik progres | Transisi `clip-path`, tipografi, tata letak |
| 5 | Karakter sendiri dari generator gambar lalu dianimasikan (melayang, berkedip, memantul) | `<Img>`, animasi sederhana, opsional klip Veo |
| 6 | Jadikan template dengan props (nama produk, tagline, warna) | Video berbasis data, portofolio |

Tambahan di jalur lain: subtitle animasi ala TikTok (skill `remotion-captions`) dan format vertikal 9:16 adalah proyek yang paling mudah dijual.

## Prompt tahap 1 (siap dipakai)

```
Pakai skill Remotion. Buat composition 1080x1080, 30 fps, 4 detik.
Latar hitam dengan grid tipis. Di tengah ada tombol pill putih
bertuliskan "Mulai →". Kursor kecil bergerak dari kanan bawah ke tombol,
tombol menyusut sedikit (efek klik), lalu berubah jadi lingkaran putih
dengan ikon centang hitam. Pakai spring dan interpolate, bukan CSS
animation. Jelaskan kodenya per bagian setelah selesai.
```

## Setup (Windows + Antigravity), ringkasan

1. Install Node.js LTS dari nodejs.org, restart Antigravity, cek `node -v` dan `npm -v`.
2. Buat folder `C:\dev`, buka di Antigravity.
3. Terminal: `npx create-video --yes --blank my-video`, lalu `cd my-video`, lalu `npm install`. Buka folder `my-video` sebagai workspace.
4. `npm run dev` untuk membuka Remotion Studio (biasanya `localhost:3000`). Biarkan jalan di satu terminal.
5. Terminal kedua: `npx skills add remotion-dev/skills`, pilih Antigravity (scope project). Pastikan folder `.agents\skills` ada, restart Antigravity, lalu cek agent mengenali skill Remotion.
6. Tempel prompt tahap 1.
7. Render: `npx remotion render <id-composition> out/tombol.mp4` (id ada di `src/Root.tsx`).

### Troubleshooting Windows
- **"running scripts is disabled on this system"** (PowerShell): jalankan sekali `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`, atau pakai Command Prompt.
- **"npx is not recognized"**: restart Antigravity setelah install Node.
- **Animasi jalan di Studio tapi hasil render beda**: biasanya memakai animasi CSS; ganti ke `interpolate`/`spring`.
- **Port 3000 terpakai**: Remotion akan memakai atau menawarkan port lain.

## Ide monetisasi yang sudah dibahas

1. **Jasa video promo/animasi UI untuk UMKM dan startup lokal** (paling cepat menghasilkan; tidak perlu audiens). Cari klien lewat DM Instagram, atau pasang jasa di Fiverr/Sribulancer.
2. **Subtitle animasi dan konten Shorts/TikTok/Reels** (faceless; hati-hati kebijakan platform soal konten AI massal; affiliate lebih cepat daripada monetisasi platform).
3. **Template video berbasis props** yang bisa dipakai ulang untuk banyak klien.
4. Produk digital (template, rangkuman memakai NotebookLM) dan jasa pendukung (subtitle, copywriting, terjemahan).
5. Skill teknis jangka panjang: otomasi sederhana dan aplikasi kecil dengan bantuan AI.

Catatan jujur: AI video makin ramai saingannya; nilai jual ada di niche, storytelling, dan kerapian eksekusi. Sebelum menjual hasil ke klien, cek syarat penggunaan komersial tiap tool dan beri tahu klien kalau ada bagian buatan AI. Veo kurang andal untuk teks/logo; kombinasinya: klip Veo sebagai latar via `<OffthreadVideo>`, teks dan animasi dari Remotion.

## Sumber belajar

- Docs resmi Remotion: https://www.remotion.dev/docs/ (daftar API inti: https://remotion.dev/docs/remotion)
- Agent Skills Remotion: https://www.remotion.dev/docs/ai/skills dan https://github.com/remotion-dev/skills
- Lisensi: https://www.remotion.dev/docs/license/pricing
- YouTube (belum ditonton isinya oleh Claude; sebagian mempromosikan komunitas berbayar; cek tanggal karena Remotion cepat berubah):
  - Tutorial Remotion untuk Pemula (Bahasa Indonesia): https://www.youtube.com/watch?v=4zEUZvgtN04
  - Remotion: How To Get Started Making Videos With Code: https://www.youtube.com/watch?v=PP9kekHoXRk
  - Complete Remotion Tutorial for Beginners: https://www.youtube.com/watch?v=0-Uw6O52wI4
  - Using Remotion for AI Generated Motion Graphics: https://www.youtube.com/watch?v=ctNCOCFa3AE

## Posisi terakhir (where we left off)

- Percakapan berhenti tepat setelah panduan setup Windows + Antigravity (langkah 1-7) diberikan. **User belum mengonfirmasi** langkah mana yang sudah dijalankan.
- Langkah berikutnya: tanyakan ke user sudah sampai langkah berapa, bantu perbaiki jika ada error, lalu bimbing menyelesaikan **proyek tahap 1** (tombol "Mulai →" menjadi centang) sambil menjelaskan konsep `spring`, `interpolate`, dan `AbsoluteFill`.
- Setelah tahap 1 selesai dan dirender, lanjut ke tahap 2 sesuai tabel peta jalan.
