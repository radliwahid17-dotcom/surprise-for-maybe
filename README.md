# MAYBEVERSE 💗

A tiny universe made just to see you smile. Dibuat untuk Maybe, dari Radli.

## Buka website

**[MAYBEVERSE — buka langsung di browser](https://radliwahid17-dotcom.github.io/surprise-for-maybe/)**

Website sudah diterbitkan melalui GitHub Pages. Pengunjung cukup membuka link dari HP atau laptop.

Website React + TypeScript + Vite dengan ilustrasi SVG orisinal, Motion, Lucide, dan font lokal. Tidak membutuhkan akun, database, API, atau variabel rahasia. Semua interaksi berjalan di browser; mood, sound, penemuan, dan koleksi Mochi disimpan hanya di perangkat pengunjung.

## Pink Mochi

Maskot resmi MAYBEVERSE adalah kelinci cream-pink dari [referensi desain asli](design-reference/PINK_MOCHI_DESIGN.md). Bentuk badan, telinga pink, mata mungil, pipi rosy, mulut omega, dan badge hati dipertahankan. Komponen SVG yang sama digunakan di seluruh website, termasuk mini game dan surat terakhir.

Kamar Mochi menyediakan elus, peluk, camilan, tidur/bangun, dance, gelitik, dan cerita acak dengan reaksi serta animasi yang berbeda. Delapan pilihan aksesori dapat dikoleksi melalui perawatan dan permainan; koleksi, outfit, dan skor terbaik tetap tersimpan setelah refresh. Jendela, lampu kamar, sambutan saat kembali, scrapbook, pesan pribadi Radli, dan ending tersembunyi melengkapi pengalaman. Seluruh mood, surat, kejutan, permainan, dan rahasia sebelumnya tetap tersedia.

[Bukti visual dan catatan verifikasi](design-reference/verification/README.md) mencakup perbandingan referensi asli dengan SVG, desktop, tampilan mobile, kamar, closet, dan ending.

## Unduh website

- [Unduh ZIP produksi siap upload ke hosting](https://github.com/radliwahid17-dotcom/surprise-for-maybe/raw/refs/heads/main/downloads/maybeverse-production.zip) — tidak perlu menjalankan build sendiri.
- [Unduh seluruh source code](https://github.com/radliwahid17-dotcom/surprise-for-maybe/archive/refs/heads/main.zip) — untuk mengedit atau menjalankan proyek React.

Untuk ZIP produksi, ekstrak terlebih dahulu, lalu upload folder hasil ekstraksi yang berisi `index.html`, `assets`, `icons`, dan `sw.js` ke [Netlify Drop](https://app.netlify.com/drop). Situs membutuhkan HTTP/HTTPS; membuka `index.html` langsung dengan `file://` bukan cara menjalankan aplikasi ini. Jika repositori privat, masuk ke akun GitHub yang memiliki akses sebelum mengunduh.

## Menjalankan secara lokal

Gunakan Node.js 24 (lihat `.nvmrc`).

```sh
npm ci
npm run dev
```

Di lingkungan cloud dengan cache home yang tidak writable, gunakan `npm ci --cache /tmp/maybeverse-npm-cache`.

```sh
npm run build       # TypeScript + build production di dist/
npm run preview     # Melihat build production
npm test            # Build + pengujian browser nyata
```

Pengujian memakai Chromium sistem jika ada `/usr/bin/chromium`. Di mesin lain jalankan `npx playwright install chromium`, atau tentukan path melalui `PLAYWRIGHT_CHROMIUM_EXECUTABLE`. Sebanyak 45 tes mencakup welcome, 6 mood, 7 surat, 32 kejutan, 60 pengingat, semua mini game, Easter Egg, kamar dan ekspresi Pink Mochi, koleksi aksesori, ending baru, aksesibilitas, penyimpanan, layout 320/390/768/1440 px, dan PWA offline. Hasil dan screenshot disimpan di `test-results/`.

## Deploy menjadi URL publik

**GitHub Pages:** build khusus dengan `npm run build:pages`. Hasilnya di `dist-pages`, dengan path aset `/surprise-for-maybe/`. Isi build ini dipublikasikan di branch `gh-pages` (root). Setelah GitHub Pages diaktifkan, alamat website adalah `https://radliwahid17-dotcom.github.io/surprise-for-maybe/`; pengunjung cukup membuka link di browser, tanpa mengunduh atau memasang aplikasi.

Jika hosting belum aktif, pemilik repositori dapat membuka **Settings → Pages**, memilih **Deploy from a branch**, branch **gh-pages**, folder **/(root)**, lalu **Save**. GitHub akan menjalankan deployment. Pengaturan ini memerlukan akses administrasi repositori; keberadaan branch saja belum membuktikan website sudah terbit.

Konfigurasi Vercel dan Netlify sudah disertakan. Upload/push berkas proyek ini ke repositori GitHub milik Anda terlebih dahulu. Website dapat diakses tanpa login setelah deploy; hanya pemilik yang memerlukan akun penyedia untuk melakukan deployment.

**Vercel:** pilih **Add New → Project**, import `radliwahid17-dotcom/surprise-for-maybe`, pilih framework **Vite**, build command `npm run build`, output directory `dist`, Node.js **24.x**, lalu **Deploy**. Jika checkout proyek berada dalam folder lain di repositori, atur Root Directory sesuai folder tersebut. Tidak perlu environment variables. Vercel memberikan URL HTTPS publik setelah deployment berhasil.

**Netlify dengan Git:** pilih **Add new site → Import an existing project**, hubungkan repositori ini. Build command `npm run build`, publish directory `dist`. `netlify.toml` menyimpan pengaturan build, Node, dan cache.

**Netlify dengan upload manual:** jalankan `npm run build`, lalu drag folder `dist` ke [Netlify Drop](https://app.netlify.com/drop). Ikuti alur akun/klaim situs Netlify untuk menyimpan deployment. Folder `dist`, bukan source proyek, yang diunggah.

Build default di `dist` digunakan untuk root domain/subdomain Vercel atau Netlify. Build `dist-pages` digunakan untuk GitHub Pages di path proyek. Navigasi surat terakhir menggunakan hash `#one-last-thing`, sehingga tidak memerlukan routing backend. Tidak ada server aplikasi untuk dioperasikan.

## PWA dan privasi

Setelah kunjungan pertama yang berhasil mengunduh seluruh aset, service worker menyimpan situs dan font untuk kunjungan offline. PWA memerlukan HTTPS (atau localhost untuk pengembangan). Di iPhone, buka Safari → Bagikan → Tambah ke Layar Utama. Di browser yang mendukung prompt instalasi, tombol instalasi muncul di footer.

Suara hanya aktif setelah pengguna menyalakannya, tidak ada musik autoplay. Efek suara dibuat oleh Web Audio tanpa aset audio eksternal. Semua interaksi tetap bekerja ketika audio, localStorage, atau service worker tidak tersedia. `prefers-reduced-motion` mengurangi gerakan; mode tangkap hati tetap dapat dimainkan dengan hati diam yang muncul berkala.

Pengingat harian menggunakan tanggal lokal perangkat, tidak berubah saat refresh, dan berganti setelah tengah malam. Tombol tambahan memberi pesan berbeda dari pesan yang sedang tampil. Hasil pencarian Mochi dan penemuan rahasia tersimpan di browser ini saja. Hapus data situs dari pengaturan browser untuk mengulang sambutan pertama.

## Mengubah konten

Pesan mood, surat, pengingat, kejutan, dan surat penutup lama ada di `src/data.ts`. Maskot resmi ada di `src/PinkMochi.tsx` dan diekspor melalui `src/Mochi.tsx`; identitasnya mengikuti referensi desain. Perawatan dan penyimpanan profil ada di `src/Companion.tsx`, kamar di `src/MochiBedroom.tsx`, serta aksesori dan pesan baru di `src/mochi-data.ts`. Permainan ada di `src/Games.tsx`; gaya dasar ada di `src/styles.css` dan tema Pink Mochi di `src/pink-world.css`. Service worker dibuat saat build dengan daftar aset dan versi cache sesuai build, agar tidak menyimpan nama chunk lama.

Made for Maybe. Made with care. Made by Radli. ♡
