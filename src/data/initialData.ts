import { User, ClassRoom, JournalEntry, TeacherCoaching, ParentFeedback, AppreciationBadge, AuditLog, GoogleDriveConfig } from '../types';

// Generate standard SMP classes: 7.1-7.11, 8.1-8.11, 9.1-9.11
const generateSMPInitialClasses = (): ClassRoom[] => {
  const classesList: ClassRoom[] = [];
  const grades = [7, 8, 9];
  for (const grade of grades) {
    for (let i = 1; i <= 11; i++) {
      const id = `kelas-${grade}-${i}`;
      let waliId = '';
      if (grade === 7 && i === 1) waliId = 'usr-guru-dewi';
      if (grade === 8 && i === 1) waliId = 'usr-guru-rizky';

      let total = 0;
      if (grade === 7 && i === 1) total = 2; // Bintang & Anisa
      if (grade === 8 && i === 1) total = 1; // Dimas

      classesList.push({
        id,
        name: `Kelas ${grade}.${i}`,
        grade,
        waliKelasId: waliId,
        totalSiswa: total,
        academicYear: '2026/2027'
      });
    }
  }
  return classesList;
};

export const INITIAL_CLASSES: ClassRoom[] = generateSMPInitialClasses();

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-budi',
    username: 'admin',
    password: 'password123',
    fullName: 'Budi Santoso, M.Pd.',
    role: 'admin',
    email: 'admin.hebat@sekolah.sch.id',
    phone: '081234567890',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-10T08:00:00Z',
    lastLogin: '2026-11-03T07:15:00Z'
  },
  {
    id: 'usr-guru-dewi',
    username: 'guru.dewi',
    password: 'password123',
    fullName: 'Dewi Ratnasari, S.Pd.',
    role: 'guru',
    email: 'dewi.ratna@sekolah.sch.id',
    phone: '081322334455',
    status: 'active',
    nip: '198504122010012015',
    kelasId: 'kelas-7-1',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-10T08:00:00Z',
    lastLogin: '2026-11-03T07:45:00Z'
  },
  {
    id: 'usr-guru-rizky',
    username: 'guru.rizky',
    password: 'password123',
    fullName: 'Rizky Hidayat, S.Pd.',
    role: 'guru',
    email: 'rizky.hidayat@sekolah.sch.id',
    phone: '081399887766',
    status: 'active',
    nip: '198807192014021003',
    kelasId: 'kelas-8-1',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-10T08:00:00Z',
    lastLogin: '2026-11-02T14:20:00Z'
  },
  {
    id: 'usr-siswa-bintang',
    username: 'siswa.bintang',
    password: 'password123',
    fullName: 'Bintang Pratama',
    role: 'siswa',
    nisn: '0129485721',
    kelasId: 'kelas-7-1',
    assignedGuruId: 'usr-guru-dewi',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15T09:00:00Z',
    lastLogin: '2026-11-03T06:30:00Z'
  },
  {
    id: 'usr-siswa-anisa',
    username: 'siswa.anisa',
    password: 'password123',
    fullName: 'Anisa Rahmawati',
    role: 'siswa',
    nisn: '0129485722',
    kelasId: 'kelas-7-1',
    assignedGuruId: 'usr-guru-dewi',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15T09:00:00Z',
    lastLogin: '2026-11-03T06:15:00Z'
  },
  {
    id: 'usr-siswa-dimas',
    username: 'siswa.dimas',
    password: 'password123',
    fullName: 'Dimas Aditya',
    role: 'siswa',
    nisn: '0129485723',
    kelasId: 'kelas-8-1',
    assignedGuruId: 'usr-guru-rizky',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15T09:00:00Z',
    lastLogin: '2026-11-02T19:00:00Z'
  },
  {
    id: 'usr-ortu-bintang',
    username: 'ortu.bintang',
    password: 'password123',
    fullName: 'Hendra Pratama',
    role: 'orang_tua',
    siswaId: 'usr-siswa-bintang',
    linkedSiswaIds: ['usr-siswa-bintang'],
    phone: '081288990011',
    email: 'hendra.pratama@gmail.com',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15T10:00:00Z',
    lastLogin: '2026-11-03T07:10:00Z'
  },
  {
    id: 'usr-ortu-anisa',
    username: 'ortu.anisa',
    password: 'password123',
    fullName: 'Siti Rahmawati',
    role: 'orang_tua',
    siswaId: 'usr-siswa-anisa',
    linkedSiswaIds: ['usr-siswa-anisa'],
    phone: '081277665544',
    email: 'siti.rahmawati@gmail.com',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15T10:00:00Z',
    lastLogin: '2026-11-02T20:30:00Z'
  }
];

