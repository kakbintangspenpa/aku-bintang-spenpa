import React, { useState } from 'react';
import { X, Copy, Check, FolderTree, Database, Code, BookOpen, ShieldCheck, HardDrive, FileSpreadsheet, Server, ExternalLink } from 'lucide-react';
import { DRIVE_FOLDER_STRUCTURE, SHEETS_SCHEMA } from '../data/constants';
import { GOOGLE_APPS_SCRIPT_CODE } from '../data/googleScriptTemplate';

interface PanduanIntegrasiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PanduanIntegrasiModal: React.FC<PanduanIntegrasiModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'arsitektur' | 'drive' | 'sheets' | 'apps_script' | 'panduan'>('arsitektur');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden my-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
                Dokumentasi Teknis & Rancangan Sistem
              </span>
              <h2 className="text-base sm:text-lg font-bold">
                Arsitektur, Google Drive & Skema Google Sheets
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 overflow-x-auto shrink-0 gap-1">
          <button
            onClick={() => setActiveTab('arsitektur')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'arsitektur'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Server className="w-4 h-4" />
            1. Arsitektur Sistem
          </button>
          <button
            onClick={() => setActiveTab('drive')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'drive'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            2. Folder Google Drive
          </button>
          <button
            onClick={() => setActiveTab('sheets')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'sheets'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            3. Skema Google Sheets
          </button>
          <button
            onClick={() => setActiveTab('apps_script')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'apps_script'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code className="w-4 h-4" />
            4. Kode Google Apps Script
          </button>
          <button
            onClick={() => setActiveTab('panduan')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'panduan'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            5. Panduan 4 Peran & Keamanan
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-xs sm:text-sm">
          {/* TAB 1: ARSITEKTUR */}
          {activeTab === 'arsitektur' && (
            <div className="space-y-5">
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4">
                <h4 className="font-bold text-blue-900 text-sm mb-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Prinsip Arsitektur Aplikasi Aman
                </h4>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Aplikasi memisahkan antarmuka pengguna (Frontend React TypeScript) dengan media penyimpanan
                  melalui lapisan Backend Webhook (Google Apps Script). Browser pengguna tidak pernah memegang kredensial rahasia akun Google sekolah. Hak akses diisolasi secara ketat berdasarkan peran (RBAC) pada setiap data request.
                </p>
              </div>

              {/* Architecture Diagram Card */}
              <div className="border border-slate-200 rounded-2xl p-5 bg-slate-900 text-white font-mono text-xs overflow-x-auto shadow-inner">
                <div className="text-emerald-400 font-bold mb-2">// DIAGRAM ALUR DATA SISTEM 7 KEBIASAAN</div>
                <pre className="text-slate-200 leading-relaxed">
{`+-----------------------------------------------------------------------------------+
|                           FRONTEND REACT + TYPESCRIPT                            |
|  [Siswa Dashboard]      [Guru Dashboard]      [Orang Tua View]    [Admin Center]  |
|  - Jurnal & Foto        - Verifikasi Jurnal   - Pantauan Anak     - Manajemen User|
|  - 7 Kartu Hebat        - Pembinaan Edukatif  - Pesan Kasih Sayang- Sinkronisasi  |
+-----------------------------------------------------------------------------------+
                                        |  (Token Autentikasi & Validasi Peran)
                                        v
+-----------------------------------------------------------------------------------+
|                        LAPISAN AUTENTIKASI & KEAMANAN                             |
|  - Firebase Authentication / Unified Account Management                          |
|  - Pemetaan Username -> Identitas Terenkripsi                                    |
|  - Role-Based Access Control (RBAC) & Audit Log Tracker                           |
+-----------------------------------------------------------------------------------+
                                        |  (Permintaan Data Terverifikasi)
                                        v
+-----------------------------------------------------------------------------------+
|                   BACKEND CONNECTOR (Google Apps Script / Webhook)                |
|  - Berjalan atas nama Akun Google Resmi Sekolah (Dedicated School Account)        |
|  - Menyediakan endpoint doPost() & doGet() terenkripsi SSL/HTTPS                  |
+-----------------------------------------------------------------------------------+
                   /                                             \\
                  v                                               v
+-----------------------------------+           +-----------------------------------+
|      GOOGLE DRIVE STORAGE         |           |       GOOGLE SHEETS DATABASE      |
|  Root: 7-KEBIASAAN-ANAK-INDONESIA |           |  File: DATABASE_7_KEBIASAAN_HEBAT  |
|  - DOKUMENTASI-SISWA (Foto Bukti) |           |  - TB_PENGGUNA   - TB_KELAS       |
|  - LAPORAN-PERKEMBANGAN (PDF)     |           |  - TB_JURNAL     - TB_PEMBINAAN   |
|  - ARSIP-ADMIN (Backup JSON)      |           |  - TB_TANGGAPAN  - TB_AUDIT_LOG   |
+-----------------------------------+           +-----------------------------------+`}
                </pre>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-800 block text-xs mb-1">
                    🔒 Keamanan Penyimpanan Kredensial
                  </span>
                  <p className="text-[11px] text-slate-600">
                    Google Drive dan Google Sheets tidak dibuka untuk publik. File disimpan dalam folder privat milik sekolah, dan link foto yang disematkan menggunakan token atau proxy URL aman.
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-800 block text-xs mb-1">
                    ⚡ Mode Operasi Offline & Realtime Sync
                  </span>
                  <p className="text-[11px] text-slate-600">
                    Sistem memiliki penyimpanan lokal berkinerja tinggi sehingga aplikasi tetap dapat dibuka cepat tanpa jeda jaringan, serta menyediakan fitur sinkronisasi otomatis ke Google Cloud.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GOOGLE DRIVE FOLDER */}
          {activeTab === 'drive' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">
                    Struktur Folder Resmi di Google Drive Sekolah
                  </h4>
                  <p className="text-xs text-slate-500">
                    Struktur ini dibuat otomatis oleh skrip Google Apps Script untuk kerapian arsip sekolah.
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full">
                  7 Sub-Folder Terstandar
                </span>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200 bg-white">
                {DRIVE_FOLDER_STRUCTURE.map((folder, idx) => (
                  <div key={idx} className={`p-3.5 flex items-start gap-3 ${folder.isRoot ? 'bg-blue-50/60' : 'hover:bg-slate-50'}`}>
                    <div className={`p-2 rounded-lg shrink-0 ${folder.isRoot ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                      <HardDrive className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold text-xs ${folder.isRoot ? 'text-blue-900 text-sm' : 'text-slate-800'}`}>
                          {folder.name}
                        </span>
                        {folder.isRoot && (
                          <span className="px-1.5 py-0.2 bg-blue-200 text-blue-800 text-[10px] rounded font-bold">
                            ROOT FOLDER
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{folder.desc}</p>
                      {!folder.isRoot && (
                        <div className="text-[10px] text-slate-400 font-mono mt-1">
                          Path: <code>{folder.path}</code>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GOOGLE SHEETS DATABASE */}
          {activeTab === 'sheets' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">
                  Skema Relasi Database Spreadsheet (DATABASE_7_KEBIASAAN_HEBAT)
                </h4>
                <p className="text-xs text-slate-500">
                  Data utama disimpan dalam lembar kerja Google Sheets dengan header kolom terstruktur.
                </p>
              </div>

              <div className="space-y-3">
                {SHEETS_SCHEMA.map((table, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        <span className="font-mono font-bold text-xs text-slate-900">
                          {table.sheetName}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">{table.description}</span>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-2.5 font-mono text-[11px] text-slate-700 overflow-x-auto border border-slate-200">
                      <div className="flex flex-wrap gap-1.5">
                        {table.columns.map((col, cIdx) => (
                          <span
                            key={cIdx}
                            className={`px-2 py-0.5 rounded border ${
                              col === 'ID' || col.endsWith('ID')
                                ? 'bg-indigo-100 text-indigo-800 border-indigo-200 font-bold'
                                : 'bg-white text-slate-700 border-slate-200'
                            }`}
                          >
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GOOGLE APPS SCRIPT CODE */}
          {activeTab === 'apps_script' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">
                    Kode Backend Google Apps Script (Code.gs)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Salin kode di bawah ini lalu tempelkan ke project script.google.com akun sekolah.
                  </p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Salin Seluruh Kode
                    </>
                  )}
                </button>
              </div>

              {/* Step by step checklist */}
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1.5 text-amber-900">
                <span className="font-bold block text-sm">📋 Langkah Singkat Pemasangan (5 Menit):</span>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Buka <strong>https://script.google.com</strong> menggunakan akun Google sekolah.</li>
                  <li>Buat proyek baru, ganti nama proyek menjadi <code>Backend 7 Kebiasaan</code>.</li>
                  <li>Hapus kode bawaan dan tempel kode lengkap di bawah.</li>
                  <li>Jalankan fungsi <code>setupInitialStorage</code> sekali untuk otomatis membuat folder Drive dan Sheets.</li>
                  <li>Klik menu <strong>Terapkan (Deploy) &gt; Penerapan Baru</strong>, pilih jenis <strong>Aplikasi Web</strong>.</li>
                  <li>Atur akses ke <em>"Siapa saja"</em> lalu salin Web App URL ke aplikasi ini pada menu Admin &gt; Google Drive.</li>
                </ol>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-4">
                <pre className="font-mono text-[11px] text-slate-300 overflow-x-auto max-h-80 leading-relaxed">
                  {GOOGLE_APPS_SCRIPT_CODE}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 5: PANDUAN PENGGUNA */}
          {activeTab === 'panduan' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-sm">
                Panduan Penggunaan Berdasarkan 4 Peran Pengguna
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50">
                  <span className="font-bold text-purple-900 text-xs block mb-1">
                    👑 1. Panduan Administrator
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-purple-800">
                    <li>Kelola akun Siswa, Guru, dan Orang Tua (tambah/edit/nonaktifkan/reset sandi).</li>
                    <li>Hubungkan siswa ke wali kelas guru dan akun orang tua.</li>
                    <li>Konfigurasikan webhook Google Drive & Google Sheets.</li>
                    <li>Lakukan backup berkala ke format JSON dan pantau jejak audit log.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
                  <span className="font-bold text-blue-900 text-xs block mb-1">
                    👨‍🏫 2. Panduan Guru Pembina
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-blue-800">
                    <li>Pantau jurnal masuk dari seluruh siswa binaan setiap hari.</li>
                    <li>Periksa bukti foto dan berikan verifikasi apresiasi yang mendidik.</li>
                    <li>Semayamkan lencana prestasi karakter bagi siswa yang konsisten.</li>
                    <li>Tuliskan catatan pembinaan terstruktur untuk siswa yang membutuhkan motivasi tambahan.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                  <span className="font-bold text-emerald-900 text-xs block mb-1">
                    🎒 3. Panduan Siswa Hebat
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-emerald-800">
                    <li>Pilih kebiasaan yang telah dilakukan pada kartu dashboard.</li>
                    <li>Tuliskan ringkasan kegiatan dan refleksi singkat apa yang dirasakan.</li>
                    <li>Unggah foto kegiatan sebagai kenang-kenangan dan dokumentasi.</li>
                    <li>Kumpulkan rentetan hari konsisten (streak) dan raih lencana dari guru!</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
                  <span className="font-bold text-amber-900 text-xs block mb-1">
                    👨‍👩‍👧 4. Panduan Orang Tua
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-amber-800">
                    <li>Lihat rekapitulasi kebiasaan harian dan foto dokumentasi anak.</li>
                    <li>Baca saran pembinaan positif dari bapak/ibu guru wali kelas.</li>
                    <li>Tuliskan kata-kata semangat, rasa bangga, dan observasi di rumah.</li>
                    <li>Unduh laporan perkembangan berkala format PDF atau Excel.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 hidden sm:inline">
            7 Kebiasaan Anak Indonesia Hebat &bull; Standar Pendidikan Karakter Kemendikbudristek
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors ml-auto"
          >
            Tutup Dokumentasi
          </button>
        </div>
      </div>
    </div>
  );
};
