import { HabitDefinition, HabitId } from '../types';

export interface ContohIsian {
  activity: string;
  reflection: string;
  alternatives: string[];
  tips: string;
}

export const CONTOH_ISIAN_KEBIASAAN: Record<HabitId, ContohIsian> = {
  bangun_pagi_ibadah: {
    activity: 'Bangun pukul 04.45 WIB, merapikan tempat tidur dan melipat selimut secara mandiri, lalu berwudhu untuk sholat Subuh berjamaah bersama keluarga di masjid.',
    reflection: 'Badan terasa segar, pikiran tenang, dan lebih siap menyambut kegiatan sekolah hari ini.',
    alternatives: [
      'Bangun pukul 04.45 WIB, merapikan kasur sendiri, lalu menunaikan ibadah Subuh berjamaah di masjid.',
      'Bangun tepat pukul 05.00 WIB, berdoa mengucap syukur bersama keluarga, dan minum segelas air hangat.',
      'Bangun pukul 04.30 WIB tanpa perlu dibangunkan orang tua, merapikan kamar, dan beribadah pagi dengan khusyuk.'
    ],
    tips: 'Sebutkan jam bangun tidur, kerapian kamar tidur, dan ibadah atau doa pagi yang kamu lakukan.'
  },
  berolahraga: {
    activity: 'Melakukan senam peregangan dan lari santai (jogging) keliling kompleks rumah selama 20 menit bersama adik, dilanjutkan minum air putih yang cukup.',
    reflection: 'Otot terasa relaks, tubuh berkeringat sehat, dan rasa kantuk langsung hilang.',
    alternatives: [
      'Lari santai (jogging) pagi selama 20 menit dan senam pemanasan di halaman rumah.',
      'Bermain bulu tangkis santai di sore hari selama 30 menit bersama teman sebaya di lapangan dekat rumah.',
      'Mengikuti senam kesegaran jasmani di sekolah dan bersepeda santai selama 20 menit.'
    ],
    tips: 'Sebutkan jenis olahraga fisik, durasi waktu (misal 15-30 menit), dan manfaat yang dirasakan.'
  },
  makan_sehat: {
    activity: 'Sarapan pagi dengan menu seimbang: sepiring nasi putih, sayur bening bayam dan jagung, sebutir telur rebus, tempe goreng, dan minum 2 gelas air putih hangat.',
    reflection: 'Perut terasa kenyang dan nyaman, konsentrasi belajar di kelas menjadi lebih maksimal tanpa tergoda jajan sembarangan.',
    alternatives: [
      'Sarapan nasi, sayur sop wortel kentang, sepotong ikan bakar, buah pisang segar, dan air putih hangat.',
      'Membawa bekal sehat dari rumah berisi nasi, tumis buncis tempe, telur dadar, dan sebutir apel manis.',
      'Makan siang bergizi seimbang dengan porsi Isi Piringku dan tidak membeli jajanan berpengawet atau minuman manis berlebih.'
    ],
    tips: 'Tuliskan jenis makanan bergizi yang kamu konsumsi (sayur, lauk protein, buah segar, dan air putih).'
  },
  gemar_membaca: {
    activity: 'Membaca buku biografi Ki Hajar Dewantara sebanyak 15 halaman di ruang belajar rumah, lalu mencatat 3 kosakata baru dan pesan inspiratifnya.',
    reflection: 'Mendapat wawasan sejarah baru dan semakin termotivasi untuk rajin belajar demi meraih cita-cita masa depan.',
    alternatives: [
      'Membaca novel inspiratif anak muda sebanyak 20 halaman di pojok baca perpustakaan sekolah.',
      'Membaca artikel ensiklopedia sains tentang sistem tata surya selama 25 menit dan merangkum intisarinya.',
      'Membaca buku pelajaran matematika dan menyelesaikan latihan soal secara mandiri selama 30 menit.'
    ],
    tips: 'Sebutkan judul buku atau materi yang kamu baca, jumlah halaman/waktu membaca, serta pelajaran berharga yang diperoleh.'
  },
  bermasyarakat: {
    activity: 'Membantu ibu merapikan meja makan setelah sarapan dan ikut menyapu dedaunan gugur di jalan depan rumah bersama tetangga sekitar.',
    reflection: 'Senang dan bangga karena bisa meringankan pekerjaan orang tua serta ikut menjaga kebersihan lingkungan bersama.',
    alternatives: [
      'Membantu teman sekelas yang kesulitan memahami materi pelajaran saat jam istirahat.',
      'Menyapa bapak satpam dan bapak/ibu guru dengan salam ramah serta membuang sampah plastik pada tempat pemilahan.',
      'Membantu adik memahami tugas sekolah dan merapikan buku-buku di ruang keluarga.'
    ],
    tips: 'Tuliskan tindakan kebaikan, bantuan sosial, atau sopan santun yang kamu berikan kepada keluarga, teman, atau tetangga.'
  },
  istirahat_tepat: {
    activity: 'Mematikan layar HP pukul 21.00 WIB, mencuci kaki, menggosok gigi, membaca doa sebelum tidur, dan mulai tidur tepat pukul 21.15 WIB.',
    reflection: 'Tidur nyenyak selama 7,5 jam tanpa terbangun tengah malam, saat bangun pagi terasa berenergi dan bugar.',
    alternatives: [
      'Tidur malam tepat pukul 21.00 WIB setelah menjauhkan gawai dari tempat tidur 30 menit sebelumnya.',
      'Tidur tepat waktu pukul 21.30 WIB dengan lampu kamar redup dan suasana tenang untuk menjaga kesehatan mata.',
      'Disiplin tidur malam pukul 21.00 WIB agar otak dan tubuh beristirahat optimal untuk aktivitas sekolah esok hari.'
    ],
    tips: 'Sebutkan jam mematikan gadget, jam mulai tidur, dan persiapan sehat sebelum tidur.'
  },
  kedisiplinan_umum: {
    activity: 'Menyiapkan seragam rapi dan menyusun buku pelajaran sesuai jadwal sejak malam hari, serta hadir di sekolah 15 menit sebelum bel apel pagi berbunyi.',
    reflection: 'Merasa percaya diri, tidak tergesa-gesa, dan dapat mengikuti pembelajaran hari ini dengan tenang dan tertib.',
    alternatives: [
      'Menyelesaikan tugas pekerjaan rumah (PR) tepat waktu tanpa menunda-nunda dan merapikan kembali alat tulis ke tas.',
      'Hadir di kelas pukul 06.45 WIB dengan seragam dan atribut lengkap serta mematuhi tata tertib kelas.',
      'Merapikan sepeda di tempat parkir sekolah secara teratur dan menjaga barang perlengkapan pribadi agar tidak hilang.'
    ],
    tips: 'Tuliskan kedisiplinan yang kamu terapkan, seperti ketepatan waktu datang, seragam lengkap, atau penyelesaian tugas.'
  }
};


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