const TODAY = new Date().toISOString().split('T')[0];
// Calculate yesterday
const dYesterday = new Date();
dYesterday.setDate(dYesterday.getDate() - 1);
const YESTERDAY = dYesterday.toISOString().split('T')[0];

export const INITIAL_JOURNALS: JournalEntry[] = [
  {
    id: 'jrn-1',
    siswaId: 'usr-siswa-bintang',
    siswaName: 'Bintang Pratama',
    kelasId: 'kelas-5a',
    habitId: 'bangun_pagi_ibadah',
    date: TODAY,
    time: '04.45 WIB',
    activityDescription: 'Bangun pagi pukul 04.45 WIB, merapikan selimut dan sprei, lalu mengambil wudhu untuk sholat Subuh berjamaah bersama ayah di masjid.',
    reflection: 'Alhamdulillah badan terasa sangat segar dan hati tenang ketika memulai pagi dengan sholat berjamaah.',
    photoUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=500&auto=format&fit=crop&q=80',
    photoFileName: 'bintang_subuh_berjamaah.jpg',
    photoDriveFileId: 'DRIVE_FILE_001',
    status: 'Sudah Dilaksanakan',
    guruVerified: true,
    guruFeedback: 'Luar biasa Bintang! Konsistensi bangun pagi dan sholat berjamaah akan membentuk akhlak yang mulia. Terus pertahankan!',
    guruFeedbackAt: `${TODAY}T07:30:00Z`,
    guruFeedbackBy: 'Dewi Ratnasari, S.Pd.',
    parentAcknowledged: true,
    parentNotes: 'Ayah sangat bangga melihat Bintang bangun sendiri tanpa dibangunkan berulang kali.',
    parentAcknowledgedAt: `${TODAY}T07:50:00Z`,
    createdAt: `${TODAY}T05:20:00Z`,
    updatedAt: `${TODAY}T05:20:00Z`
  },
  {
    id: 'jrn-2',
    siswaId: 'usr-siswa-bintang',
    siswaName: 'Bintang Pratama',
    kelasId: 'kelas-5a',
    habitId: 'berolahraga',
    date: TODAY,
    time: '06.00 WIB',
    activityDescription: 'Melakukan senam pemanasan dan lari santai (jogging) keliling komplek rumah selama 20 menit bersama adik.',
    reflection: 'Berkeringat membuat tubuh tidak mudah lelah saat belajar di sekolah.',
    photoUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=500&auto=format&fit=crop&q=80',
    photoFileName: 'bintang_jogging_pagi.jpg',
    photoDriveFileId: 'DRIVE_FILE_002',
    status: 'Sudah Dilaksanakan',
    guruVerified: true,
    guruFeedback: 'Hebat Bintang, mengajak adik olahraga juga melatih kepemimpinan yang baik!',
    guruFeedbackAt: `${TODAY}T07:32:00Z`,
    guruFeedbackBy: 'Dewi Ratnasari, S.Pd.',
    parentAcknowledged: true,
    parentNotes: 'Semangat terus jagoan ayah!',
    parentAcknowledgedAt: `${TODAY}T08:00:00Z`,
    createdAt: `${TODAY}T06:30:00Z`,
    updatedAt: `${TODAY}T06:30:00Z`
  },
  {
    id: 'jrn-3',
    siswaId: 'usr-siswa-bintang',
    siswaName: 'Bintang Pratama',
    kelasId: 'kelas-5a',
    habitId: 'makan_sehat',
    date: TODAY,
    time: '06.30 WIB',
    activityDescription: 'Sarapan nasi putih, sayur bening bayam jagung, tempe goreng, dan minum segelas susu hangat.',
    reflection: 'Sayur bayam buatan ibu rasanya enak dan membuat perut kenyang serta nyaman.',
    photoUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
    photoFileName: 'bintang_sarapan_sehat.jpg',
    photoDriveFileId: 'DRIVE_FILE_003',
    status: 'Sudah Dilaksanakan',
    guruVerified: false,
    parentAcknowledged: true,
    parentNotes: 'Bintang habis sayurnya tanpa sisa, ibu senang sekali.',
    createdAt: `${TODAY}T06:45:00Z`,
    updatedAt: `${TODAY}T06:45:00Z`
  },
  {
    id: 'jrn-4',
    siswaId: 'usr-siswa-bintang',
    siswaName: 'Bintang Pratama',
    kelasId: 'kelas-5a',
    habitId: 'gemar_membaca',
    date: YESTERDAY,
    time: '16.00 WIB',
    activityDescription: 'Membaca buku biografi Ki Hajar Dewantara sebanyak 12 halaman di teras rumah.',
    reflection: 'Saya terinspirasi dari semboyan Tut Wuri Handayani dan kegigihan beliau memperjuangkan pendidikan.',
    photoUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=80',
    photoFileName: 'bintang_literasi_sore.jpg',
    photoDriveFileId: 'DRIVE_FILE_004',
    status: 'Sudah Dilaksanakan',
    guruVerified: true,
    guruFeedback: 'Pilihan buku yang sarat makna sejarah! Kamu adalah contoh pembelajar sejati.',
    guruFeedbackAt: `${YESTERDAY}T18:00:00Z`,
    guruFeedbackBy: 'Dewi Ratnasari, S.Pd.',
    parentAcknowledged: true,
    createdAt: `${YESTERDAY}T16:30:00Z`,
    updatedAt: `${YESTERDAY}T16:30:00Z`
  },
  {
    id: 'jrn-5',
    siswaId: 'usr-siswa-bintang',
    siswaName: 'Bintang Pratama',
    kelasId: 'kelas-5a',
    habitId: 'bermasyarakat',
    date: YESTERDAY,
    time: '17.00 WIB',
    activityDescription: 'Membantu tetangga sebelah rumah yang sudah sepuh membawakan kantong belanjaan dari depan jalan.',
    reflection: 'Nenek Siti berterima kasih dan mendoakan saya, hati saya terasa senang sekali bisa menolong.',
    status: 'Sudah Dilaksanakan',
    guruVerified: true,
    guruFeedback: 'Empati yang mulia, Bintang! Kebaikan kecil membawa berkah besar.',
    guruFeedbackAt: `${YESTERDAY}T18:05:00Z`,
    guruFeedbackBy: 'Dewi Ratnasari, S.Pd.',
    parentAcknowledged: true,
    createdAt: `${YESTERDAY}T17:30:00Z`,
    updatedAt: `${YESTERDAY}T17:30:00Z`
  },
  {
    id: 'jrn-6',
    siswaId: 'usr-siswa-bintang',
    siswaName: 'Bintang Pratama',
    kelasId: 'kelas-5a',
    habitId: 'istirahat_tepat',
    date: YESTERDAY,
    time: '20.45 WIB',
    activityDescription: 'Mematikan televisi jam 20.15, menyikat gigi, dan sudah tidur di kasur tepat pukul 20.45 WIB.',
    reflection: 'Tidur tepat waktu membuat saya tidak mengantuk sama sekali saat bangun subuh.',
    status: 'Sudah Dilaksanakan',
    guruVerified: true,
    parentAcknowledged: true,
    createdAt: `${YESTERDAY}T21:00:00Z`,
    updatedAt: `${YESTERDAY}T21:00:00Z`
  },
  {
    id: 'jrn-7',
    siswaId: 'usr-siswa-bintang',
    siswaName: 'Bintang Pratama',
    kelasId: 'kelas-5a',
    habitId: 'kedisiplinan_umum',
    date: TODAY,
    time: '07.00 WIB',
    activityDescription: 'Tiba di sekolah pukul 06.40 WIB (sebelum bel 07.00), seragam lengkap dengan dasi dan topi, serta tas tersusun rapi.',
    reflection: 'Datang lebih awal membuat saya santai dan siap menerima pelajaran tanpa tergesa-gesa.',
    status: 'Sudah Dilaksanakan',
    guruVerified: true,
    parentAcknowledged: true,
    createdAt: `${TODAY}T07:05:00Z`,
    updatedAt: `${TODAY}T07:05:00Z`
  },
  // Anisa's journal entries
  {
    id: 'jrn-8',
    siswaId: 'usr-siswa-anisa',
    siswaName: 'Anisa Rahmawati',
    kelasId: 'kelas-5a',
    habitId: 'gemar_membaca',
    date: TODAY,
    time: '06.00 WIB',
    activityDescription: 'Membaca buku Ensiklopedia Sains Cilik Bab Tata Surya sebanyak 15 halaman.',
    reflection: 'Sangat seru mengetahui tentang planet Jupiter dan cincin Saturnus!',
    photoUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop&q=80',
    photoFileName: 'anisa_baca_ensiklopedia.jpg',
    status: 'Sudah Dilaksanakan',
    guruVerified: true,
    guruFeedback: 'Anisa anak yang cerdas dan rasa ingin tahunya tinggi. Bagus sekali!',
    guruFeedbackAt: `${TODAY}T07:40:00Z`,
    guruFeedbackBy: 'Dewi Ratnasari, S.Pd.',
    parentAcknowledged: true,
    parentNotes: 'Anisa sangat tekun membaca buku baru hadiah ulang tahunnya.',
    createdAt: `${TODAY}T06:20:00Z`,
    updatedAt: `${TODAY}T06:20:00Z`
  },
  {
    id: 'jrn-9',
    siswaId: 'usr-siswa-anisa',
    siswaName: 'Anisa Rahmawati',
    kelasId: 'kelas-5a',
    habitId: 'bangun_pagi_ibadah',
    date: TODAY,
    time: '04.50 WIB',
    activityDescription: 'Bangun pagi, sholat subuh bersama ibu, lalu merapikan kamar tidur sendiri.',
    reflection: 'Kamar yang rapi membuat suasana hati ceria.',
    status: 'Sudah Dilaksanakan',
    guruVerified: true,
    parentAcknowledged: true,
    createdAt: `${TODAY}T05:30:00Z`,
    updatedAt: `${TODAY}T05:30:00Z`
  },
  // Dimas (needs coaching)
  {
    id: 'jrn-10',
    siswaId: 'usr-siswa-dimas',
    siswaName: 'Dimas Aditya',
    kelasId: 'kelas-5b',
    habitId: 'istirahat_tepat',
    date: YESTERDAY,
    time: '23.15 WIB',
    activityDescription: 'Masih bermain game di tablet hingga larut malam.',
    reflection: 'Pagi harinya saya terlambat bangun dan mengantuk saat pelajaran pertama.',
    status: 'Belum Dilaksanakan',
    guruVerified: true,
    guruFeedback: 'Pak Rizky paham game itu seru Dimas, tapi kesehatan dan jam tidurmu jauh lebih berharga. Ayo malam ini coba taruh tablet jam 20.30 ya!',
    guruFeedbackAt: `${TODAY}T08:00:00Z`,
    guruFeedbackBy: 'Rizky Hidayat, S.Pd.',
    parentAcknowledged: false,
    createdAt: `${YESTERDAY}T23:30:00Z`,
    updatedAt: `${YESTERDAY}T23:30:00Z`
  }
];

