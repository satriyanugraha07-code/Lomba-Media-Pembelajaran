# ARCUS

**Precision Starts Here.** Media belajar gambar teknik yang dapat dipakai di desktop dan ponsel. Materi, simulasi, lembar kerja PDF, serta empat tes tersedia dari **Beranda Belajar** setelah login. Identitas pengerjaan tes mengikuti akun siswa.

## Situs

[Buka ARCUS](https://satriyanugraha07-code.github.io/Lomba-Media-Pembelajaran/). GitHub Actions menjalankan pengujian dan build sebelum menerbitkan perubahan pada branch `main` ke GitHub Pages.

## Jalankan lokal

```bash
npm install
npm run dev
```

Buka alamat yang ditampilkan Vite. Untuk mencoba dari Android atau iPhone pada jaringan Wi-Fi yang sama, jalankan `npm run dev -- --host 0.0.0.0`, lalu buka `http://IP-KOMPUTER:5173/` di browser ponsel. Jika port berubah, gunakan nomor port yang ditampilkan Vite. Firewall komputer mungkin perlu mengizinkan akses pada jaringan lokal.

## Build

```bash
npm run build
```

Hasil situs statis berada di `dist/` dan dapat diunggah ke hosting statis. Login siswa memakai nama, kelas, dan absen; login guru memakai nama dan password. Penghubung Google Apps Script menyimpan draf serta submit ke Google Sheets. Draf dan antrean yang belum terkirim tetap ada di perangkat, dipisahkan per siswa. Rekap seluruh siswa tersedia pada Beranda akun guru.

Pasang [penghubung Google Sheets](docs/google-sheets-login.md) sekali pada akun pemilik, lalu isi URL `/exec` pada `public/arcus-config.json`. Tanpa deployment ini, login belum diaktifkan. `backend/Code.gs` dan `backend/TeacherSetup.html` adalah berkas pemasangannya; jangan menaruh password atau rahasia pada frontend.

Penghubung proyek ini sudah aktif dan URL-nya terpasang. Password guru ditentukan pemilik melalui menu **ARCUS → Atur akun guru** pada spreadsheet. Password tidak tersedia pada repositori dan tidak dapat dibaca kembali; gunakan menu yang sama untuk menggantinya jika lupa.

## Ujian semester

**Tes Tengah Semester (60 menit)** dan **Tes Akhir Semester (90 menit)** tersedia di Beranda dan menu Evaluasi. Masing-masing berisi 20 pilihan ganda bergambar dan 5 uraian berdasarkan job lembar kerja. Semua soal tampil dalam satu halaman, dengan navigasi nomor, penanda tinjau, perbesaran gambar, dan kalkulator di ruang ujian.

Mode ujian meminta layar penuh jika didukung, menahan navigasi ke modul lain, dan mencatat perpindahan tab/fokus. Tiga kejadian keluar atau waktu habis mengumpulkan jawaban otomatis. Deadline dan draf dipulihkan setelah refresh. Ini pengawasan browser; tidak dapat mengunci sistem operasi atau menggantikan server dan pengawasan guru untuk ujian resmi.

PG dinilai otomatis dari 60 poin; uraian maksimal 40 poin dinilai guru. Draf, hasil, jawaban, dan catatan dikirim ke rekap Google Sheets dan dapat dilihat pada Beranda guru. Kisi-kisi, kunci, rubrik, dan batas teknis tercatat di [panduan pengembang/guru](docs/semester-exams.md).
