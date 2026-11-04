import { HabitDefinition, HabitId } from '../types';

export const TUJUH_KEBIASAAN: HabitDefinition[] = [
  {
    id: 'bangun_pagi_ibadah',
    number: 1,
    title: 'Bangun Pagi & Beribadah',
    shortTitle: 'Bangun & Beribadah',
    description: 'Memulai hari dengan bangun pagi tepat waktu, bersyukur, dan menunaikan ibadah sesuai keyakinan masing-masing.',
    guidelines: [
      'Bangun sebelum subuh atau fajar merekah (sekitar pukul 04.30 - 05.00 WIB)',
      'Merapikan tempat tidur secara mandiri',
      'Melaksanakan ibadah/doa pagi dengan khusyuk',
      'Mengawali hari dengan pikiran positif dan senyuman'
    ],
    icon: 'SunMedium',
    color: 'from-amber-500 to-orange-500',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    bgLight: 'bg-amber-50/70',
    borderColor: 'border-amber-200',
    suggestedTimes: '04.30 - 05.30 WIB',
    motivationalQuote: 'Awal pagi yang penuh syukur akan memancarkan energi kebaikan sepanjang hari.'
  },
  {
    id: 'berolahraga',
    number: 2,
    title: 'Berolahraga',
    shortTitle: 'Berolahraga',
    description: 'Menjaga kebugaran dan kesehatan tubuh dengan beraktivitas fisik minimal 15-30 menit setiap hari.',
    guidelines: [
      'Senam pagi, jalan cepat, lari santai, atau bersepeda',
      'Latihan peregangan tubuh sebelum beraktivitas',
      'Bermain olahraga bersama teman/keluarga (sepak bola, bulu tangkis, lompat tali)',
      'Minum air putih secukupnya sebelum dan sesudah berolahraga'
    ],
    icon: 'Activity',
    color: 'from-emerald-500 to-teal-600',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    bgLight: 'bg-emerald-50/70',
    borderColor: 'border-emerald-200',
    suggestedTimes: '06.00 - 06.30 atau 16.00 - 17.00 WIB',
    motivationalQuote: 'Di dalam tubuh yang sehat terdapat jiwa yang kuat dan semangat belajar yang tinggi.'
  },
  {
    id: 'makan_sehat',
    number: 3,
    title: 'Makan Makanan Sehat',
    shortTitle: 'Makan Sehat',
    description: 'Membiasakan konsumsi makanan bergizi seimbang (Isi Piringku), buah, sayur, dan air putih serta menghindari jajan sembarangan.',
    guidelines: [
      'Sarapan pagi sebelum berangkat sekolah',
      'Membawa bekal sehat dari rumah berisi sayur dan lauk bernutrisi',
      'Makan buah segar setiap hari',
      'Mengurangi makanan manis berlebih, berpengawet, atau pewarna buatan',
      'Mencuci tangan dengan sabun sebelum dan sesudah makan'
    ],
    icon: 'Apple',
    color: 'from-red-500 to-rose-600',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    bgLight: 'bg-rose-50/70',
    borderColor: 'border-rose-200',
    suggestedTimes: 'Sarapan (06.15), Makan Siang (12.30), Makan Malam (18.30)',
    motivationalQuote: 'Makanan sehat adalah bahan bakar terbaik untuk kecerdasan otak dan daya tahan tubuh.'
  },
  {
    id: 'gemar_membaca',
    number: 4,
    title: 'Gemar Membaca',
    shortTitle: 'Gemar Membaca',
    description: 'Menumbuhkan budaya literasi dengan membaca buku ilmu pengetahuan, cerita inspiratif, atau ensiklopedia setiap hari.',
    guidelines: [
      'Membaca minimal 15-20 menit setiap hari (program pojok baca / buku cerita)',
      'Mencatat kosakata baru atau hal penting yang dipelajari',
      'Merangkum pesan moral dari cerita yang dibaca',
      'Menjaga dan merawat buku bacaan dengan baik'
    ],
    icon: 'BookOpen',
    color: 'from-blue-500 to-indigo-600',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    bgLight: 'bg-blue-50/70',
    borderColor: 'border-blue-200',
    suggestedTimes: '15.30 - 16.00 atau 19.30 - 20.00 WIB',
    motivationalQuote: 'Buku adalah jendela dunia. Semakin banyak membaca, semakin luas cakrawala masa depanmu.'
  },
  {
    id: 'bermasyarakat',
    number: 5,
    title: 'Bermasyarakat (Aksi Kebaikan)',
    shortTitle: 'Aksi Kebaikan',
    description: 'Menerapkan empati, kepedulian sosial, tolong-menolong, dan menjaga kerukunan di lingkungan keluarga, sekolah, dan tetangga.',
    guidelines: [
      'Membantu pekerjaan rumah tangga orang tua (menyapu, mencuci piring)',
      'Membantu teman atau tetangga yang membutuhkan',
      'Menyapa dengan 5S: Senyum, Salam, Sapa, Sopan, Santun',
      'Membuang sampah pada tempatnya dan menjaga fasilitas umum'
    ],
    icon: 'HeartHandshake',
    color: 'from-purple-500 to-violet-600',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    bgLight: 'bg-purple-50/70',
    borderColor: 'border-purple-200',
    suggestedTimes: 'Sepanjang hari saat berinteraksi',
    motivationalQuote: 'Satu kebaikan kecil yang kamu lakukan hari ini akan membawa kebahagiaan bagi banyak orang.'
  },
  {
    id: 'istirahat_tepat',
    number: 6,
    title: 'Istirahat Tepat Waktu',
    shortTitle: 'Istirahat Tepat',
    description: 'Tidur malam tepat waktu dengan durasi cukup (8-9 jam untuk anak) agar tubuh kembali segar di keesokan hari.',
    guidelines: [
      'Tidur malam maksimal pukul 21.00 WIB (tidak begadang)',
      'Mematikan gawai/gadget 30 menit sebelum tidur',
      'Mencuci kaki, menggosok gigi, dan berdoa sebelum tidur',
      'Menghindari makan berat mendekati waktu tidur'
    ],
    icon: 'Moon',
    color: 'from-indigo-600 to-slate-800',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    bgLight: 'bg-indigo-50/70',
    borderColor: 'border-indigo-200',
    suggestedTimes: '20.30 - 21.00 WIB',
    motivationalQuote: 'Istirahat yang cukup adalah kunci kesegaran fisik dan konsentrasi belajar yang prima.'
  },
  {
    id: 'kedisiplinan_umum',
    number: 7,
    title: 'Kedisiplinan Umum',
    shortTitle: 'Kedisiplinan',
    description: 'Disiplin mengelola waktu, mengerjakan tugas sekolah tepat waktu, berpakaian rapi, dan bertanggung jawab terhadap perlengkapan diri.',
    guidelines: [
      'Menyiapkan seragam dan buku pelajaran malam hari sebelum tidur',
      'Hadir di sekolah tepat waktu sebelum bel berbunyi',
      'Menyelesaikan tugas sekolah/PR tanpa menunda-nunda',
      'Menjaga kerapian barang dan mematuhi tata tertib sekolah'
    ],
    icon: 'CheckCircle2',
    color: 'from-cyan-600 to-blue-700',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    bgLight: 'bg-cyan-50/70',
    borderColor: 'border-cyan-200',
    suggestedTimes: 'Sepanjang hari',
    motivationalQuote: 'Disiplin adalah jembatan emas antara cita-cita mulia dan kenyataan kesuksesan.'
  }
];