export const INITIAL_COACHING: TeacherCoaching[] = [
  {
    id: 'cch-1',
    siswaId: 'usr-siswa-dimas',
    siswaName: 'Dimas Aditya',
    kelasId: 'kelas-5b',
    guruId: 'usr-guru-rizky',
    guruName: 'Rizky Hidayat, S.Pd.',
    habitId: 'istirahat_tepat',
    date: TODAY,
    obstacleNotes: 'Dimas kesulitan mengatur durasi bermain gawai (screen time) di malam hari sehingga tidur lewat pukul 23.00 WIB.',
    positiveSolutionAdvice: 'Membuat kesepakatan jam malam gawai bersama orang tua (gawai diletakkan di ruang keluarga pada pukul 20.30 WIB). Dimas diberikan buku cerita menarik sebagai pengantar tidur.',
    improvementTarget: 'Mampu tidur malam sebelum pukul 21.15 WIB secara konsisten selama 7 hari berturut-turut.',
    nextEvaluationDate: '2026-11-10',
    followUpStatus: 'Dalam Proses',
    createdAt: `${TODAY}T08:15:00Z`
  },
  {
    id: 'cch-2',
    siswaId: 'usr-siswa-bintang',
    siswaName: 'Bintang Pratama',
    kelasId: 'kelas-5a',
    guruId: 'usr-guru-dewi',
    guruName: 'Dewi Ratnasari, S.Pd.',
    habitId: 'bermasyarakat',
    date: '2026-10-25',
    obstacleNotes: 'Awalnya masih agak pemalu untuk menyapa warga lingkungan sekolah selain teman dekatnya.',
    positiveSolutionAdvice: 'Ibu Dewi mengajak Bintang menjadi duta penyambut pagi di gerbang sekolah (piket 5S: Senyum, Salam, Sapa).',
    improvementTarget: 'Percaya diri menyapa bapak/ibu guru dan adik kelas dengan sopan setiap pagi.',
    nextEvaluationDate: '2026-11-05',
    followUpStatus: 'Tercapai',
    createdAt: '2026-10-25T09:00:00Z'
  }
];

