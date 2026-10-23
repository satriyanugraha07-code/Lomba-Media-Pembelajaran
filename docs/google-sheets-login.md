# Login dan sinkronisasi Google Sheets ARCUS

Login siswa: nama lengkap, kelas, dan nomor absen. Login guru: nama dan password. Keempat tes memakai identitas siswa tersebut: diagnostik, pemahaman, tengah semester, dan akhir semester. Data lokal dipisahkan menurut ID siswa; data lama tanpa akun tidak otomatis dipindahkan ke siswa baru.

## Pemasangan sekali oleh pemilik spreadsheet

Tujuan: https://docs.google.com/spreadsheets/d/1lJRwjknEZcjQUThTr_muJxltySKCWVcqXO1olZ3leqo/edit

Project terikat yang sudah dipasang: [ARCUS Login dan Rekap Tes](https://script.google.com/u/0/home/projects/1vNTZlOcnzIJmtehdCeZcwaQYxRamWGiOi3ybQZPPkczLG_ozktD6Js1_/edit). Deployment versi 1 aktif sejak 23 Oktober 2026; tiga tabel ARCUS sudah dibuat dan akun guru sudah dikonfigurasi oleh pemilik. URL penghubung sudah dipasang pada `public/arcus-config.json` untuk semua perangkat. Respons layanan nyata telah mengonfirmasi tabel siap dan akun guru tersedia.

URL web app: https://script.google.com/macros/s/AKfycby7ynSwa0hpmwPq6r5mQxEuAK2UBz-u7FuZvc3jJ8NG2PtQY9XxFDCeGsyrmS63Lx8o/exec

Akses umum spreadsheet sudah diubah menjadi **Dibatasi** atas persetujuan pemilik. Siswa tetap mengakses web app; spreadsheet tidak perlu dibagikan ke siswa.

1. Masuk Google sebagai pemilik spreadsheet. Batasi berbagi file ke pemilik/guru sebelum memuat data siswa. Siswa mengakses aplikasi, tanpa perlu akses langsung ke spreadsheet.
2. Buka **Ekstensi → Apps Script**. Isi `Code.gs` menggunakan berkas **backend/Code.gs** pada proyek ini. Berkas ini sudah memuat definisi seluruh 94 soal dari empat tes. Jangan memakai `Code.template.gs` secara langsung.
3. Tambahkan berkas HTML bernama **TeacherSetup**. Salin **backend/TeacherSetup.html** ke sana.
4. Opsional: tampilkan manifest pada pengaturan proyek dan gunakan **backend/appsscript.json**. Kode memakai akses spreadsheet, dialog spreadsheet, dan email pengguna untuk memeriksa pemilik.
5. Simpan, pilih fungsi **setupArcusDanGuru**, lalu jalankan. Pemilik perlu meninjau dan menyetujui izin Google yang diminta sendiri. Fungsi ini menambah tiga tab ARCUS, mempertahankan sheet yang sudah ada, dan membuka form pengaturan akun guru. **setupArcus** hanya menyiapkan tabel tanpa membuka form.
6. Muat ulang spreadsheet. Pilih **ARCUS → Atur akun guru**, lalu isi sendiri nama dan password minimal 12 karakter. Password memakai input tersembunyi dan tidak dikirim melalui chat. Mengatur ulang akun membatalkan sesi guru sebelumnya.
7. Di Apps Script pilih **Deploy → New deployment → Web app**. Pilih **Execute as: Me** dan **Who has access: Anyone** agar siswa dapat masuk memakai nama/kelas/absen. Pemilik mengesahkan deployment ini pada akun Google. API tetap memeriksa token sesi dan peran sebelum menulis atau membaca data; tidak menyediakan rekap anonim.
8. Salin URL deployment berakhiran **/exec**. Di halaman login ARCUS buka **Pengaturan koneksi untuk guru**, tempel URL, lalu **Hubungkan Google Sheets**.
9. Agar semua perangkat memakai koneksi yang sama, masukkan URL tersebut ke `public/arcus-config.json` pada `webAppUrl`, lalu build/deploy situs kembali. Alternatif build: `VITE_GOOGLE_SCRIPT_URL`. Pengaturan pada halaman login hanya berlaku di browser itu.

Deployment dijelaskan di [panduan resmi Google Apps Script](https://developers.google.com/apps-script/guides/web). Setelah perubahan kode Apps Script, perbarui deployment ke versi baru; simpan URL `/exec` yang sama.

## Isi spreadsheet

| Tab | Isi |
| --- | --- |
| ARCUS_Siswa | ID siswa, nama, kelas, absen, waktu login terakhir |
| ARCUS_Tes | Satu baris per percobaan: status, waktu, jumlah jawaban, nilai PG, jumlah uraian, catatan, dan revisi |
| ARCUS_Jawaban | Satu baris per soal: pertanyaan, teks jawaban, kode pilihan, dan waktu pembaruan |

Status **Sedang dikerjakan** disimpan ketika tes dibuka/dimulai dan diperbarui saat menjawab. Status **Sudah disubmit** dikunci setelah pengumpulan manual/otomatis. Submit memperbarui percobaan yang sama, tanpa membuat baris rekap baru. Percobaan ulang memakai ID baru. Sheet menyimpan tanggal sebagai nilai tanggal dan menampilkannya dalam WIB.

Guru masuk ke ARCUS untuk melihat rekap, menyaring tes/siswa, memeriksa jawaban draf atau final, dan mengunduh ringkasan CSV. Jawaban lengkap tersedia pada spreadsheet atau tombol Lihat. PG dihitung lagi di backend dari kunci; nilai yang dikirim klien diabaikan. Uraian tetap memerlukan penilaian guru.

## Penyimpanan dan pemulihan

- Setiap perubahan langsung masuk draf dan antrean lokal, kemudian dikirim setelah jeda pengetikan sekitar satu detik. Antrean yang tertunda dicoba kembali setiap 10 detik dan ketika koneksi kembali.
- Label **Tersimpan di Google Sheets** muncul setelah respons konfirmasi. Jika koneksi putus, label menunjukkan belum terkirim; aplikasi tidak menganggap pengiriman tanpa respons sebagai berhasil.
- Antrean bertahan setelah refresh/keluar akun. Masuk kembali dengan identitas yang sama untuk melanjutkan pengiriman. Nama, kelas, atau absen yang berbeda menghasilkan ID siswa lain.
- Pengiriman berurutan memakai revisi. Respons versi lama tidak menghapus jawaban yang lebih baru. Backend memakai lock agar pembaruan baris tidak bertabrakan, menolak akses percobaan siswa lain, dan tidak mengubah hasil yang sudah disubmit.
- Waktu semester mengikuti waktu server setelah konfirmasi pertama. Sesudah deadline, backend menutup percobaan menggunakan jawaban terakhir yang sudah diterima, termasuk ketika rekap dimuat setelah siswa menutup halaman dan tidak kembali. Jawaban offline yang baru tiba setelah deadline tidak mengganti hasil akhir; bukti lokal dapat ditinjau guru.
- Sesi disimpan di sessionStorage, bukan password. Sesi siswa maksimal enam jam dan guru dua jam; cache Google dapat mengakhiri sesi lebih cepat. Masuk kembali memperbarui sesi tanpa menghapus antrean.
- Password guru diturunkan dengan PBKDF2 SHA-256 (310.000 iterasi), diverifikasi dengan HMAC ber-pepper di Script Properties. Tidak ada password default, plaintext password, atau kunci rahasia pada bundle situs maupun sheet. Lima kegagalan login guru dibatasi selama 15 menit.

Login siswa tanpa password merupakan identifikasi berdasarkan tiga isian, sesuai permintaan; orang yang mengetahui ketiganya dapat menggunakan identitas yang sama. Untuk membuktikan identitas siswa diperlukan tambahan seperti daftar siswa/kode akses/SSO. Pengawasan browser tidak mengunci OS.

## Verifikasi setelah deployment

Gunakan identitas uji terpisah. Masuk sebagai siswa, buka setiap tes, isi satu PG dan satu uraian, lalu pastikan baris draf muncul sebelum submit. Putuskan jaringan, ubah jawaban, sambungkan kembali, dan periksa teks terbaru. Submit harus mengubah status pada baris yang sama. Masuk sebagai guru, lihat rekap dan jawaban. Data uji jangan dicampur dengan penilaian siswa sebenarnya.

Verifikasi layanan asli pada 23 Oktober 2026 memakai **Uji Sistem ARCUS / UJI SISTEM / 99**: keempat tes masing-masing menyimpan satu PG dan satu uraian. Draf diagnostik diperiksa langsung pada sheet sebelum submit. Setelah pengumpulan diagnostik, PTS, dan PAS, `ARCUS_Tes` tetap berisi empat ID percobaan yang unik; post-test sengaja tetap **Sedang dikerjakan** dengan dua jawaban tersimpan. API menolak rekap guru ketika dipanggil dengan sesi siswa. Empat baris ini merupakan data uji, bukan nilai siswa. Konfigurasi akun guru terkonfirmasi; password guru tetap hanya diketahui pemilik.

Jika URL `/exec` dihapus atau deployment tidak dapat diakses, situs menampilkan pesan koneksi. Tombol masuk dinonaktifkan ketika URL belum tersedia; jawaban yang belum terkirim tetap berada pada antrean perangkat.

## Pengembangan

`npm run backend:build` memperbarui `backend/Code.gs` dari soal dalam proyek. `npm test` memeriksa antrean, peran, isolasi data, penilaian, deadline, dan penguncian hasil memakai lingkungan Apps Script tiruan. Pengujian ini tidak menggantikan verifikasi deployment Google yang sebenarnya.