export const DRIVE_FOLDER_STRUCTURE = [
  { name: '7-KEBIASAAN-ANAK-INDONESIA-HEBAT', isRoot: true, desc: 'Folder Utama Aplikasi di Google Drive Sekolah' },
  { name: 'DATA-PENGGUNA', path: '7-KEBIASAAN-ANAK-INDONESIA-HEBAT/DATA-PENGGUNA', desc: 'Penyimpanan cadangan metadata akun, profil pengguna, dan kredensial aman' },
  { name: 'DATA-SISWA', path: '7-KEBIASAAN-ANAK-INDONESIA-HEBAT/DATA-SISWA', desc: 'Data biodata siswa, kelas, relasi guru binaan, dan nomor kontak orang tua' },
  { name: 'JURNAL-HARIAN', path: '7-KEBIASAAN-ANAK-INDONESIA-HEBAT/JURNAL-HARIAN', desc: 'Arsip bulanan log input 7 kebiasaan siswa per kelas' },
  { name: 'DOKUMENTASI-SISWA', path: '7-KEBIASAAN-ANAK-INDONESIA-HEBAT/DOKUMENTASI-SISWA', desc: 'Foto bukti aktivitas harian siswa (bangun pagi, olahraga, bekal sehat, baca buku)' },
  { name: 'CATATAN-GURU', path: '7-KEBIASAAN-ANAK-INDONESIA-HEBAT/CATATAN-GURU', desc: 'Rekam jejak pembinaan, saran solusi positif, tindak lanjut, dan apresiasi guru' },
  { name: 'LAPORAN-PERKEMBANGAN', path: '7-KEBIASAAN-ANAK-INDONESIA-HEBAT/LAPORAN-PERKEMBANGAN', desc: 'Berkas rekapitulasi nilai karakter mingguan/semester format PDF dan Excel' },
  { name: 'ARSIP-ADMIN', path: '7-KEBIASAAN-ANAK-INDONESIA-HEBAT/ARSIP-ADMIN', desc: 'Audit trail aktivitas sistem, backup database JSON berkala, log sinkronisasi' }
];