export const INITIAL_FEEDBACKS: ParentFeedback[] = [
  {
    id: 'pfb-1',
    siswaId: 'usr-siswa-bintang',
    parentId: 'usr-ortu-bintang',
    parentName: 'Hendra Pratama',
    date: TODAY,
    supportMessage: 'Terima kasih Bu Dewi atas bimbingannya. Di rumah Bintang makin mandiri dan selalu mengingatkan kami sekeluarga untuk sholat tepat waktu.',
    homeObservations: 'Bintang selalu merapikan tempat tidur sendiri dan langsung cuci piring setelah makan tanpa disuruh.',
    createdAt: `${TODAY}T07:55:00Z`
  },
  {
    id: 'pfb-2',
    siswaId: 'usr-siswa-anisa',
    parentId: 'usr-ortu-anisa',
    parentName: 'Siti Rahmawati',
    date: TODAY,
    supportMessage: 'Anisa makin senang membaca buku sains dan selalu antusias menceritakan kembali hal menarik yang dibacanya.',
    homeObservations: 'Setiap sore rutin duduk di teras membaca minimal 20 menit.',
    createdAt: `${TODAY}T07:15:00Z`
  }
];

export const INITIAL_BADGES: AppreciationBadge[] = [
  {
    id: 'bdg-1',
    siswaId: 'usr-siswa-bintang',
    guruId: 'usr-guru-dewi',
    guruName: 'Dewi Ratnasari, S.Pd.',
    badgeName: 'Bintang Disiplin Subuh',
    badgeIcon: 'SunMedium',
    message: 'Hebat! Konsisten bangun pagi dan beribadah tepat waktu selama sepekan penuh.',
    date: TODAY
  },
  {
    id: 'bdg-2',
    siswaId: 'usr-siswa-bintang',
    guruId: 'usr-guru-dewi',
    guruName: 'Dewi Ratnasari, S.Pd.',
    badgeName: 'Duta Sahabat Sehat',
    badgeIcon: 'Apple',
    message: 'Rajin membawa bekal sayur dan buah bergizi setiap hari ke sekolah!',
    date: YESTERDAY
  },
  {
    id: 'bdg-3',
    siswaId: 'usr-siswa-anisa',
    guruId: 'usr-guru-dewi',
    guruName: 'Dewi Ratnasari, S.Pd.',
    badgeName: 'Kutu Buku Inspiratif',
    badgeIcon: 'BookOpen',
    message: 'Membaca lebih dari 5 buku bermutu bulan ini dengan refleksi yang sangat berbobot.',
    date: TODAY
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'usr-admin-budi',
    userName: 'Budi Santoso, M.Pd.',
    role: 'admin',
    action: 'LOGIN_SUKSES',
    details: 'Admin masuk ke dashboard sistem pemantauan karakter sekolah',
    timestamp: '2026-11-03T07:15:00Z'
  },
  {
    id: 'log-2',
    userId: 'usr-siswa-bintang',
    userName: 'Bintang Pratama',
    role: 'siswa',
    action: 'JURNAL_INPUT',
    details: 'Mengisi jurnal harian kebiasaan "Bangun Pagi & Beribadah" dengan bukti foto',
    timestamp: `${TODAY}T05:20:00Z`
  },
  {
    id: 'log-3',
    userId: 'usr-guru-dewi',
    userName: 'Dewi Ratnasari, S.Pd.',
    role: 'guru',
    action: 'VERIFIKASI_JURNAL',
    details: 'Memberikan apresiasi dan catatan motivasi pada jurnal Bintang Pratama',
    timestamp: `${TODAY}T07:30:00Z`
  },
  {
    id: 'log-4',
    userId: 'usr-ortu-bintang',
    userName: 'Hendra Pratama',
    role: 'orang_tua',
    action: 'TANGGAPAN_ORTU',
    details: 'Mengirimkan pesan apresiasi dan catatan observasi rumah untuk anak Bintang Pratama',
    timestamp: `${TODAY}T07:55:00Z`
  }
];

export const INITIAL_DRIVE_CONFIG: GoogleDriveConfig = {
  sheetWebhookUrl: '',
  driveFolderId: '1AbCdEfGhIjKlMnOpQrStUvWxYz-7KebiasaanRoot',
  schoolGoogleAccount: 'admin.karakter@smpn1teladan.sch.id',
  lastSyncTime: '2026-11-03T07:00:00Z',
  autoSyncEnabled: true,
  status: 'mock_mode'
};
