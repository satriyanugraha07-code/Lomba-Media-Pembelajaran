# Tes Semester Gambar Teknik

## Paket dan penilaian

- PTS: 60 menit; PAS: 90 menit. Masing-masing 20 PG × 3 poin dan 5 uraian × 8 poin.
- Seluruh 25 soal dan gambarnya tampil dalam satu lembar. Nomor navigasi, penanda tinjau, perbesar gambar, dan kalkulator tersedia di ruang ujian.
- Huruf pilihan diacak untuk setiap percobaan. Kunci di bawah berupa teks jawaban, bukan huruf posisi yang dilihat peserta.
- PG diperiksa otomatis dari ID pilihan. Uraian tidak diberi nilai otomatis; empat kriteria di bawah masing-masing bernilai 0–2 poin. Nilai akhir menunggu guru.
- Ringkasan draf dan hasil lintas perangkat tersedia pada Beranda guru dan Google Sheets setelah [penghubung login](google-sheets-login.md) dipasang. Bukti individual berformat JSON; arsip lokal tetap dipertahankan per akun siswa.

## Dasar materi

Soal mengadaptasi job yang sudah ada di public/worksheets: Garis dalam gambar, Konstruksi Geometri 01/02/03, Bentangan 01 Silinder, Bentangan Kerucut, Bentangan Pipa Miring, Bukaan Pipa Miring, Isometri Garis Bantu, dan Isometri Dudukan Silinder. Sketsa soal disederhanakan; ukuran tertulis yang berlaku. Dimensi gambar tidak boleh diukur dari layar.

Acuan utama: silinder Ø40 × 45 mm; kerucut r30 dan tinggi 70 mm; pipa Ø40 dengan 12 interval; dudukan 100 × 60 × 80, boss Ø40 × 20 dan lubang Ø16 tembus. Gunakan nilai π pada masing-masing soal untuk menghindari perbedaan pembulatan.

## Pengawasan dan pemulihan

- Mulai hanya melalui tindakan peserta setelah identitas dan persetujuan aturan diisi. Layar penuh diminta jika didukung. Permintaan yang ditolak tidak memulai waktu atau percobaan. Perangkat tanpa dukungan memakai pengawasan tab, dengan status yang terlihat.
- Percobaan menyimpan deadline absolut, urutan opsi, jawaban, penanda, dan catatan keluar. Refresh tidak menambah waktu. Percobaan aktif yang dipulihkan tetap dijeda sampai peserta melanjutkan; kejadian keluar yang sudah dijeda tidak dihitung ganda.
- Pindah tab, kehilangan fokus, keluar fullscreen, navigasi ke modul lain, tombol kembali, serta refresh/keluar dicatat. Beberapa event dari satu kejadian dihitung sekali sampai peserta melanjutkan.
- Sesudah tiga kejadian atau saat waktu habis, jawaban diserahkan dan kontrol dilepas. Jalur pengumpulan manual memakai konfirmasi jumlah soal kosong. Listener, fullscreen, dan wake lock dilepas setelah selesai.
- Penyimpanan yang gagal ditampilkan; peserta dapat mengunduh bukti. Arsip hasil ditambah secara idempotent menurut ID percobaan. Draf rusak tidak diam-diam dihapus atau dipakai memulai ulang.

Ini pengawasan browser, bukan aplikasi kiosk pada sistem operasi. Browser tetap bisa ditutup, perangkat lain tetap bisa digunakan, dan pencatatan fokus tidak otomatis membuktikan kecurangan. Jam, draf, dan penilaian sisi klien bukan sumber otoritatif. Untuk ujian resmi berisiko tinggi, integrasikan waktu, penyimpanan, akses satu sesi, dan penilaian di server serta pengawasan guru. Tidak ada klaim penguncian OS atau pendeteksian screenshot/devtools yang andal.

## Kunci dan rubrik

### Tes Tengah Semester

| Nomor | Jawaban PG |
| --- | --- |
| 1 | Kontinu tebal |
| 2 | Rusuk yang tersembunyi |
| 3 | 14 mm |
| 4 | Tegak lurus terhadap kedua garis |
| 5 | 30 mm |
| 6 | 60° |
| 7 | 72° |
| 8 | Seluruh titik berada pada lingkaran |
| 9 | 51,43° |
| 10 | 30° |
| 11 | 30° |
| 12 | Memeriksa kesamaan sisi dan pertemuan titik akhir dengan titik awal |
| 13 | 125,6 mm |
| 14 | 45 mm |
| 15 | 30° |
| 16 | Menandai posisi generator keliling yang bersesuaian |
| 17 | Juring lingkaran |
| 18 | Garis pelukis kerucut |
| 19 | √(70² + 30²) |
| 20 | 141,8° |

