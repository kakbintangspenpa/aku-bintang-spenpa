import { HabitDefinition, HabitId } from '../types';

export interface ContohIsian {
  activity: string;
  reflection: string;
  alternatives: string[];
  tips: string;
}

export interface HabitTimeRestriction {
  habitId: HabitId;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  timeWindowLabel: string;
  habitName: string;
  description: string;
}

export const HABIT_TIME_RESTRICTIONS: Partial<Record<HabitId, HabitTimeRestriction>> = {
  bangun_pagi: {
    habitId: 'bangun_pagi',
    startHour: 5,
    startMinute: 0,
    endHour: 6,
    endMinute: 0,
    timeWindowLabel: '05.00 - 06.00 WIB',
    habitName: 'Bangun Pagi',
    description: 'Pengisian status "Sudah Dilaksanakan" hanya dibuka pukul 05.00 - 06.00 WIB. Di luar waktu ini hanya bisa mengisi "Belum Terlaksana".'
  },
  beribadah: {
    habitId: 'beribadah',
    startHour: 4,
    startMinute: 0,
    endHour: 5,
    endMinute: 30,
    timeWindowLabel: '04.00 - 05.30 WIB',
    habitName: 'Beribadah',
    description: 'Pengisian status "Sudah Dilaksanakan" hanya dibuka pukul 04.00 - 05.30 WIB. Di luar waktu ini hanya bisa mengisi "Belum Terlaksana".'
  }
};

export const CONTOH_ISIAN_KEBIASAAN: Record<HabitId, ContohIsian> = {
  bangun_pagi: {
    activity: 'Bangun tepat pukul 05.15 WIB tanpa perlu dibangunkan orang tua, merapikan selimut, melipat sprei, membuka jendela kamar, dan minum segelas air hangat.',
    reflection: 'Badan terasa sangat segar, pikiran jernih, dan tidak terburu-buru bersiap mengawali kegiatan hari ini.',
    alternatives: [
      'Bangun pukul 05.00 WIB dengan alarm sendiri, merapikan kasur dan kamar tidur hingga rapi dan bersih.',
      'Bangun pagi pukul 05.20 WIB, merapikan kamar, membuka gorden jendela, dan melakukan peregangan ringan.',
      'Bangun tepat waktu pukul 05.30 WIB dalam kondisi bugar dan bersemangat menyambut aktivitas pagi.'
    ],
    tips: 'Batas waktu pengisian 05.00 - 06.00 WIB. Sebutkan jam bangun tidur, kemandirian merapikan kasur/kamar tidur, dan kesegaran fisik yang dirasakan.'
  },
  beribadah: {
    activity: 'Mengambil air wudhu dan menunaikan sholat Subuh berjamaah tepat pukul 04.45 WIB bersama keluarga di masjid terdekat, dilanjutkan membaca doa pagi dan wirid dengan khusyuk.',
    reflection: 'Hati terasa damai, tenang, bersyukur atas nikmat kehidupan, dan merasa siap belajar dengan bimbingan Tuhan.',
    alternatives: [
      'Menunaikan sholat Subuh berjamaah di masjid pukul 04.30 WIB dan membaca ayat suci Al-Qur\'an selama 15 menit setelah sholat.',
      'Melaksanakan doa pagi dan saat teduh bersama keluarga pukul 05.00 WIB sesuai keyakinan dengan khidmat sebelum beraktivitas.',
      'Membaca renungan kitab suci pukul 04.45 WIB dan memanjatkan doa memohon kelancaran belajar serta keselamatan bagi keluarga.'
    ],
    tips: 'Batas waktu pengisian 04.00 - 05.30 WIB. Tuliskan ibadah atau doa pagi yang kamu laksanakan, pelaksanaan berjamaah/pribadi, dan ketenangan hati.'
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
  bangun_pagi_ibadah: {
    activity: 'Bangun pagi dan menunaikan ibadah dengan khusyuk.',
    reflection: 'Badan segar dan hati tenang.',
    alternatives: ['Bangun pagi dan berdoa bersama keluarga.'],
    tips: 'Catat kegiatan bangun pagi dan ibadahmu.'
  },
  kedisiplinan_umum: {
    activity: 'Menyiapkan seragam rapi dan hadir tepat waktu.',
    reflection: 'Merasa percaya diri dan disiplin.',
    alternatives: ['Menyelesaikan tugas sekolah tepat waktu.'],
    tips: 'Catat kedisiplinan yang kamu lakukan.'
  }
};


export const TUJUH_KEBIASAAN: HabitDefinition[] = [
  {
    id: 'bangun_pagi',
    number: 1,
    title: 'Bangun Pagi',
    shortTitle: 'Bangun Pagi',
    description: 'Membiasakan diri bangun pagi tepat waktu dengan tubuh bugar, merapikan tempat tidur sendiri, dan bersiap menyambut hari.',
    guidelines: [
      'Waktu pengisian: Pukul 05.00 - 06.00 WIB',
      'Merapikan tempat tidur dan melipat selimut secara mandiri',
      'Membuka ventilasi kamar agar udara segar masuk',
      'Minum segelas air putih hangat saat bangun tidur'
    ],
    icon: 'Sunrise',
    color: 'from-amber-500 to-orange-500',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    bgLight: 'bg-amber-50/70',
    borderColor: 'border-amber-200',
    suggestedTimes: '05.00 - 06.00 WIB',
    motivationalQuote: 'Bangun pagi melatih kemandirian dan menghadirkan kesegaran untuk menyongsong masa depan gemilang.'
  },
  {
    id: 'beribadah',
    number: 2,
    title: 'Beribadah',
    shortTitle: 'Beribadah',
    description: 'Menjalankan ibadah dan doa pagi sesuai agama dan keyakinan masing-masing dengan khusyuk dan penuh rasa syukur.',
    guidelines: [
      'Waktu pengisian: Pukul 04.00 - 05.30 WIB',
      'Melaksanakan ibadah/sholat/doa pagi tepat waktu',
      'Membaca kitab suci atau renungan keagamaan',
      'Mengawali hari dengan rasa syukur dan keikhlasan hati'
    ],
    icon: 'Sparkles',
    color: 'from-sky-500 to-blue-600',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    bgLight: 'bg-sky-50/70',
    borderColor: 'border-sky-200',
    suggestedTimes: '04.00 - 05.30 WIB',
    motivationalQuote: 'Ibadah dan doa di pagi hari adalah kompas penuntun hati dalam melangkah dan berbuat kebaikan.'
  },
  {
    id: 'berolahraga',
    number: 3,
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
    number: 4,
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
    number: 5,
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
    number: 6,
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
    number: 7,
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
