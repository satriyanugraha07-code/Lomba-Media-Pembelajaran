/* ARCUS Google Sheets API. Generated with exam definitions by npm run backend:build. */
const ARCUS_SPREADSHEET_ID = '1lJRwjknEZcjQUThTr_muJxltySKCWVcqXO1olZ3leqo';
const ARCUS_ITERATIONS = 310000;
const ARCUS_EXAMS = {
  "diagnostik": {
    "id": "diagnostik",
    "title": "Tes Diagnostik",
    "essayMax": 75,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "prompt": "1. Fungsi utama gambar teknik adalah ...",
        "options": {
          "A": "Membuat gambar terlihat menarik.",
          "B": "Menyampaikan informasi bentuk dan ukuran benda secara jelas.",
          "C": "Menghias laporan pekerjaan.",
          "D": "Melatih kemampuan menggambar bebas."
        },
        "correct": "B",
        "points": 5
      },
      {
        "id": "q2",
        "type": "mcq",
        "prompt": "2. Seorang pekerja diminta membuat benda berbentuk kotak dengan satu lubang di tengah, tetapi tidak diberi ukuran. Masalah utamanya adalah ...",
        "options": {
          "A": "Pekerja tidak mempunyai pensil.",
          "B": "Bentuk benda terlalu sederhana.",
          "C": "Informasi untuk membuat benda belum lengkap.",
          "D": "Benda tidak dapat digambar."
        },
        "correct": "C",
        "points": 5
      },
      {
        "id": "q3",
        "type": "mcq",
        "prompt": "3. Informasi yang paling diperlukan untuk membuat sebuah komponen adalah ...",
        "options": {
          "A": "Warna kertas gambar.",
          "B": "Nama pembuat gambar.",
          "C": "Bentuk dan ukuran benda.",
          "D": "Merek pensil."
        },
        "correct": "C",
        "points": 5
      },
      {
        "id": "q4",
        "type": "mcq",
        "prompt": "4. Alat yang paling tepat untuk membantu membuat garis lurus adalah ...",
        "options": {
          "A": "Jangka.",
          "B": "Penggaris.",
          "C": "Penghapus.",
          "D": "Busur."
        },
        "correct": "B",
        "points": 5
      },
      {
        "id": "q5",
        "type": "mcq",
        "prompt": "5. Alat yang digunakan untuk membuat lingkaran atau busur adalah ...",
        "options": {
          "A": "Penggaris segitiga.",
          "B": "Pensil warna.",
          "C": "Jangka.",
          "D": "Penghapus."
        },
        "correct": "C",
        "points": 5
      },
      {
        "id": "q6",
        "type": "essay",
        "prompt": "Apakah hasil kelima siswa akan sama? Jelaskan alasanmu.",
        "options": {},
        "correct": "",
        "points": 0
      },
      {
        "id": "q7",
        "type": "essay",
        "prompt": "7. Informasi apa saja yang harus ditambahkan agar benda tersebut dapat dibuat dengan benar? Tuliskan minimal 4 informasi teknis.",
        "options": {},
        "correct": "",
        "points": 0
      },
      {
        "id": "q8_impact",
        "type": "essay",
        "prompt": "Menurutmu, apa akibatnya jika informasi pada gambar tidak terbaca dengan jelas?",
        "options": {},
        "correct": "",
        "points": 0
      },
      {
        "id": "q9_critical",
        "type": "essay",
        "prompt": "9. Menurut pendapatmu, apakah gambar teknik hanya gambar yang dibuat dengan rapi, atau merupakan bahasa untuk berkomunikasi dalam pekerjaan teknik? Jelaskan dengan bahasamu sendiri.",
        "options": {},
        "correct": "",
        "points": 0
      }
    ]
  },
  "posttest": {
    "id": "posttest",
    "title": "Tes Pemahaman",
    "essayMax": 40,
    "questions": [
      {
        "id": "1",
        "type": "mcq",
        "prompt": "Gambar teknik manual adalah ....",
        "options": {
          "A": "gambar bebas untuk memperindah benda",
          "B": "cara menyampaikan bentuk, ukuran, dan informasi benda menggunakan alat gambar",
          "C": "gambar yang hanya digunakan oleh pelukis",
          "D": "gambar yang dibuat tanpa tujuan yang jelas"
        },
        "correct": "B",
        "points": 3
      },
      {
        "id": "2",
        "type": "mcq",
        "prompt": "Tujuan utama gambar teknik adalah ....",
        "options": {
          "A": "membuat gambar terlihat menarik",
          "B": "membuat kertas terlihat penuh",
          "C": "menyampaikan informasi benda agar dapat dipahami orang lain",
          "D": "menunjukkan kemampuan menggambar seseorang"
        },
        "correct": "C",
        "points": 3
      },
      {
        "id": "3",
        "type": "mcq",
        "prompt": "Dalam gambar teknik, hal yang lebih penting daripada sekadar gambar terlihat indah adalah ....",
        "options": {
          "A": "warna",
          "B": "ketelitian dan keterbacaan",
          "C": "hiasan",
          "D": "ukuran kertas yang besar"
        },
        "correct": "B",
        "points": 3
      },
      {
        "id": "4",
        "type": "mcq",
        "prompt": "Gambar teknik disebut sebagai bahasa komunikasi teknik karena ....",
        "options": {
          "A": "hanya digunakan di sekolah",
          "B": "dapat menyampaikan informasi tentang benda kepada orang lain",
          "C": "menggunakan banyak tulisan",
          "D": "selalu dibuat dengan komputer"
        },
        "correct": "B",
        "points": 3
      },
      {
        "id": "5",
        "type": "mcq",
        "prompt": "Salah satu fungsi gambar teknik dalam pekerjaan teknik adalah ....",
        "options": {
          "A": "menjadi acuan ketika benda akan dibuat",
          "B": "menghias ruang bengkel",
          "C": "menggantikan semua alat ukur",
          "D": "mempercepat mesin tanpa operator"
        },
        "correct": "A",
        "points": 3
      },
      {
        "id": "6",
        "type": "mcq",
        "prompt": "Salah membaca ukuran pada gambar teknik dapat menyebabkan ....",
        "options": {
          "A": "benda dibuat dengan ukuran yang salah",
          "B": "gambar menjadi lebih bagus",
          "C": "pekerjaan menjadi lebih mudah",
          "D": "mesin menjadi lebih cepat"
        },
        "correct": "A",
        "points": 3
      },
      {
        "id": "7",
        "type": "mcq",
        "prompt": "Salah satu manfaat mempelajari gambar teknik bagi siswa Teknik Pemesinan adalah ....",
        "options": {
          "A": "terbiasa membaca informasi benda kerja dengan tepat",
          "B": "tidak perlu melakukan praktik bengkel",
          "C": "tidak perlu menggunakan alat ukur",
          "D": "dapat bekerja tanpa gambar"
        },
        "correct": "A",
        "points": 3
      },
      {
        "id": "8",
        "type": "mcq",
        "prompt": "Sikap yang perlu dilatih dalam pembelajaran gambar teknik adalah ....",
        "options": {
          "A": "cepat, bebas, dan santai",
          "B": "teliti, rapi, disiplin, dan bertanggung jawab",
          "C": "berani, keras, dan terburu-buru",
          "D": "diam dan tidak bertanya"
        },
        "correct": "B",
        "points": 3
      },
      {
        "id": "9",
        "type": "mcq",
        "prompt": "Ketika hasil gambar belum sesuai, sikap yang sebaiknya dilakukan adalah ....",
        "options": {
          "A": "langsung dibuang",
          "B": "menyalin pekerjaan teman",
          "C": "diperiksa dan diperbaiki",
          "D": "dibiarkan saja"
        },
        "correct": "C",
        "points": 3
      },
      {
        "id": "10",
        "type": "mcq",
        "prompt": "Dalam proses dari ide menjadi benda, gambar berfungsi sebagai ....",
        "options": {
          "A": "penghias pekerjaan",
          "B": "penghubung antara ide dan pekerjaan nyata",
          "C": "pengganti material",
          "D": "pengganti mesin"
        },
        "correct": "B",
        "points": 3
      },
      {
        "id": "11",
        "type": "mcq",
        "prompt": "Sebelum mulai menggambar, siswa sebaiknya ....",
        "options": {
          "A": "langsung menggunakan alat",
          "B": "mengikuti instruksi terlebih dahulu",
          "C": "meminjam semua alat teman",
          "D": "melipat kertas gambar"
        },
        "correct": "B",
        "points": 3
      },
      {
        "id": "12",
        "type": "mcq",
        "prompt": "Kertas gambar sebaiknya dijaga agar ....",
        "options": {
          "A": "selalu dilipat",
          "B": "bersih, rata, dan tidak kusut",
          "C": "diberi banyak coretan",
          "D": "mudah digulung"
        },
        "correct": "B",
        "points": 3
      },
      {
        "id": "13",
        "type": "mcq",
        "prompt": "Fungsi busur derajat adalah ....",
        "options": {
          "A": "menyimpan pensil",
          "B": "mengukur atau membentuk sudut",
          "C": "menghapus garis",
          "D": "membuat lingkaran"
        },
        "correct": "B",
        "points": 3
      },
      {
        "id": "14",
        "type": "mcq",
        "prompt": "Pensil dengan kode H memiliki karakteristik ....",
        "options": {
          "A": "lebih lunak dan menghasilkan goresan lebih gelap",
          "B": "lebih keras dan menghasilkan goresan cenderung lebih ringan",
          "C": "digunakan khusus untuk mewarnai",
          "D": "hanya digunakan untuk menulis"
        },
        "correct": "B",
        "points": 3
      },
      {
        "id": "15",
        "type": "mcq",
        "prompt": "Pensil 2B memiliki karakteristik ....",
        "options": {
          "A": "lebih lunak dan menghasilkan goresan lebih gelap",
          "B": "lebih keras dan menghasilkan goresan sangat tipis",
          "C": "sama persis dengan pensil H",
          "D": "tidak dapat digunakan untuk menggambar"
        },
        "correct": "A",
        "points": 3
      },
      {
        "id": "16",
        "type": "mcq",
        "prompt": "Alat yang digunakan untuk membuat lingkaran atau busur adalah ....",
        "options": {
          "A": "penghapus",
          "B": "jangka",
          "C": "kuas",
          "D": "penggaris lurus"
        },
        "correct": "B",
        "points": 3
      },
      {
        "id": "17",
        "type": "mcq",
        "prompt": "Divider digunakan untuk ....",
        "options": {
          "A": "menghapus garis",
          "B": "memindahkan atau membandingkan jarak",
          "C": "membuat tulisan",
          "D": "menempelkan kertas"
        },
        "correct": "B",
        "points": 3
      },
      {
        "id": "18",
        "type": "mcq",
        "prompt": "Sepasang penggaris segitiga yang umum digunakan adalah ....",
        "options": {
          "A": "20° dan 40°",
          "B": "45° dan 30°/60°",
          "C": "10° dan 20°",
          "D": "15° dan 75°"
        },
        "correct": "B",
        "points": 3
      },
      {
        "id": "19",
        "type": "mcq",
        "prompt": "Busur derajat digunakan untuk ....",
        "options": {
          "A": "membuat atau membaca arah sudut",
          "B": "membuat lingkaran besar",
          "C": "menghapus garis",
          "D": "memotong kertas"
        },
        "correct": "A",
        "points": 3
      },
      {
        "id": "20",
        "type": "mcq",
        "prompt": "Untuk pertemuan gambar teknik berikutnya, alat dan bahan minimal yang perlu disiapkan adalah ....",
        "options": {
          "A": "kertas gambar, pensil H dan 2B, penghapus, penggaris lurus, sepasang segitiga, jangka, dan rautan",
          "B": "cat air, kuas lukis, dan palet warna",
          "C": "laptop, printer, dan speaker",
          "D": "spidol warna, gunting, dan lem"
        },
        "correct": "A",
        "points": 3
      },
      {
        "id": "21",
        "type": "essay",
        "prompt": "Jelaskan dengan bahasamu sendiri apa yang dimaksud dengan gambar teknik manual.",
        "points": 0
      },
      {
        "id": "22",
        "type": "essay",
        "prompt": "Mengapa gambar teknik disebut sebagai bahasa komunikasi dalam bidang teknik?",
        "points": 0
      },
      {
        "id": "23",
        "type": "essay",
        "prompt": "Sebutkan minimal 4 fungsi gambar teknik dalam pekerjaan teknik.",
        "points": 0
      },
      {
        "id": "24",
        "type": "essay",
        "prompt": "Mengapa siswa Teknik Pemesinan perlu mempelajari gambar teknik?",
        "points": 0
      },
      {
        "id": "25",
        "type": "essay",
        "prompt": "Sebutkan 5 kebiasaan atau sikap kerja yang perlu dilatih dalam pembelajaran gambar teknik.",
        "points": 0
      },
      {
        "id": "26",
        "type": "essay",
        "prompt": "Jelaskan secara singkat alur dari sebuah ide sampai menjadi benda nyata.",
        "points": 0
      },
      {
        "id": "27",
        "type": "essay",
        "prompt": "Mengapa kebersihan tangan, meja, alat, dan kertas perlu dijaga ketika melakukan pekerjaan gambar teknik?",
        "points": 0
      },
      {
        "id": "28",
        "type": "essay",
        "prompt": "Jelaskan perbedaan karakteristik pensil H dan pensil 2B.",
        "points": 0
      },
      {
        "id": "29",
        "type": "essay",
        "prompt": "Sebutkan minimal 6 alat gambar teknik manual beserta fungsinya.",
        "points": 0
      },
      {
        "id": "30",
        "type": "essay",
        "prompt": "Tuliskan alat dan bahan minimal yang perlu kalian siapkan untuk pertemuan gambar teknik berikutnya.",
        "points": 0
      },
      {
        "id": "31",
        "type": "essay",
        "prompt": "Jelaskan fungsi etiket pada gambar teknik dan mengapa etiket biasanya ditempatkan di sudut kanan bawah lembar gambar.",
        "points": 0
      },
      {
        "id": "32",
        "type": "essay",
        "prompt": "Sebutkan minimal 5 informasi yang biasanya dicantumkan di dalam etiket gambar teknik.",
        "points": 0
      },
      {
        "id": "33",
        "type": "essay",
        "prompt": "Pada etiket terdapat kolom skala. Jelaskan arti skala 1 : 1, 1 : 2, dan 2 : 1.",
        "points": 0
      },
      {
        "id": "34",
        "type": "essay",
        "prompt": "Tuliskan ukuran kertas A0, A1, A2, A3, dan A4 dalam satuan milimeter (mm).",
        "points": 0
      },
      {
        "id": "35",
        "type": "essay",
        "prompt": "Jelaskan hubungan ukuran kertas seri A dari A0 sampai A4. Jika satu lembar A3 dibagi dua pada sisi terpanjang, akan menjadi ukuran kertas apa?",
        "points": 0
      }
    ]
  },
  "uts": {
    "id": "uts",
    "title": "Tes Tengah Semester",
    "durationMinutes": 60,
    "essayMax": 40,
    "questions": [
      {
        "id": "u01",
        "type": "mcq",
        "prompt": "Pada gambar, garis A dipakai untuk menunjukkan bagian benda yang terlihat. Jenis garis A adalah …",
        "points": 3,
        "options": {
          "0": "Kontinu tebal",
          "1": "Kontinu tipis",
          "2": "Gores tipis",
          "3": "Gores-titik tipis"
        },
        "correct": "0"
      },
      {
        "id": "u02",
        "type": "mcq",
        "prompt": "Garis C pada gambar paling tepat digunakan untuk …",
        "points": 3,
        "options": {
          "0": "Batas benda yang terlihat",
          "1": "Rusuk yang tersembunyi",
          "2": "Garis ukuran",
          "3": "Arsiran bidang potong"
        },
        "correct": "1"
      },
      {
        "id": "u03",
        "type": "mcq",
        "prompt": "Jarak antara dua garis berdekatan adalah 3,5 mm. Jarak dari garis pertama sampai garis kelima adalah …",
        "points": 3,
        "options": {
          "0": "10,5 mm",
          "1": "17,5 mm",
          "2": "14 mm",
          "3": "7 mm"
        },
        "correct": "2"
      },
      {
        "id": "u04",
        "type": "mcq",
        "prompt": "Untuk memeriksa jarak 7 mm antargaris miring sejajar, pengukuran harus dilakukan …",
        "points": 3,
        "options": {
          "0": "Sepanjang tepi kotak",
          "1": "Sepanjang garis miring",
          "2": "Menurut arah mendatar selalu",
          "3": "Tegak lurus terhadap kedua garis"
        },
        "correct": "3"
      },
      {
        "id": "u05",
        "type": "mcq",
        "prompt": "Segi enam beraturan pada gambar berada di dalam lingkaran berjari-jari 30 mm. Panjang satu sisinya adalah …",
        "points": 3,
        "options": {
          "0": "15 mm",
          "1": "30 mm",
          "2": "60 mm",
          "3": "90 mm"
        },
        "correct": "1"
      },
      {
        "id": "u06",
        "type": "mcq",
        "prompt": "Besar sudut pusat antara dua titik sudut berurutan pada segi enam ini adalah …",
        "points": 3,
        "options": {
          "0": "60°",
          "1": "30°",
          "2": "90°",
          "3": "120°"
        },
        "correct": "0"
      },
      {
        "id": "u07",
        "type": "mcq",
        "prompt": "Sudut pusat sebuah segi lima beraturan adalah …",
        "points": 3,
        "options": {
          "0": "60°",
          "1": "90°",
          "2": "120°",
          "3": "72°"
        },
        "correct": "3"
      },
      {
        "id": "u08",
        "type": "mcq",
        "prompt": "Hubungan yang benar untuk kelima titik sudut pada gambar adalah …",
        "points": 3,
        "options": {
          "0": "Seluruh titik berada pada satu garis lurus",
          "1": "Hanya satu titik berada pada lingkaran",
          "2": "Seluruh titik berada pada lingkaran",
          "3": "Semua sisi menyinggung lingkaran dari luar"
        },
        "correct": "2"
      },
      {
        "id": "u09",
        "type": "mcq",
        "prompt": "Segi tujuh beraturan memiliki sudut pusat sebesar 360° ÷ 7. Nilai pendekatannya adalah …",
        "points": 3,
        "options": {
          "0": "45,00°",
          "1": "51,43°",
          "2": "60,00°",
          "3": "72,00°"
        },
        "correct": "1"
      },
      {
        "id": "u10",
        "type": "mcq",
        "prompt": "Pada latihan pembagian sudut ini, sudut 90° dibagi menjadi tiga bagian sama. Besar tiap bagian adalah …",
        "points": 3,
        "options": {
          "0": "30°",
          "1": "45°",
          "2": "60°",
          "3": "15°"
        },
        "correct": "0"
      },
      {
        "id": "u11",
        "type": "mcq",
        "prompt": "Dua belas titik dibagi merata mengelilingi satu lingkaran. Selisih sudut pusat antartitik berurutan adalah …",
        "points": 3,
        "options": {
          "0": "15°",
          "1": "45°",
          "2": "60°",
          "3": "30°"
        },
        "correct": "3"
      },
      {
        "id": "u12",
        "type": "mcq",
        "prompt": "Cara memeriksa bahwa konstruksi segi-n beraturan tertutup dengan baik adalah …",
        "points": 3,
        "options": {
          "0": "Mengubah sisi terakhir agar lebih pendek",
          "1": "Mengabaikan sambungan terakhir",
          "2": "Memeriksa kesamaan sisi dan pertemuan titik akhir dengan titik awal",
          "3": "Menebalkan semua garis bantu"
        },
        "correct": "2"
      },
      {
        "id": "u13",
        "type": "mcq",
        "prompt": "Pada Job Silinder, diameter 40 mm. Dengan π = 3,14 dan tanpa tambahan sambungan, panjang bentangan selimutnya adalah …",
        "points": 3,
        "options": {
          "0": "62,8 mm",
          "1": "125,6 mm",
          "2": "251,2 mm",
          "3": "40 mm"
        },
        "correct": "1"
      },
      {
        "id": "u14",
        "type": "mcq",
        "prompt": "Tinggi silinder pada gambar adalah 45 mm. Tinggi persegi panjang bentangannya adalah …",
        "points": 3,
        "options": {
          "0": "45 mm",
          "1": "40 mm",
          "2": "85 mm",
          "3": "125,6 mm"
        },
        "correct": "0"
      },
      {
        "id": "u15",
        "type": "mcq",
        "prompt": "Lingkaran dibagi menjadi 12 bagian sama. Setiap bagian menempati sudut pusat …",
        "points": 3,
        "options": {
          "0": "12°",
          "1": "15°",
          "2": "45°",
          "3": "30°"
        },
        "correct": "3"
      },
      {
        "id": "u16",
        "type": "mcq",
        "prompt": "Garis pembagi vertikal pada bentangan berfungsi untuk …",
        "points": 3,
        "options": {
          "0": "Mengubah diameter silinder",
          "1": "Menambah tebal bahan",
          "2": "Menandai posisi generator keliling yang bersesuaian",
          "3": "Menunjukkan 12 silinder terpisah"
        },
        "correct": "2"
      },
      {
        "id": "u17",
        "type": "mcq",
        "prompt": "Selimut kerucut tegak jika dibentangkan berbentuk …",
        "points": 3,
        "options": {
          "0": "Persegi panjang",
          "1": "Juring lingkaran",
          "2": "Lingkaran penuh selalu",
          "3": "Segitiga siku-siku"
        },
        "correct": "1"
      },
      {
        "id": "u18",
        "type": "mcq",
        "prompt": "Jari-jari juring bentangan kerucut sama dengan …",
        "points": 3,
        "options": {
          "0": "Garis pelukis kerucut",
          "1": "Tinggi tegak kerucut",
          "2": "Diameter alas kerucut",
          "3": "Jari-jari alas saja"
        },
        "correct": "0"
      },
      {
        "id": "u19",
        "type": "mcq",
        "prompt": "Dengan jari-jari alas 30 mm dan tinggi 70 mm, garis pelukis s dihitung memakai …",
        "points": 3,
        "options": {
          "0": "70 − 30",
          "1": "70 + 30",
          "2": "70 × 30",
          "3": "√(70² + 30²)"
        },
        "correct": "3"
      },
      {
        "id": "u20",
        "type": "mcq",
        "prompt": "Untuk kerucut dengan r = 30 mm dan s ≈ 76,16 mm, sudut juring θ = 360° × r/s bernilai sekitar …",
        "points": 3,
        "options": {
          "0": "30,0°",
          "1": "76,2°",
          "2": "141,8°",
          "3": "283,6°"
        },
        "correct": "2"
      },
      {
        "id": "u21",
        "type": "essay",
        "prompt": "Jelaskan fungsi garis A, B, C, dan D pada gambar. Berikan satu contoh penggunaan masing-masing dalam gambar teknik.",
        "points": 8
      },
      {
        "id": "u22",
        "type": "essay",
        "prompt": "Tuliskan urutan membuat segi enam beraturan di dalam lingkaran R30 dengan mistar dan jangka. Jelaskan cara memeriksa sisi serta penutupan poligonnya.",
        "points": 8
      },
      {
        "id": "u23",
        "type": "essay",
        "prompt": "Rencanakan bentangan selimut silinder Ø40 × 45 mm tanpa sambungan. Gunakan π = 3,14. Hitung panjang dan tinggi bentangan, lalu jelaskan penandaan 12 generator yang bersesuaian.",
        "points": 8
      },
      {
        "id": "u24",
        "type": "essay",
        "prompt": "Diketahui kerucut r = 30 mm, tinggi 70 mm. Hitung garis pelukis dan sudut juring sampai satu desimal. Jelaskan mengapa panjang busur juring harus sama dengan keliling alas.",
        "points": 8
      },
      {
        "id": "u25",
        "type": "essay",
        "prompt": "Seorang siswa mendapatkan tiga bagian sudut yang tidak sama dan poligon yang tidak menutup. Uraikan dua kemungkinan penyebab, cara memeriksa ukurannya, serta langkah koreksinya sebelum garis benda ditebalkan.",
        "points": 8
      }
    ]
  },
  "uas": {
    "id": "uas",
    "title": "Tes Akhir Semester",
    "durationMinutes": 90,
    "essayMax": 40,
    "questions": [
      {
        "id": "a01",
        "type": "mcq",
        "prompt": "Untuk pipa Ø40 mm, panjang garis bentangan satu keliling tanpa sambungan adalah … (π = 3,1416)",
        "points": 3,
        "options": {
          "0": "62,83 mm",
          "1": "80,00 mm",
          "2": "125,66 mm",
          "3": "251,33 mm"
        },
        "correct": "2"
      },
      {
        "id": "a02",
        "type": "mcq",
        "prompt": "Garis bentangan sepanjang 125,66 mm dibagi menjadi 12 bagian sama. Jarak antargenerator mendekati …",
        "points": 3,
        "options": {
          "0": "5,24 mm",
          "1": "10,47 mm",
          "2": "12,57 mm",
          "3": "30,00 mm"
        },
        "correct": "1"
      },
      {
        "id": "a03",
        "type": "mcq",
        "prompt": "Ketinggian titik-titik pada tepi miring harus dipindahkan ke bentangan melalui …",
        "points": 3,
        "options": {
          "0": "Generator dengan nomor yang bersesuaian",
          "1": "Titik yang dipilih secara acak",
          "2": "Satu garis tinggi yang sama untuk semua titik",
          "3": "Pengukuran diameter saja"
        },
        "correct": "0"
      },
      {
        "id": "a04",
        "type": "mcq",
        "prompt": "Tepi atas pada bentangan pipa yang dipotong miring menjadi kurva karena …",
        "points": 3,
        "options": {
          "0": "Keliling pipa berubah-ubah",
          "1": "Bahan selalu bertambah tebal",
          "2": "Semua generator memiliki tinggi yang sama",
          "3": "Tinggi generator berbeda sesuai perpotongan dengan bidang miring"
        },
        "correct": "3"
      },
      {
        "id": "a05",
        "type": "mcq",
        "prompt": "Posisi awal dan akhir bentangan menunjukkan generator yang sama. Supaya sambungan bertemu, tinggi kedua ujung itu harus …",
        "points": 3,
        "options": {
          "0": "Selalu nol",
          "1": "Berbeda sebesar diameter",
          "2": "Sama",
          "3": "Berbeda sebesar keliling"
        },
        "correct": "2"
      },
      {
        "id": "a06",
        "type": "mcq",
        "prompt": "Bidang potong di tampak depan terlihat sebagai garis lurus. Ketika dipindahkan ke selimut yang dibuka, bentuk tepinya …",
        "points": 3,
        "options": {
          "0": "Harus menjadi garis lurus mendatar",
          "1": "Dibangun dari titik perpotongan pada tiap generator",
          "2": "Tidak perlu mengikuti tampak depan",
          "3": "Selalu menjadi lingkaran penuh"
        },
        "correct": "1"
      },
      {
        "id": "a07",
        "type": "mcq",
        "prompt": "Sumbu X dan Y pada sketsa isometri dibuat membentuk sudut … terhadap arah mendatar.",
        "points": 3,
        "options": {
          "0": "30°",
          "1": "45°",
          "2": "60°",
          "3": "90°"
        },
        "correct": "0"
      },
      {
        "id": "a08",
        "type": "mcq",
        "prompt": "Pada sketsa, arah sumbu Z adalah …",
        "points": 3,
        "options": {
          "0": "Mendatar ke kiri",
          "1": "Miring 30° ke bawah",
          "2": "Miring 45° ke kanan",
          "3": "Tegak"
        },
        "correct": "3"
      },
      {
        "id": "a09",
        "type": "mcq",
        "prompt": "Garis pada benda yang sejajar sumbu X harus digambar …",
        "points": 3,
        "options": {
          "0": "Selalu mendatar di kertas",
          "1": "Selalu sejajar sumbu Z",
          "2": "Sejajar arah X pada sketsa",
          "3": "Dengan sudut yang bebas dipilih"
        },
        "correct": "2"
      },
      {
        "id": "a10",
        "type": "mcq",
        "prompt": "Lingkaran pada bidang mendatar benda akan tampak sebagai … dalam gambar isometri.",
        "points": 3,
        "options": {
          "0": "Segitiga",
          "1": "Elips",
          "2": "Persegi",
          "3": "Garis lurus"
        },
        "correct": "1"
      },
      {
        "id": "a11",
        "type": "mcq",
        "prompt": "Menurut ukuran acuan Job Dudukan Silinder, diameter boss adalah …",
        "points": 3,
        "options": {
          "0": "40 mm",
          "1": "16 mm",
          "2": "20 mm",
          "3": "60 mm"
        },
        "correct": "0"
      },
      {
        "id": "a12",
        "type": "mcq",
        "prompt": "Lubang Ø16 tembus pada boss berarti …",
        "points": 3,
        "options": {
          "0": "Lubang berjari-jari 16 mm yang buntu",
          "1": "Lubang berdiameter 40 mm",
          "2": "Lubang dengan kedalaman 16 mm pasti",
          "3": "Lubang berdiameter 16 mm yang menembus bagian tersebut"
        },
        "correct": "3"
      },
      {
        "id": "a13",
        "type": "mcq",
        "prompt": "Boss Ø40 memiliki lubang sepusat Ø16. Tebal radial dinding di antara keduanya adalah …",
        "points": 3,
        "options": {
          "0": "8 mm",
          "1": "24 mm",
          "2": "12 mm",
          "3": "28 mm"
        },
        "correct": "2"
      },
      {
        "id": "a14",
        "type": "mcq",
        "prompt": "Ukuran acuan 100 × 60 × 80 mm menyatakan …",
        "points": 3,
        "options": {
          "0": "Diameter dari tiga lubang",
          "1": "Panjang, lebar, dan tinggi keseluruhan",
          "2": "Tiga ketebalan yang sama",
          "3": "Ukuran kertas gambar"
        },
        "correct": "1"
      },
      {
        "id": "a15",
        "type": "mcq",
        "prompt": "Urutan yang paling terkontrol untuk menggambar dudukan adalah …",
        "points": 3,
        "options": {
          "0": "Kotak batas dan sumbu → alas dan tiang → boss/lubang → takik dan pengaku → penegasan",
          "1": "Detail lubang → menghapus sumbu → menentukan ukuran luar terakhir",
          "2": "Menebalkan semua garis lebih dulu",
          "3": "Menggambar detail tanpa kotak batas atau ukuran"
        },
        "correct": "0"
      },
      {
        "id": "a16",
        "type": "mcq",
        "prompt": "Pada bentangan kerucut, panjang busur juring selimut harus sama dengan …",
        "points": 3,
        "options": {
          "0": "Tinggi tegak kerucut",
          "1": "Garis pelukis",
          "2": "Dua kali tinggi kerucut",
          "3": "Keliling alas kerucut"
        },
        "correct": "3"
      },
      {
        "id": "a17",
        "type": "mcq",
        "prompt": "Pada segi enam yang mengelilingi lingkaran, tiap sisi segi enam …",
        "points": 3,
        "options": {
          "0": "Menjadi diameter lingkaran",
          "1": "Melewati pusat lingkaran",
          "2": "Menyinggung lingkaran",
          "3": "Berhimpit dengan busur lingkaran"
        },
        "correct": "2"
      },
      {
        "id": "a18",
        "type": "mcq",
        "prompt": "Pemeriksaan yang paling tepat untuk pembagian lingkaran menjadi 12 bagian adalah …",
        "points": 3,
        "options": {
          "0": "Mengukur hanya satu sisi tanpa menutup pembagian",
          "1": "Memastikan total sudut 360° dan tiap interval 30°",
          "2": "Mengubah titik terakhir agar terlihat rapi saja",
          "3": "Menghapus semua titik bantu sebelum pemeriksaan"
        },
        "correct": "1"
      },
      {
        "id": "a19",
        "type": "mcq",
        "prompt": "Agar gambar akhir terbaca, hubungan garis bantu terhadap garis benda yang terlihat sebaiknya …",
        "points": 3,
        "options": {
          "0": "Garis bantu lebih tipis dari garis benda",
          "1": "Garis bantu selalu lebih tebal",
          "2": "Semua garis dibuat setebal mungkin",
          "3": "Garis benda dibuat putus-putus seluruhnya"
        },
        "correct": "0"
      },
      {
        "id": "a20",
        "type": "mcq",
        "prompt": "Pada soal ini gambar dibuat berskala 1:2. Jika panjang sebenarnya 100 mm, panjangnya pada kertas adalah …",
        "points": 3,
        "options": {
          "0": "200 mm",
          "1": "100 mm",
          "2": "25 mm",
          "3": "50 mm"
        },
        "correct": "3"
      },
      {
        "id": "a21",
        "type": "essay",
        "prompt": "Uraikan langkah membuat bentangan pipa Ø40 dengan potongan miring dan 12 generator. Gunakan π = 3,1416 untuk menghitung panjang bentangan dan jarak pembaginya, lalu jelaskan pemindahan tinggi serta pemeriksaan sambungan.",
        "points": 8
      },
      {
        "id": "a22",
        "type": "essay",
        "prompt": "Pada sketsa pemeriksaan, generator pertama dan terakhir seharusnya mewakili titik yang sama, tetapi tinggi ujungnya berbeda. Jelaskan mengapa pola ini bermasalah dan berikan urutan pemeriksaan nomor generator, tinggi titik, serta koreksi kurva.",
        "points": 8
      },
      {
        "id": "a23",
        "type": "essay",
        "prompt": "Jelaskan cara membangun gambar isometri dengan sumbu X/Y 30° dan Z tegak. Uraikan penggunaan kotak batas, pemindahan ukuran menurut sumbu, penambahan detail, dan pemeriksaan garis sejajar.",
        "points": 8
      },
      {
        "id": "a24",
        "type": "essay",
        "prompt": "Buat rencana menggambar Job Dudukan Silinder dari ukuran 100 × 60 × 80 mm, alas 20 mm, boss Ø40 tinggi 20 mm, dan lubang Ø16 tembus. Jelaskan urutan konstruksi, penggambaran elips sepusat, serta pemeriksaan takik dan pengaku.",
        "points": 8
      },
      {
        "id": "a25",
        "type": "essay",
        "prompt": "Bandingkan prinsip bentangan selimut silinder, selimut kerucut, dan penyajian isometri. Jelaskan bentuk hasilnya, ukuran pengendali, serta satu pemeriksaan geometris untuk masing-masing.",
        "points": 8
      }
    ]
  }
};
const ARCUS_HEADERS = ['ID Percobaan','ID Siswa','Nama','Kelas','No Absen','ID Tes','Tes','Status','Mulai WIB','Pembaruan WIB','Submit WIB','Terjawab','Jumlah Soal','Nilai PG','PG Maks','Uraian Terisi','Uraian Maks','Catatan Keluar','Alasan Submit','Revisi','Awal Jawaban','Metadata'];

