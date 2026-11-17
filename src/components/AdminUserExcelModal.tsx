import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { User, ClassRoom, Role } from '../types';
import { storageService } from '../services/storageService';
import {
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
  Check,
  Users
} from 'lucide-react';

interface AdminUserExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  classes: ClassRoom[];
  currentUser: User;
  onImported: (count: number) => void;
}

interface ParsedImportRow {
  rowNumber: number;
  fullName: string;
  username: string;
  role: Role;
  password: string;
  nisnNip: string;
  classLabel: string;
  kelasId?: string;
  email: string;
  phone: string;
  childRef: string;
  teacherRef: string;
  relationship: string;
  valid: boolean;
  error?: string;
}

const ROLE_TEXT: Record<Role, string> = {
  siswa: 'Siswa',
  guru: 'Guru',
  orang_tua: 'Orang Tua',
  admin: 'Admin'
};

export function exportUsersToExcel(users: User[], classes: ClassRoom[]) {
  const rows = users.map((u, idx) => {
    const cls = classes.find(c => c.id === u.kelasId);
    const child = u.siswaId ? users.find(s => s.id === u.siswaId) : undefined;
    const teacher = u.assignedGuruId ? users.find(g => g.id === u.assignedGuruId) : undefined;
    return {
      No: idx + 1,
      'Nama Lengkap': u.fullName,
      Username: u.username,
      Peran: u.role,
      'Label Peran': ROLE_TEXT[u.role] || u.role,
      Status: u.status === 'active' ? 'Aktif' : 'Nonaktif',
      'Nama Kelas': cls ? cls.name : '',
      'NISN / NIP': u.nisn || u.nip || '',
      Email: u.email || '',
      'No. HP': u.phone || '',
      'Username Guru Pembina': teacher ? teacher.username : '',
      'Username Anak (Orang Tua)': child ? child.username : '',
      'Hubungan Keluarga': u.relationship || ''
    };
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = [
    { wch: 5 },
    { wch: 28 },
    { wch: 20 },
    { wch: 12 },
    { wch: 14 },
    { wch: 10 },
    { wch: 14 },
    { wch: 18 },
    { wch: 26 },
    { wch: 16 },
    { wch: 22 },
    { wch: 22 },
    { wch: 18 }
  ];
  XLSX.utils.book_append_sheet(wb, ws, 'Data Pengguna');

  const dateStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `Data_Pengguna_7_Kebiasaan_${dateStr}.xlsx`);
}

function normalizeRole(raw: string): Role | null {
  const val = raw.trim().toLowerCase().replace(/\s+/g, '_');
  if (val === 'siswa' || val === 'murid' || val === 'pelajar') return 'siswa';
  if (val === 'guru' || val === 'wali_kelas' || val === 'pembina') return 'guru';
  if (val === 'orang_tua' || val === 'orangtua' || val === 'ortu' || val === 'wali' || val === 'wali_murid') {
    return 'orang_tua';
  }
  if (val === 'admin' || val === 'administrator') return 'admin';
  return null;
}

function findClassId(rawClass: string, classes: ClassRoom[]): string | undefined {
  const clean = rawClass.trim().toLowerCase();
  if (!clean) return undefined;
  const direct = classes.find(
    c =>
      c.id.toLowerCase() === clean ||
      c.name.toLowerCase() === clean ||
      c.name.toLowerCase().replace('kelas ', '').trim() === clean.replace('kelas ', '').trim()
  );
  return direct?.id;
}

export const AdminUserExcelModal: React.FC<AdminUserExcelModalProps> = ({
  isOpen,
  onClose,
  users,
  classes,
  currentUser,
  onImported
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [parsedRows, setParsedRows] = useState<ParsedImportRow[]>([]);
  const [parseError, setParseError] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    const sampleRows = [
      {
        'Nama Lengkap': 'Ahmad Fauzi',
        Username: 'siswa.ahmad',
        Peran: 'siswa',
        'Kata Sandi': 'password123',
        'NISN / NIP': '0123456789',
        'Nama Kelas': 'Kelas 7.1',
        Email: 'ahmad@sekolah.sch.id',
        'No. HP': '081234567890',
        'Username Guru Pembina': '',
        'Username Anak (Orang Tua)': '',
        'Hubungan Keluarga': ''
      },
      {
        'Nama Lengkap': 'Siti Aminah, S.Pd.',
        Username: 'guru.siti',
        Peran: 'guru',
        'Kata Sandi': 'password123',
        'NISN / NIP': '198601012010012001',
        'Nama Kelas': 'Kelas 7.1',
        Email: 'siti@sekolah.sch.id',
        'No. HP': '081345678901',
        'Username Guru Pembina': '',
        'Username Anak (Orang Tua)': '',
        'Hubungan Keluarga': ''
      },
      {
        'Nama Lengkap': 'Bapak Fauzi',
        Username: 'ortu.ahmad',
        Peran: 'orang_tua',
        'Kata Sandi': 'password123',
        'NISN / NIP': '',
        'Nama Kelas': '',
        Email: 'ortu.ahmad@gmail.com',
        'No. HP': '081299998888',
        'Username Guru Pembina': '',
        'Username Anak (Orang Tua)': 'siswa.ahmad',
        'Hubungan Keluarga': 'Ayah Kandung'
      }
    ];

    const guideRows = [
      { Kolom: 'Nama Lengkap', Keterangan: 'Wajib diisi. Nama lengkap pengguna.' },
      { Kolom: 'Username', Keterangan: 'Wajib diisi, unik, tanpa spasi (huruf kecil).' },
      { Kolom: 'Peran', Keterangan: 'Isi salah satu: siswa, guru, orang_tua, atau admin.' },
      { Kolom: 'Kata Sandi', Keterangan: 'Opsional. Jika dikosongkan otomatis menjadi password123.' },
      { Kolom: 'NISN / NIP', Keterangan: 'NISN untuk siswa atau NIP untuk guru (opsional).' },
      { Kolom: 'Nama Kelas', Keterangan: 'Contoh: Kelas 7.1 atau 7.1 (untuk siswa & wali kelas).' },
      { Kolom: 'Email', Keterangan: 'Opsional. Alamat email pengguna.' },
      { Kolom: 'No. HP', Keterangan: 'Opsional. Nomor WhatsApp / telepon.' },
      { Kolom: 'Username Guru Pembina', Keterangan: 'Opsional untuk siswa. Isi username guru pembinanya.' },
      { Kolom: 'Username Anak (Orang Tua)', Keterangan: 'Khusus orang_tua. Isi username atau NISN siswa anaknya.' },
      { Kolom: 'Hubungan Keluarga', Keterangan: 'Contoh: Ayah Kandung, Ibu Kandung, Wali Murid.' }
    ];

    const wb = XLSX.utils.book_new();
    const wsTemplate = XLSX.utils.json_to_sheet(sampleRows);
    wsTemplate['!cols'] = [
      { wch: 24 }, { wch: 18 }, { wch: 12 }, { wch: 14 }, { wch: 20 },
      { wch: 14 }, { wch: 24 }, { wch: 16 }, { wch: 22 }, { wch: 24 }, { wch: 18 }
    ];
    XLSX.utils.book_append_sheet(wb, wsTemplate, 'Template Pengguna');

    const wsGuide = XLSX.utils.json_to_sheet(guideRows);
    wsGuide['!cols'] = [{ wch: 26 }, { wch: 58 }];
    XLSX.utils.book_append_sheet(wb, wsGuide, 'Panduan Pengisian');

    XLSX.writeFile(wb, 'Template_Tambah_Pengguna_7_Kebiasaan.xlsx');
  };

  const getField = (row: Record<string, any>, candidates: string[]): string => {
    const keys = Object.keys(row);
    for (const candidate of candidates) {
      const target = candidate.toLowerCase();
      const matchedKey = keys.find(k => k.trim().toLowerCase() === target);
      if (matchedKey !== undefined && row[matchedKey] !== undefined && row[matchedKey] !== null) {
        return String(row[matchedKey]).trim();
      }
    }
    return '';
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setParseError('');
    setParsedRows([]);
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    try {
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = wb.SheetNames[0];
      if (!firstSheetName) {
        setParseError('File Excel/CSV tidak memiliki sheet data.');
        return;
      }
      const ws = wb.Sheets[firstSheetName];
      const rawJson = XLSX.utils.sheet_to_json<Record<string, any>>(ws, { defval: '' });

      if (rawJson.length === 0) {
        setParseError('Tidak ditemukan baris data pada file yang dipilih.');
        return;
      }

      const existingUsernames = new Set(users.map(u => u.username.toLowerCase()));
      const seenFileUsernames = new Set<string>();

      const results: ParsedImportRow[] = rawJson.map((raw, idx) => {
        const rowNumber = idx + 2;
        const fullName = getField(raw, ['Nama Lengkap', 'fullName', 'Nama', 'Full Name']);
        const rawUsername = getField(raw, ['Username', 'username', 'User']).toLowerCase().replace(/\s+/g, '');
        const rawRole = getField(raw, ['Peran', 'role', 'Role']);
        const role = normalizeRole(rawRole);
        const password = getField(raw, ['Kata Sandi', 'Password', 'password']) || 'password123';
        const nisnNip = getField(raw, ['NISN / NIP', 'NISN', 'NIP', 'nisn', 'nip']);
        const classLabel = getField(raw, ['Nama Kelas', 'Kelas', 'kelasId', 'Class']);
        const email = getField(raw, ['Email', 'email']);
        const phone = getField(raw, ['No. HP', 'No HP', 'HP', 'Telepon', 'phone', 'WhatsApp']);
        const teacherRef = getField(raw, ['Username Guru Pembina', 'Guru Pembina', 'assignedGuruId']);
        const childRef = getField(raw, ['Username Anak (Orang Tua)', 'Username Anak', 'Nama Anak', 'siswaId']);
        const relationship = getField(raw, ['Hubungan Keluarga', 'Hubungan', 'relationship']) || 'Orang Tua / Wali';

        let error = '';
        if (!fullName) error = 'Nama lengkap kosong';
        else if (!rawUsername) error = 'Username kosong';
        else if (existingUsernames.has(rawUsername)) error = `Username "${rawUsername}" sudah ada`;
        else if (seenFileUsernames.has(rawUsername)) error = `Username "${rawUsername}" ganda di file`;
        else if (!role) error = `Peran "${rawRole || '(kosong)'}" tidak valid`;

        if (rawUsername) seenFileUsernames.add(rawUsername);

        const kelasId = classLabel ? findClassId(classLabel, classes) : undefined;
        if (!error && classLabel && !kelasId && (role === 'siswa' || role === 'guru')) {
          error = `Kelas "${classLabel}" tidak ditemukan`;
        }

        return {
          rowNumber,
          fullName,
          username: rawUsername,
          role: role || 'siswa',
          password,
          nisnNip,
          classLabel,
          kelasId,
          email,
          phone,
          childRef,
          teacherRef,
          relationship,
          valid: !error,
          error: error || undefined
        };
      });

      setParsedRows(results);
    } catch (err: any) {
      setParseError('Gagal membaca berkas Excel/CSV: ' + (err?.message || 'Format tidak didukung'));
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const validRows = parsedRows.filter(r => r.valid);
  const invalidRows = parsedRows.filter(r => !r.valid);

  const handleConfirmImport = () => {
    if (validRows.length === 0 || isImporting) return;
    setIsImporting(true);

    try {
      const currentUsers = storageService.getUsers();
      const newInputs: Omit<User, 'id' | 'createdAt'>[] = validRows.map(row => {
        const base: Omit<User, 'id' | 'createdAt'> = {
          username: row.username,
          password: row.password,
          fullName: row.fullName,
          role: row.role,
          status: 'active',
          email: row.email || undefined,
          phone: row.phone || undefined
        };

        if (row.role === 'siswa') {
          base.nisn = row.nisnNip || undefined;
          base.kelasId = row.kelasId || classes[0]?.id;
          if (row.teacherRef) {
            const matchedTeacher = currentUsers.find(
              u => u.role === 'guru' && (u.username.toLowerCase() === row.teacherRef.toLowerCase() || u.fullName.toLowerCase() === row.teacherRef.toLowerCase())
            );
            if (matchedTeacher) base.assignedGuruId = matchedTeacher.id;
          }
        } else if (row.role === 'guru') {
          base.nip = row.nisnNip || undefined;
          if (row.kelasId) base.kelasId = row.kelasId;
        } else if (row.role === 'orang_tua') {
          base.relationship = row.relationship || 'Orang Tua / Wali';
          if (row.childRef) {
            const matchedChild = currentUsers.find(
              u =>
                u.role === 'siswa' &&
                (u.username.toLowerCase() === row.childRef.toLowerCase() ||
                  u.nisn === row.childRef ||
                  u.fullName.toLowerCase() === row.childRef.toLowerCase())
            );
            if (matchedChild) {
              base.siswaId = matchedChild.id;
              base.linkedSiswaIds = [matchedChild.id];
            }
          }
        }

        return base;
      });

      const created = storageService.addUsersBulk(newInputs, currentUser.fullName, 'admin');

      // Second pass: link parent->child or student->teacher for users created together in the same batch
      const allUsersNow = storageService.getUsers();
      created.forEach((createdUser, idx) => {
        const srcRow = validRows[idx];
        if (createdUser.role === 'orang_tua' && !createdUser.siswaId && srcRow.childRef) {
          const matchedChild = allUsersNow.find(
            u =>
              u.role === 'siswa' &&
              (u.username.toLowerCase() === srcRow.childRef.toLowerCase() ||
                u.nisn === srcRow.childRef ||
                u.fullName.toLowerCase() === srcRow.childRef.toLowerCase())
          );
          if (matchedChild) {
            storageService.updateUser(
              createdUser.id,
              { siswaId: matchedChild.id, linkedSiswaIds: [matchedChild.id] },
              currentUser.fullName,
              'admin'
            );
          }
        } else if (createdUser.role === 'siswa' && !createdUser.assignedGuruId && srcRow.teacherRef) {
          const matchedTeacher = allUsersNow.find(
            u =>
              u.role === 'guru' &&
              (u.username.toLowerCase() === srcRow.teacherRef.toLowerCase() ||
                u.fullName.toLowerCase() === srcRow.teacherRef.toLowerCase())
          );
          if (matchedTeacher) {
            storageService.updateUser(
              createdUser.id,
              { assignedGuruId: matchedTeacher.id },
              currentUser.fullName,
              'admin'
            );
          }
        }
      });

      onImported(created.length);
      onClose();
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-700 to-purple-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">
                Import Tambah Pengguna Massal (Excel / CSV)
              </h3>
              <span className="text-[11px] text-purple-200 block">
                Tambahkan banyak akun Siswa, Guru, atau Orang Tua sekaligus
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto text-xs">
          {/* Step 1 & 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="font-extrabold text-slate-900 block">
                1. Unduh Template Excel
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Gunakan template resmi agar nama kolom dan format peran sesuai dengan sistem.
              </p>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <Download className="w-4 h-4 text-indigo-600" />
                <span>Unduh Template (.xlsx)</span>
              </button>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="font-extrabold text-slate-900 block">
                2. Pilih File Excel / CSV
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Mendukung format <code className="font-mono">.xlsx</code>, <code className="font-mono">.xls</code>, atau <code className="font-mono">.csv</code>.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelected}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>{fileName ? 'Ganti File Excel/CSV' : 'Pilih File Excel / CSV'}</span>
              </button>
              {fileName && (
                <span className="text-[11px] text-slate-600 block truncate">
                  File: <strong>{fileName}</strong>
                </span>
              )}
            </div>
          </div>

          {parseError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          {/* Preview Results */}
          {parsedRows.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Pratinjau Data Import ({parsedRows.length} baris)</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-bold tabular-nums">
                  <span className="text-emerald-700">✓ {validRows.length} Siap Diimpor</span>
                  {invalidRows.length > 0 && (
                    <span className="text-red-700">✕ {invalidRows.length} Dilewati (Error)</span>
                  )}
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-x-auto max-h-64 overflow-y-auto">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold sticky top-0">
                    <tr>
                      <th className="py-2 px-3">Baris</th>
                      <th className="py-2 px-3">Nama Lengkap</th>
                      <th className="py-2 px-3">Username</th>
                      <th className="py-2 px-3">Peran</th>
                      <th className="py-2 px-3">Kelas</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedRows.map(row => (
                      <tr key={row.rowNumber} className={row.valid ? 'bg-white' : 'bg-red-50/60'}>
                        <td className="py-2 px-3 tabular-nums text-slate-500">#{row.rowNumber}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">{row.fullName || '-'}</td>
                        <td className="py-2 px-3 font-mono text-slate-700">{row.username || '-'}</td>
                        <td className="py-2 px-3">{ROLE_TEXT[row.role] || row.role}</td>
                        <td className="py-2 px-3">{row.classLabel || '-'}</td>
                        <td className="py-2 px-3">
                          {row.valid ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Valid</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-700 font-bold">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{row.error}</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
          >
            Tutup
          </button>
          <button
            type="button"
            disabled={validRows.length === 0 || isImporting}
            onClick={handleConfirmImport}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Import {validRows.length} Pengguna</span>
          </button>
        </div>
      </div>
    </div>
  );
};