Uraian: setiap butir berikut bernilai maksimal 2 poin (0: tidak terpenuhi; 1: sebagian; 2: benar dan jelas).

**Soal 21 (8 poin)**

- A: garis benda terlihat, kontinu tebal
- B: garis bantu/ukuran, kontinu tipis
- C: rusuk tersembunyi, gores tipis
- D: sumbu, gores-titik tipis

**Soal 22 (8 poin)**

- Lingkaran R30 dan sumbu dibuat tipis
- Bukaan jangka R30 dipindahkan enam kali
- Enam titik berurutan dihubungkan
- Kesamaan sisi dan penutupan diperiksa

**Soal 23 (8 poin)**

- Panjang πD = 125,6 mm
- Tinggi bentangan 45 mm
- Dua belas interval sama, sekitar 10,47 mm
- Nomor generator sesuai dan sambungan diperiksa

**Soal 24 (8 poin)**

- s = √5800 ≈ 76,2 mm
- θ = 360 × 30/√5800 ≈ 141,8°
- Busur juring sama dengan 2πr
- Bukan tinggi tegak sebagai radius juring

**Soal 25 (8 poin)**

- Sumber kesalahan alat/titik pusat dijelaskan
- Kesalahan pemindahan jarak atau pembagian sudut dijelaskan
- Sudut, sisi, dan penutupan diperiksa
- Garis bantu dikoreksi sebelum penebalan

### Tes Akhir Semester

| Nomor | Jawaban PG |
| --- | --- |
| 1 | 125,66 mm |
| 2 | 10,47 mm |
| 3 | Generator dengan nomor yang bersesuaian |
| 4 | Tinggi generator berbeda sesuai perpotongan dengan bidang miring |
| 5 | Sama |
| 6 | Dibangun dari titik perpotongan pada tiap generator |
| 7 | 30° |
| 8 | Tegak |
| 9 | Sejajar arah X pada sketsa |
| 10 | Elips |
| 11 | 40 mm |
| 12 | Lubang berdiameter 16 mm yang menembus bagian tersebut |
| 13 | 12 mm |
| 14 | Panjang, lebar, dan tinggi keseluruhan |
| 15 | Kotak batas dan sumbu → alas dan tiang → boss/lubang → takik dan pengaku → penegasan |
| 16 | Keliling alas kerucut |
| 17 | Menyinggung lingkaran |
| 18 | Memastikan total sudut 360° dan tiap interval 30° |
| 19 | Garis bantu lebih tipis dari garis benda |
| 20 | 50 mm |

Uraian: setiap butir berikut bernilai maksimal 2 poin (0: tidak terpenuhi; 1: sebagian; 2: benar dan jelas).

**Soal 21 (8 poin)**

- Keliling 125,66 mm dan interval 10,47 mm
- Tampak depan serta pembagian lingkaran benar
- Tinggi dipindahkan ke generator bernomor sama
- Kurva halus dan ujung sambungan sama tinggi

**Soal 22 (8 poin)**

- Ujung berbeda tidak cocok saat disambung
- Urutan generator 1 sampai kembali 1 diperiksa
- Tinggi tiap titik ditelusuri ke tampak depan
- Kurva dan titik akhir dikoreksi tanpa mengubah keliling

**Soal 23 (8 poin)**

- X/Y 30° dan Z tegak
- Kotak batas dibangun menurut ukuran sumbu
- Detail dipindahkan sejajar sumbu yang sesuai
- Kesamaan arah, ukuran, dan garis benda diperiksa

**Soal 24 (8 poin)**

- Kotak batas 100 × 60 × 80 dan alas/tiang dibangun
- Boss Ø40 tinggi 20 dan elips lubang Ø16 sepusat
- Takik atas 30 × 10 dan alas 20 × 8 diperiksa
- Pengaku lebar 10, garis bantu, dan garis benda diperiksa

**Soal 25 (8 poin)**

- Silinder: persegi panjang πD × tinggi
- Kerucut: juring dengan radius garis pelukis
- Isometri: tiga sumbu dan lingkaran menjadi elips
- Pemeriksaan keliling/busur dan ukuran menurut sumbu dijelaskan

## Validasi

Jalankan `node --test tests/semester-exams.test.mjs` untuk jumlah/bobot soal, hitungan geometri, pemulihan deadline dan jawaban, validasi draf, deduplikasi kejadian, lifecycle pengawasan, eksport CSV, dan escaping input. Jalankan `npm run build` dan periksa ruang ujian pada desktop serta ponsel.
