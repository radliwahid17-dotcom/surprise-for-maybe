# MAYBEVERSE — ZIP produksi

`maybeverse-production.zip` berisi upgrade Pink Mochi: kelinci cream-pink, kamar interaktif, perawatan, koleksi aksesori, permainan, dan ending tersembunyi. Build produksi sudah divalidasi dengan 45 pemeriksaan browser (24 fitur sebelumnya, 19 pemeriksaan Pink Mochi, dan 2 khusus GitHub Pages). Arsip ini berisi seluruh aset dan font lokal; tidak memerlukan dependensi atau build tambahan untuk diunggah ke hosting statis.

1. Unduh [ZIP produksi](https://github.com/radliwahid17-dotcom/surprise-for-maybe/raw/refs/heads/main/downloads/maybeverse-production.zip).
2. Ekstrak ZIP ke folder di perangkat Anda.
3. Upload folder yang berisi `index.html` ke [Netlify Drop](https://app.netlify.com/drop), lalu ikuti alur Netlify untuk mendapatkan dan menyimpan URL HTTPS publik.

Untuk menjalankan tanpa deploy, gunakan server HTTP lokal, misalnya `python3 -m http.server 8080` dari folder hasil ekstraksi. Untuk mengedit source code, gunakan ZIP repositori atau clone GitHub, lalu ikuti README di root proyek.

Setelah source diubah, jalankan `npm run build` dan `npm test`, lalu buat ulang arsip dari isi folder `dist` agar unduhan tetap sesuai dengan source yang dipublikasikan.
