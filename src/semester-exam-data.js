// Figures use the original worksheet topics; any simplified dimensions are stated on the figure.
const mcq = (id, job, figure, prompt, options) => ({ id, type: 'mcq', job, figure, prompt, options: options.map((text, index) => ({ id: String(index), text })), points: 3 });
const essay = (id, job, figure, prompt) => ({ id, type: 'essay', job, figure, prompt, points: 8 });

export const SEMESTER_EXAMS = {
  uts: {
    id: 'uts', version: 1, title: 'Tes Tengah Semester', shortTitle: 'Tengah Semester', badge: 'PTS', durationMinutes: 60,
    description: 'Garis, konstruksi geometri, serta bentangan silinder dan kerucut.',
    questions: [
      mcq('u01', 'Garis dalam gambar', 'line-types', 'Pada gambar, garis A dipakai untuk menunjukkan bagian benda yang terlihat. Jenis garis A adalah …', ['Kontinu tebal', 'Kontinu tipis', 'Gores tipis', 'Gores-titik tipis']),
      mcq('u02', 'Garis dalam gambar', 'line-types', 'Garis C pada gambar paling tepat digunakan untuk …', ['Batas benda yang terlihat', 'Rusuk yang tersembunyi', 'Garis ukuran', 'Arsiran bidang potong']),
      mcq('u03', 'Garis dalam gambar', 'parallel', 'Jarak antara dua garis berdekatan adalah 3,5 mm. Jarak dari garis pertama sampai garis kelima adalah …', ['10,5 mm', '17,5 mm', '14 mm', '7 mm']),
      mcq('u04', 'Garis dalam gambar', 'diagonal', 'Untuk memeriksa jarak 7 mm antargaris miring sejajar, pengukuran harus dilakukan …', ['Sepanjang tepi kotak', 'Sepanjang garis miring', 'Menurut arah mendatar selalu', 'Tegak lurus terhadap kedua garis']),
      mcq('u05', 'Konstruksi geometri 01', 'hexagon', 'Segi enam beraturan pada gambar berada di dalam lingkaran berjari-jari 30 mm. Panjang satu sisinya adalah …', ['15 mm', '30 mm', '60 mm', '90 mm']),
      mcq('u06', 'Konstruksi geometri 01', 'hexagon', 'Besar sudut pusat antara dua titik sudut berurutan pada segi enam ini adalah …', ['60°', '30°', '90°', '120°']),
      mcq('u07', 'Konstruksi geometri 01', 'pentagon', 'Sudut pusat sebuah segi lima beraturan adalah …', ['60°', '90°', '120°', '72°']),
      mcq('u08', 'Konstruksi geometri 01', 'pentagon', 'Hubungan yang benar untuk kelima titik sudut pada gambar adalah …', ['Seluruh titik berada pada satu garis lurus', 'Hanya satu titik berada pada lingkaran', 'Seluruh titik berada pada lingkaran', 'Semua sisi menyinggung lingkaran dari luar']),
      mcq('u09', 'Konstruksi geometri 02', 'heptagon', 'Segi tujuh beraturan memiliki sudut pusat sebesar 360° ÷ 7. Nilai pendekatannya adalah …', ['45,00°', '51,43°', '60,00°', '72,00°']),
      mcq('u10', 'Konstruksi geometri 02', 'angle-thirds', 'Pada latihan pembagian sudut ini, sudut 90° dibagi menjadi tiga bagian sama. Besar tiap bagian adalah …', ['30°', '45°', '60°', '15°']),
      mcq('u11', 'Konstruksi geometri 03', 'regular-12', 'Dua belas titik dibagi merata mengelilingi satu lingkaran. Selisih sudut pusat antartitik berurutan adalah …', ['15°', '45°', '60°', '30°']),
      mcq('u12', 'Konstruksi geometri 03', 'regular-12', 'Cara memeriksa bahwa konstruksi segi-n beraturan tertutup dengan baik adalah …', ['Mengubah sisi terakhir agar lebih pendek', 'Mengabaikan sambungan terakhir', 'Memeriksa kesamaan sisi dan pertemuan titik akhir dengan titik awal', 'Menebalkan semua garis bantu']),
      mcq('u13', 'Bentangan 01 · Silinder', 'cylinder', 'Pada Job Silinder, diameter 40 mm. Dengan π = 3,14 dan tanpa tambahan sambungan, panjang bentangan selimutnya adalah …', ['62,8 mm', '125,6 mm', '251,2 mm', '40 mm']),
      mcq('u14', 'Bentangan 01 · Silinder', 'cylinder', 'Tinggi silinder pada gambar adalah 45 mm. Tinggi persegi panjang bentangannya adalah …', ['45 mm', '40 mm', '85 mm', '125,6 mm']),
      mcq('u15', 'Bentangan 01 · Silinder', 'cylinder-divisions', 'Lingkaran dibagi menjadi 12 bagian sama. Setiap bagian menempati sudut pusat …', ['12°', '15°', '45°', '30°']),
      mcq('u16', 'Bentangan 01 · Silinder', 'cylinder-divisions', 'Garis pembagi vertikal pada bentangan berfungsi untuk …', ['Mengubah diameter silinder', 'Menambah tebal bahan', 'Menandai posisi generator keliling yang bersesuaian', 'Menunjukkan 12 silinder terpisah']),
      mcq('u17', 'Bentangan kerucut', 'cone', 'Selimut kerucut tegak jika dibentangkan berbentuk …', ['Persegi panjang', 'Juring lingkaran', 'Lingkaran penuh selalu', 'Segitiga siku-siku']),
      mcq('u18', 'Bentangan kerucut', 'cone', 'Jari-jari juring bentangan kerucut sama dengan …', ['Garis pelukis kerucut', 'Tinggi tegak kerucut', 'Diameter alas kerucut', 'Jari-jari alas saja']),
      mcq('u19', 'Bentangan kerucut', 'cone', 'Dengan jari-jari alas 30 mm dan tinggi 70 mm, garis pelukis s dihitung memakai …', ['70 − 30', '70 + 30', '70 × 30', '√(70² + 30²)']),
      mcq('u20', 'Bentangan kerucut', 'cone-sector', 'Untuk kerucut dengan r = 30 mm dan s ≈ 76,16 mm, sudut juring θ = 360° × r/s bernilai sekitar …', ['30,0°', '76,2°', '141,8°', '283,6°']),
      essay('u21', 'Garis dalam gambar', 'line-types', 'Jelaskan fungsi garis A, B, C, dan D pada gambar. Berikan satu contoh penggunaan masing-masing dalam gambar teknik.'),
      essay('u22', 'Konstruksi geometri 01', 'hexagon', 'Tuliskan urutan membuat segi enam beraturan di dalam lingkaran R30 dengan mistar dan jangka. Jelaskan cara memeriksa sisi serta penutupan poligonnya.'),
      essay('u23', 'Bentangan 01 · Silinder', 'cylinder', 'Rencanakan bentangan selimut silinder Ø40 × 45 mm tanpa sambungan. Gunakan π = 3,14. Hitung panjang dan tinggi bentangan, lalu jelaskan penandaan 12 generator yang bersesuaian.'),
      essay('u24', 'Bentangan kerucut', 'cone-sector', 'Diketahui kerucut r = 30 mm, tinggi 70 mm. Hitung garis pelukis dan sudut juring sampai satu desimal. Jelaskan mengapa panjang busur juring harus sama dengan keliling alas.'),
      essay('u25', 'Konstruksi geometri 02–03', 'angle-thirds', 'Seorang siswa mendapatkan tiga bagian sudut yang tidak sama dan poligon yang tidak menutup. Uraikan dua kemungkinan penyebab, cara memeriksa ukurannya, serta langkah koreksinya sebelum garis benda ditebalkan.')
    ]
  },
  uas: {
    id: 'uas', version: 1, title: 'Tes Akhir Semester', shortTitle: 'Akhir Semester', badge: 'PAS', durationMinutes: 90,
    description: 'Pipa miring, bukaan, isometri, dudukan silinder, dan penerapan konstruksi geometri.',
    questions: [
      mcq('a01', 'Bentangan pipa miring', 'pipe-development', 'Untuk pipa Ø40 mm, panjang garis bentangan satu keliling tanpa sambungan adalah … (π = 3,1416)', ['62,83 mm', '80,00 mm', '125,66 mm', '251,33 mm']),
      mcq('a02', 'Bentangan pipa miring', 'pipe-development', 'Garis bentangan sepanjang 125,66 mm dibagi menjadi 12 bagian sama. Jarak antargenerator mendekati …', ['5,24 mm', '10,47 mm', '12,57 mm', '30,00 mm']),
      mcq('a03', 'Bentangan pipa miring', 'pipe-generators', 'Ketinggian titik-titik pada tepi miring harus dipindahkan ke bentangan melalui …', ['Generator dengan nomor yang bersesuaian', 'Titik yang dipilih secara acak', 'Satu garis tinggi yang sama untuk semua titik', 'Pengukuran diameter saja']),
      mcq('a04', 'Bentangan pipa miring', 'pipe-development', 'Tepi atas pada bentangan pipa yang dipotong miring menjadi kurva karena …', ['Keliling pipa berubah-ubah', 'Bahan selalu bertambah tebal', 'Semua generator memiliki tinggi yang sama', 'Tinggi generator berbeda sesuai perpotongan dengan bidang miring']),
      mcq('a05', 'Bukaan pipa miring', 'pipe-development', 'Posisi awal dan akhir bentangan menunjukkan generator yang sama. Supaya sambungan bertemu, tinggi kedua ujung itu harus …', ['Selalu nol', 'Berbeda sebesar diameter', 'Sama', 'Berbeda sebesar keliling']),
      mcq('a06', 'Bukaan pipa miring', 'pipe-generators', 'Bidang potong di tampak depan terlihat sebagai garis lurus. Ketika dipindahkan ke selimut yang dibuka, bentuk tepinya …', ['Harus menjadi garis lurus mendatar', 'Dibangun dari titik perpotongan pada tiap generator', 'Tidak perlu mengikuti tampak depan', 'Selalu menjadi lingkaran penuh']),
      mcq('a07', 'Isometri dengan garis bantu', 'iso-axes', 'Sumbu X dan Y pada sketsa isometri dibuat membentuk sudut … terhadap arah mendatar.', ['30°', '45°', '60°', '90°']),
      mcq('a08', 'Isometri dengan garis bantu', 'iso-axes', 'Pada sketsa, arah sumbu Z adalah …', ['Mendatar ke kiri', 'Miring 30° ke bawah', 'Miring 45° ke kanan', 'Tegak']),
      mcq('a09', 'Isometri dengan garis bantu', 'iso-box', 'Garis pada benda yang sejajar sumbu X harus digambar …', ['Selalu mendatar di kertas', 'Selalu sejajar sumbu Z', 'Sejajar arah X pada sketsa', 'Dengan sudut yang bebas dipilih']),
      mcq('a10', 'Isometri dudukan silinder', 'iso-circle', 'Lingkaran pada bidang mendatar benda akan tampak sebagai … dalam gambar isometri.', ['Segitiga', 'Elips', 'Persegi', 'Garis lurus']),
      mcq('a11', 'Isometri dudukan silinder', 'support-source', 'Menurut ukuran acuan Job Dudukan Silinder, diameter boss adalah …', ['40 mm', '16 mm', '20 mm', '60 mm']),
      mcq('a12', 'Isometri dudukan silinder', 'support-source', 'Lubang Ø16 tembus pada boss berarti …', ['Lubang berjari-jari 16 mm yang buntu', 'Lubang berdiameter 40 mm', 'Lubang dengan kedalaman 16 mm pasti', 'Lubang berdiameter 16 mm yang menembus bagian tersebut']),
      mcq('a13', 'Isometri dudukan silinder', 'boss-section', 'Boss Ø40 memiliki lubang sepusat Ø16. Tebal radial dinding di antara keduanya adalah …', ['8 mm', '24 mm', '12 mm', '28 mm']),
      mcq('a14', 'Isometri dudukan silinder', 'support-source', 'Ukuran acuan 100 × 60 × 80 mm menyatakan …', ['Diameter dari tiga lubang', 'Panjang, lebar, dan tinggi keseluruhan', 'Tiga ketebalan yang sama', 'Ukuran kertas gambar']),
      mcq('a15', 'Isometri dudukan silinder', 'support-source', 'Urutan yang paling terkontrol untuk menggambar dudukan adalah …', ['Kotak batas dan sumbu → alas dan tiang → boss/lubang → takik dan pengaku → penegasan', 'Detail lubang → menghapus sumbu → menentukan ukuran luar terakhir', 'Menebalkan semua garis lebih dulu', 'Menggambar detail tanpa kotak batas atau ukuran']),
      mcq('a16', 'Bentangan kerucut', 'cone-sector', 'Pada bentangan kerucut, panjang busur juring selimut harus sama dengan …', ['Tinggi tegak kerucut', 'Garis pelukis', 'Dua kali tinggi kerucut', 'Keliling alas kerucut']),
      mcq('a17', 'Konstruksi geometri 01', 'hexagon-tangent', 'Pada segi enam yang mengelilingi lingkaran, tiap sisi segi enam …', ['Menjadi diameter lingkaran', 'Melewati pusat lingkaran', 'Menyinggung lingkaran', 'Berhimpit dengan busur lingkaran']),
      mcq('a18', 'Konstruksi geometri 03', 'regular-12', 'Pemeriksaan yang paling tepat untuk pembagian lingkaran menjadi 12 bagian adalah …', ['Mengukur hanya satu sisi tanpa menutup pembagian', 'Memastikan total sudut 360° dan tiap interval 30°', 'Mengubah titik terakhir agar terlihat rapi saja', 'Menghapus semua titik bantu sebelum pemeriksaan']),
      mcq('a19', 'Garis dalam gambar · Isometri', 'line-types', 'Agar gambar akhir terbaca, hubungan garis bantu terhadap garis benda yang terlihat sebaiknya …', ['Garis bantu lebih tipis dari garis benda', 'Garis bantu selalu lebih tebal', 'Semua garis dibuat setebal mungkin', 'Garis benda dibuat putus-putus seluruhnya']),
      mcq('a20', 'Isometri dudukan silinder', 'scale', 'Pada soal ini gambar dibuat berskala 1:2. Jika panjang sebenarnya 100 mm, panjangnya pada kertas adalah …', ['200 mm', '100 mm', '25 mm', '50 mm']),
      essay('a21', 'Bentangan pipa miring', 'pipe-development', 'Uraikan langkah membuat bentangan pipa Ø40 dengan potongan miring dan 12 generator. Gunakan π = 3,1416 untuk menghitung panjang bentangan dan jarak pembaginya, lalu jelaskan pemindahan tinggi serta pemeriksaan sambungan.'),
      essay('a22', 'Bukaan pipa miring', 'pipe-error', 'Pada sketsa pemeriksaan, generator pertama dan terakhir seharusnya mewakili titik yang sama, tetapi tinggi ujungnya berbeda. Jelaskan mengapa pola ini bermasalah dan berikan urutan pemeriksaan nomor generator, tinggi titik, serta koreksi kurva.'),
      essay('a23', 'Isometri dengan garis bantu', 'iso-box', 'Jelaskan cara membangun gambar isometri dengan sumbu X/Y 30° dan Z tegak. Uraikan penggunaan kotak batas, pemindahan ukuran menurut sumbu, penambahan detail, dan pemeriksaan garis sejajar.'),
      essay('a24', 'Isometri dudukan silinder', 'support-source', 'Buat rencana menggambar Job Dudukan Silinder dari ukuran 100 × 60 × 80 mm, alas 20 mm, boss Ø40 tinggi 20 mm, dan lubang Ø16 tembus. Jelaskan urutan konstruksi, penggambaran elips sepusat, serta pemeriksaan takik dan pengaku.'),
      essay('a25', 'Bentangan silinder · Kerucut · Isometri', 'compare', 'Bandingkan prinsip bentangan selimut silinder, selimut kerucut, dan penyajian isometri. Jelaskan bentuk hasilnya, ukuran pengendali, serta satu pemeriksaan geometris untuk masing-masing.')
    ]
  }
};

export const getSemesterExam = id => SEMESTER_EXAMS[id];