function onOpen() { SpreadsheetApp.getUi().createMenu('ARCUS').addItem('Siapkan tabel rekap','setupArcus').addItem('Atur akun guru','showTeacherSetup').addToUi(); }
function setupArcusDanGuru() { setupArcus(); showTeacherSetup(); }
function arcusOwner_() {
  const active = Session.getActiveUser().getEmail(), owner = SpreadsheetApp.openById(ARCUS_SPREADSHEET_ID).getOwner().getEmail();
  if (!active || active !== owner || !SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.getActiveSpreadsheet().getId() !== ARCUS_SPREADSHEET_ID) throw new Error('Buka dari editor Apps Script/spreadsheet dengan akun pemilik.');
}
function setupArcus() {
  arcusOwner_();
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('ARCUS_PEPPER')) props.setProperty('ARCUS_PEPPER', Utilities.getUuid() + Utilities.getUuid());
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const book = SpreadsheetApp.openById(ARCUS_SPREADSHEET_ID); book.setSpreadsheetTimeZone('Asia/Jakarta');
    arcusSheet_('ARCUS_Siswa',['ID Siswa','Nama','Kelas','No Absen','Masuk Terakhir WIB']);
    arcusSheet_('ARCUS_Tes',ARCUS_HEADERS);
    arcusSheet_('ARCUS_Jawaban',['ID Percobaan','ID Siswa','ID Tes','Nomor','ID Soal','Jenis','Pertanyaan','Jawaban','Kode Jawaban','Pembaruan WIB']);
    props.setProperty('ARCUS_READY','1');
  } finally { lock.releaseLock(); }
  onOpen();
}
function arcusSheet_(name, headers) {
  const book = SpreadsheetApp.openById(ARCUS_SPREADSHEET_ID);
  let sheet = book.getSheetByName(name);
  if (!sheet) sheet = book.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1,1,1,headers.length).setValues([headers]).setBackground('#173f57').setFontColor('#ffffff').setFontWeight('bold');
    sheet.setFrozenRows(1); sheet.getRange(1,1,sheet.getMaxRows(),headers.length).setVerticalAlignment('top');
    sheet.setColumnWidths(1,headers.length,150);
  } else {
    const old = sheet.getRange(1,1,1,headers.length).getValues()[0];
    if (headers.some((value,index) => value !== old[index])) throw new Error('Header tabel '+name+' berbeda. Data lama dipertahankan; hubungi pengembang.');
  }
  return sheet;
}
function arcusRows_(sheet,last) { if (last > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(),Math.max(500,last-sheet.getMaxRows())); }
function showTeacherSetup() {
  arcusOwner_();
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutputFromFile('TeacherSetup').setWidth(440).setHeight(520), 'Atur akun guru ARCUS');
}
function teacherSetupChallenge() { arcusOwner_(); return { salt: Utilities.getUuid().replace(/-/g,''), iterations: ARCUS_ITERATIONS }; }
function configureTeacher(input) {
  arcusOwner_(); arcusReady_();
  const name = arcusText_(input.name,100), salt = String(input.salt || ''), proof = String(input.proof || '');
  if (name.length < 3 || !/^[\w-]{16,100}$/.test(salt) || !/^[a-f0-9]{64}$/.test(proof)) throw new Error('Data akun guru tidak sesuai.');
  PropertiesService.getScriptProperties().setProperties({ ARCUS_TEACHER_NAME: name, ARCUS_TEACHER_SALT: salt, ARCUS_TEACHER_HASH: arcusHmac_(proof), ARCUS_TEACHER_VERSION: Utilities.getUuid() });
  return 'Akun guru tersimpan. Password tidak ditulis ke spreadsheet.';
}
function doGet() { return arcusOutput_({ ok: true, spreadsheetId: ARCUS_SPREADSHEET_ID, data: { service: 'ARCUS', ready: PropertiesService.getScriptProperties().getProperty('ARCUS_READY') === '1' } }); }
function doPost(event) {
  try {
    const raw = event && event.postData && event.postData.contents;
    if (!raw || raw.length > 500000) arcusFail_('Permintaan terlalu besar atau kosong.','INVALID');
    const request = JSON.parse(raw);
    const data = arcusDispatch_(request.action,request.payload || {},request.token || '');
    return arcusOutput_({ ok: true, spreadsheetId: ARCUS_SPREADSHEET_ID, data: data });
  } catch (error) { return arcusOutput_({ ok: false, spreadsheetId: ARCUS_SPREADSHEET_ID, error: error.arcusCode ? error.message : 'Layanan belum dapat memproses permintaan. Periksa setup dan log Apps Script.', code: error.arcusCode || 'SERVER_ERROR' }); }
}
function arcusOutput_(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
function arcusFail_(message,code) { const error = new Error(message); error.arcusCode = code; throw error; }
function arcusReady_() { if (PropertiesService.getScriptProperties().getProperty('ARCUS_READY') !== '1') arcusFail_('Jalankan setupArcus terlebih dahulu.','NOT_READY'); }
function arcusText_(value,max) { return String(value || '').trim().replace(/\s+/g,' ').slice(0,max); }
function arcusDigest_(value) { return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,value,Utilities.Charset.UTF_8).map(function(byte) { return ('0'+((byte+256)%256).toString(16)).slice(-2); }).join(''); }
function arcusHmac_(value) { return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(value,PropertiesService.getScriptProperties().getProperty('ARCUS_PEPPER'))); }
function arcusEqual_(a,b) { let difference = a.length ^ b.length; for (let i=0;i<Math.max(a.length,b.length);i++) difference |= (a.charCodeAt(i)||0) ^ (b.charCodeAt(i)||0); return difference === 0; }
function arcusCell_(value) { const text = String(value == null ? '' : value); return /^[\s]*[=+@-]/.test(text) ? "'"+text : text; }
function arcusUncell_(value) { const text=String(value == null ? '' : value); return /^'[\s]*[=+@-]/.test(text) ? text.slice(1) : text; }
function arcusSession_(token, role) {
  if (!/^[\w-]{60,100}$/.test(token)) arcusFail_('Sesi berakhir. Silakan masuk kembali.','AUTH_REQUIRED');
  const raw = CacheService.getScriptCache().get('session:'+arcusDigest_(token));
  if (!raw) arcusFail_('Sesi berakhir. Silakan masuk kembali.','AUTH_REQUIRED');
  const session = JSON.parse(raw);
  if (session.expiresAt <= Date.now() || (session.role === 'teacher' && session.version !== PropertiesService.getScriptProperties().getProperty('ARCUS_TEACHER_VERSION'))) arcusFail_('Sesi berakhir. Silakan masuk kembali.','AUTH_REQUIRED');
  if (role && session.role !== role) arcusFail_('Akses hanya untuk '+(role === 'teacher' ? 'guru.' : 'siswa.'),'FORBIDDEN');
  return session;
}
function arcusIssue_(role,profile) {
  const token = Utilities.getUuid()+Utilities.getUuid(), seconds = role === 'teacher' ? 7200 : 21600;
  const session = { token: token, role: role, profile: profile, expiresAt: Date.now()+seconds*1000, version: PropertiesService.getScriptProperties().getProperty('ARCUS_TEACHER_VERSION') || '' };
  CacheService.getScriptCache().put('session:'+arcusDigest_(token),JSON.stringify(session),seconds); return session;
}
function arcusDispatch_(action,payload,token) {
  if (action === 'health') return { ready: PropertiesService.getScriptProperties().getProperty('ARCUS_READY') === '1' };
  arcusReady_();
  if (action === 'studentLogin') return arcusStudentLogin_(payload);
  if (action === 'teacherChallenge') {
    const props = PropertiesService.getScriptProperties();
    if (!props.getProperty('ARCUS_TEACHER_HASH')) arcusFail_('Pemilik belum membuat akun guru dari menu ARCUS pada spreadsheet.','NOT_READY');
    return { salt: props.getProperty('ARCUS_TEACHER_SALT'), iterations: ARCUS_ITERATIONS };
  }
  if (action === 'teacherLogin') return arcusTeacherLogin_(payload);
  const session = arcusSession_(token);
  if (action === 'session') return session;
  if (action === 'logout') { CacheService.getScriptCache().remove('session:'+arcusDigest_(token)); return { loggedOut: true }; }
  if (action === 'saveAttempt') { arcusSession_(token,'student'); return arcusSave_(payload.attempt,session); }
  if (action === 'ownAttempts') { arcusSession_(token,'student'); return arcusRecords_(session.profile.id).map(function(record) { return arcusAttempt_(record); }); }
  if (action === 'listAttempts') { arcusSession_(token,'teacher'); return arcusRecords_().map(arcusSummary_); }
  if (action === 'attemptDetail') {
    arcusSession_(token,'teacher');
    const record = arcusRecords_().filter(function(row) { return row[0] === payload.id; })[0];
    if (!record) arcusFail_('Percobaan tidak ditemukan.','NOT_FOUND');
    return { summary: arcusSummary_(record), questions: arcusAnswerRows_(record).map(function(row) { return { number: row[3], key: row[4], type: row[5], prompt: arcusUncell_(row[6]), answerText: arcusUncell_(row[7]) }; }) };
  }
  arcusFail_('Aksi tidak tersedia.','INVALID');
}
function arcusStudentLogin_(input) {
  const name = arcusText_(input.name,101), className = arcusText_(input.className,61), absen = String(input.absen || '').trim();
  if (name.length < 3 || name.length > 100 || !className || className.length > 60 || !/^\d{1,2}$/.test(absen) || +absen < 1) arcusFail_('Nama, kelas, atau nomor absen tidak sesuai.','INVALID');
  const profile = { id: arcusDigest_([name.toLowerCase(),className.toLowerCase(),String(+absen)].join('\n')), name: name, className: className, absen: String(+absen) };
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const sheet = SpreadsheetApp.openById(ARCUS_SPREADSHEET_ID).getSheetByName('ARCUS_Siswa');
    const row = arcusFindRow_(sheet,profile.id), values = [[profile.id,arcusCell_(name),arcusCell_(className),+absen,new Date()]];
    arcusRows_(sheet,row || sheet.getLastRow()+1);
    sheet.getRange(row || sheet.getLastRow()+1,1,1,5).setValues(values); sheet.getRange(row || sheet.getLastRow(),5).setNumberFormat('dd/MM/yyyy HH:mm:ss');
  } finally { lock.releaseLock(); }
  return arcusIssue_('student',profile);
}
function arcusTeacherLogin_(input) {
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const props = PropertiesService.getScriptProperties(), cache = CacheService.getScriptCache();
    const failed = JSON.parse(cache.get('teacher-failures') || '{"count":0,"since":0}');
    if (failed.count >= 5 && Date.now()-failed.since < 900000) arcusFail_('Terlalu banyak percobaan. Coba lagi setelah 15 menit.','RATE_LIMIT');
    const expected = props.getProperty('ARCUS_TEACHER_HASH') || '', actual = /^[a-f0-9]{64}$/.test(input.proof || '') ? arcusHmac_(input.proof) : '';
    if (!expected || !arcusEqual_(expected,actual) || arcusText_(input.name,100).toLowerCase() !== (props.getProperty('ARCUS_TEACHER_NAME') || '').toLowerCase()) {
      const sameWindow = Date.now()-failed.since < 900000; cache.put('teacher-failures',JSON.stringify({ count: sameWindow ? failed.count+1 : 1, since: sameWindow ? failed.since : Date.now() }),900);
      arcusFail_('Nama atau password guru salah.','INVALID_CREDENTIALS');
    }
    cache.remove('teacher-failures'); return arcusIssue_('teacher',{ id: 'teacher', name: props.getProperty('ARCUS_TEACHER_NAME') });
  } finally { lock.releaseLock(); }
}
function arcusFindRow_(sheet,id) {
  if (sheet.getLastRow() < 2) return 0;
  const cell = sheet.getRange(2,1,sheet.getLastRow()-1,1).createTextFinder(id).matchEntireCell(true).useRegularExpression(false).findNext();
  return cell ? cell.getRow() : 0;
}
function arcusRecords_(studentId) {
  const sheet = SpreadsheetApp.openById(ARCUS_SPREADSHEET_ID).getSheetByName('ARCUS_Tes');
  if (sheet.getLastRow() < 2) return [];
  const rows = sheet.getRange(2,1,sheet.getLastRow()-1,ARCUS_HEADERS.length).getValues().filter(function(row) { return row[0] && (!studentId || row[1] === studentId); });
  const expired = rows.filter(function(row) { const meta=JSON.parse(row[21] || '{}'); return row[7] !== 'Sudah disubmit' && meta.deadline && Date.now() >= meta.deadline; });
  if (expired.length) {
    const lock=LockService.getScriptLock(); lock.waitLock(20000);
    try {
      expired.forEach(function(row) {
        const index=arcusFindRow_(sheet,row[0]), fresh=sheet.getRange(index,1,1,ARCUS_HEADERS.length).getValues()[0], meta=JSON.parse(fresh[21] || '{}');
        if (fresh[7] !== 'Sudah disubmit' && meta.deadline && Date.now() >= meta.deadline) {
          fresh[7]='Sudah disubmit'; fresh[9]=new Date(); fresh[10]=new Date(meta.deadline); fresh[18]='Waktu ujian habis saat halaman ditinggalkan.';
          sheet.getRange(index,1,1,ARCUS_HEADERS.length).setValues([fresh]);
        }
        for(let col=0;col<fresh.length;col++) row[col]=fresh[col];
      });
      SpreadsheetApp.flush();
    } finally { lock.releaseLock(); }
  }
  return rows.sort(function(a,b) { return new Date(b[9])-new Date(a[9]); });
}
function arcusSummary_(row) {
  return { id: row[0], profile: { id: row[1], name: arcusUncell_(row[2]), className: arcusUncell_(row[3]), absen: String(row[4]) }, examId: row[5], status: row[7] === 'Sudah disubmit' ? 'submitted' : 'active', startedAt: +new Date(row[8]), updatedAt: +new Date(row[9]), submittedAt: row[10] ? +new Date(row[10]) : null, answered: row[11], total: row[12], mcqScore: row[13], mcqMax: row[14], essayAnswered: row[15], revision: row[19], submissionReason: arcusUncell_(row[18]) };
}
function arcusAnswerRows_(row) { return SpreadsheetApp.openById(ARCUS_SPREADSHEET_ID).getSheetByName('ARCUS_Jawaban').getRange(row[20],1,row[12],10).getValues(); }
function arcusAttempt_(row) {
  const summary = arcusSummary_(row), answers = {}, examId = row[5];
  arcusAnswerRows_(row).forEach(function(answer) {
    const code = arcusUncell_(answer[8]);
    if (examId === 'diagnostik' && answer[4] === 'q6') { const value = JSON.parse(code || '{}'); answers.q6_choice = value.choice || null; answers.q6_reason = value.reason || ''; }
    else if (examId === 'diagnostik' && answer[4] === 'q7') answers.q7_info = JSON.parse(code || '[]');
    else if (examId === 'posttest') { const type = answer[5] === 'mcq' ? 'mcq' : 'essay'; answers[type] = answers[type] || {}; if(code) answers[type][answer[4]] = code; }
    else if (code) answers[answer[4]] = code;
  });
  return Object.assign(summary,JSON.parse(row[21] || '{}'),{ answers: answers, participant: { name: summary.profile.name, className: summary.profile.className, absen: summary.profile.absen }, version: 1 });
}
function arcusNormalize_(definition,input) {
  input = input || {};
  return definition.questions.map(function(question,index) {
    let value = definition.id === 'posttest' ? (input[question.type] || {})[question.id] : input[question.id];
    if (definition.id === 'diagnostik' && question.id === 'q6') value = { choice: input.q6_choice || '', reason: String(input.q6_reason || '').slice(0,10000) };
    if (definition.id === 'diagnostik' && question.id === 'q7') value = (Array.isArray(input.q7_info) ? input.q7_info : []).slice(0,4).map(function(text) { return String(text).slice(0,2000); });
    let code = typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value == null ? '' : value).slice(0,10000), answerText = code;
    if (question.type === 'mcq') {
      if (code && !Object.prototype.hasOwnProperty.call(question.options,code)) arcusFail_('Pilihan jawaban tidak sesuai.','INVALID');
      answerText = question.options[code] || '';
    } else if (question.id === 'q6' && definition.id === 'diagnostik') answerText = value.choice + (value.reason ? '\n'+value.reason : '');
    else if (question.id === 'q7' && definition.id === 'diagnostik') answerText = value.filter(Boolean).join('\n');
    const answered = Boolean(answerText.trim());
    return { number: index+1, key: question.id, type: question.type, prompt: question.prompt, code: code, answerText: answerText, answered: answered, points: question.type === 'mcq' && code === question.correct ? question.points : 0 };
  });
}
function arcusSave_(attempt,session) {
  if (!attempt || !/^[\w-]{8,120}$/.test(attempt.id || '') || !Number.isSafeInteger(attempt.revision) || attempt.revision < 1 || !['active','submitted'].includes(attempt.status) || !Object.prototype.hasOwnProperty.call(ARCUS_EXAMS,attempt.examId)) arcusFail_('Data percobaan tidak sesuai.','INVALID');
  const definition = ARCUS_EXAMS[attempt.examId], now = Date.now();
  let answers = arcusNormalize_(definition,attempt.answers);
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const book = SpreadsheetApp.openById(ARCUS_SPREADSHEET_ID), sheet = book.getSheetByName('ARCUS_Tes'), answerSheet = book.getSheetByName('ARCUS_Jawaban');
    let rowNumber = arcusFindRow_(sheet,attempt.id), old = rowNumber ? sheet.getRange(rowNumber,1,1,ARCUS_HEADERS.length).getValues()[0] : null;
    if (old && (old[1] !== session.profile.id || old[5] !== attempt.examId)) arcusFail_('Percobaan ini milik peserta lain.','FORBIDDEN');
    if (old && old[7] === 'Sudah disubmit') return { id: attempt.id, revision: attempt.revision, closed: true, attempt: arcusAttempt_(old) };
    if (old && attempt.revision <= old[19]) return { id: attempt.id, revision: attempt.revision, stale: true, currentRevision: old[19] };
    const previousMeta = old ? JSON.parse(old[21] || '{}') : {};
    // Wall clock and scores are owned by the server. Client scores/identity are ignored.
    const startedAt = old ? +new Date(old[8]) : now;
    const deadline = definition.durationMinutes ? startedAt+definition.durationMinutes*60000 : null;
    const expired = deadline && now >= deadline, submitted = attempt.status === 'submitted' || expired;
    if (expired && old) answers = arcusNormalize_(definition,arcusAttempt_(old).answers);
    const reason = expired ? 'Waktu ujian habis.' : arcusText_(attempt.submissionReason || (submitted ? 'Dikumpulkan oleh peserta.' : ''),200);
    const violations = Array.isArray(attempt.violations) ? attempt.violations.slice(0,50).map(function(entry) { return { at: Number.isFinite(entry.at) ? entry.at : now, reason: arcusText_(entry.reason,250) }; }) : [];
    const meta = { deadline: deadline, optionOrder: attempt.optionOrder || previousMeta.optionOrder || {}, flags: Array.isArray(attempt.flags) ? attempt.flags.slice(0,35) : [], paused: Boolean(attempt.paused), violations: violations };
    if (JSON.stringify(meta).length > 25000) arcusFail_('Metadata percobaan terlalu besar.','INVALID');
    const orphan = old ? 0 : arcusFindRow_(answerSheet,attempt.id);
    if (orphan) {
      const owner = answerSheet.getRange(orphan,1,1,3).getValues()[0];
      if (owner[1] !== session.profile.id || owner[2] !== attempt.examId) arcusFail_('Percobaan ini milik peserta lain.','FORBIDDEN');
    }
    const start = old ? old[20] : orphan || Math.max(2,answerSheet.getLastRow()+1);
    arcusRows_(answerSheet,start+answers.length-1);
    answerSheet.getRange(start,1,answers.length,10).setValues(answers.map(function(answer) { return [attempt.id,session.profile.id,attempt.examId,answer.number,answer.key,answer.type,arcusCell_(answer.prompt),arcusCell_(answer.answerText),arcusCell_(answer.code),new Date(now)]; }));
    answerSheet.getRange(start,10,answers.length,1).setNumberFormat('dd/MM/yyyy HH:mm:ss');
    const mcqScore = answers.reduce(function(sum,answer) { return sum+answer.points; },0), mcqMax = definition.questions.reduce(function(sum,q) { return sum+(q.type === 'mcq' ? q.points : 0); },0);
    const values = [attempt.id,session.profile.id,arcusCell_(session.profile.name),arcusCell_(session.profile.className),+session.profile.absen,attempt.examId,definition.title,submitted ? 'Sudah disubmit' : 'Sedang dikerjakan',new Date(startedAt),new Date(now),submitted ? new Date(now) : '',answers.filter(function(a) { return a.answered; }).length,answers.length,mcqScore,mcqMax,answers.filter(function(a) { return a.type === 'essay' && a.answered; }).length,definition.essayMax,violations.length,arcusCell_(reason),attempt.revision,start,JSON.stringify(meta)];
    rowNumber = rowNumber || sheet.getLastRow()+1;
    arcusRows_(sheet,rowNumber);
    sheet.getRange(rowNumber,1,1,values.length).setValues([values]); sheet.getRange(rowNumber,9,1,3).setNumberFormat('dd/MM/yyyy HH:mm:ss');
    SpreadsheetApp.flush();
    return { id: attempt.id, revision: attempt.revision, closed: Boolean(submitted), attempt: submitted ? arcusAttempt_(values) : null, startedAt: startedAt, deadline: deadline };
  } finally { lock.releaseLock(); }
}