export const SHEETS_SCHEMA = [
  {
    sheetName: 'TB_PENGGUNA',
    columns: ['ID', 'Username', 'FullName', 'Role', 'Status', 'KelasID', 'Email', 'NISN_NIP', 'CreatedAt', 'LastLogin'],
    description: 'Daftar master akun (Admin, Guru, Siswa, Orang Tua) terenkripsi'
  },
  {
    sheetName: 'TB_KELAS',
    columns: ['ID', 'NamaKelas', 'Tingkat', 'WaliKelasID', 'TahunAjaran', 'TotalSiswa'],
    description: 'Data kelas dan pemetaan wali kelas pembina'
  },
  {
    sheetName: 'TB_RELASI_KELUARGA',
    columns: ['ID', 'OrangTuaID', 'SiswaID', 'HubunganKeluarga', 'NomorWhatsApp'],
    description: 'Pemetaan hubungan orang tua ke siswa binaan'
  },
  {
    sheetName: 'TB_JURNAL_HARIAN',
    columns: ['ID', 'SiswaID', 'SiswaName', 'KelasID', 'HabitID', 'Tanggal', 'Waktu', 'Deskripsi', 'Refleksi', 'PhotoDriveID', 'Status', 'GuruVerified', 'GuruFeedback', 'CreatedAt'],
    description: 'Catatan input harian 7 kebiasaan siswa beserta bukti kegiatan'
  },
  {
    sheetName: 'TB_PEMBINAAN_GURU',
    columns: ['ID', 'SiswaID', 'GuruID', 'Tanggal', 'Kendala', 'SaranSolusi', 'TargetPerbaikan', 'TglEvaluasiBerikutnya', 'StatusTindakLanjut'],
    description: 'Jurnal pembinaan edukatif dan rekomendasi guru pendamping'
  },
  {
    sheetName: 'TB_TANGGAPAN_ORTU',
    columns: ['ID', 'SiswaID', 'OrangTuaID', 'Tanggal', 'PesanDukungan', 'PengamatanRumah', 'CreatedAt'],
    description: 'Kolom feedback, rasa bangga, dan dukungan orang tua di rumah'
  },
  {
    sheetName: 'TB_AUDIT_LOG',
    columns: ['ID', 'UserID', 'UserName', 'Role', 'Aksi', 'Keterangan', 'Timestamp'],
    description: 'Catatan jejak aktivitas keamanan dan perubahan data'
  }
];
