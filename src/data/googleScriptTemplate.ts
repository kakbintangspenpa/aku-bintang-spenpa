export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * =========================================================================
 * GOOGLE APPS SCRIPT BACKEND CONNECTOR
 * PROYEK: 7 KEBIASAAN ANAK INDONESIA HEBAT
 * =========================================================================
 * Script ini berjalan di Google Apps Script yang terhubung dengan akun Google
 * khusus sekolah. Berfungsi mengelola database Google Sheets dan penyimpanan
 * folder dokumen/foto di Google Drive secara aman tanpa mengekspos kredensial ke publik.
 *
 * CARA PEMASANGAN (5 MENIT):
 * 1. Buka https://script.google.com dengan akun Google Sekolah.
 * 2. Klik "Proyek Baru" (New Project).
 * 3. Hapus kode bawaan dan tempelkan SELURUH kode di bawah ini.
 * 4. Klik "Jalankan" -> "setupInitialStorage" untuk membuat struktur folder & sheet otomatis.
 * 5. Klik "Terapkan" (Deploy) -> "Penerapan Baru" (New Deployment).
 * 6. Pilih Jenis: "Aplikasi Web" (Web app).
 * 7. Konfigurasi:
 *    - Jalankan sebagai: "Saya" (Akun Google Sekolah)
 *    - Yang memiliki akses: "Siapa saja" (Anyone)
 * 8. Salin URL Aplikasi Web yang dihasilkan dan tempelkan pada menu
 *    "Pengaturan Google Drive & Sheets" di Dashboard Admin aplikasi ini.
 * =========================================================================
 */

const ROOT_FOLDER_NAME = "7-KEBIASAAN-ANAK-INDONESIA-HEBAT";
const SUB_FOLDERS = [
  "DATA-PENGGUNA",
  "DATA-SISWA",
  "JURNAL-HARIAN",
  "DOKUMENTASI-SISWA",
  "CATATAN-GURU",
  "LAPORAN-PERKEMBANGAN",
  "ARSIP-ADMIN"
];

const SHEETS_CONFIG = {
  "TB_PENGGUNA": ["ID", "Username", "FullName", "Role", "Status", "KelasID", "Email", "NISN_NIP", "CreatedAt", "LastLogin"],
  "TB_KELAS": ["ID", "NamaKelas", "Tingkat", "WaliKelasID", "TahunAjaran", "TotalSiswa"],
  "TB_RELASI_KELUARGA": ["ID", "OrangTuaID", "SiswaID", "HubunganKeluarga", "NomorWhatsApp"],
  "TB_JURNAL_HARIAN": ["ID", "SiswaID", "SiswaName", "KelasID", "HabitID", "Tanggal", "Waktu", "Deskripsi", "Refleksi", "PhotoDriveID", "Status", "GuruVerified", "GuruFeedback", "CreatedAt"],
  "TB_PEMBINAAN_GURU": ["ID", "SiswaID", "GuruID", "Tanggal", "Kendala", "SaranSolusi", "TargetPerbaikan", "TglEvaluasiBerikutnya", "StatusTindakLanjut"],
  "TB_TANGGAPAN_ORTU": ["ID", "SiswaID", "OrangTuaID", "Tanggal", "PesanDukungan", "PengamatanRumah", "CreatedAt"],
  "TB_AUDIT_LOG": ["ID", "UserID", "UserName", "Role", "Aksi", "Keterangan", "Timestamp"]
};

// 1. Inisialisasi Folder Google Drive dan Google Sheets
function setupInitialStorage() {
  const rootFolder = getOrCreateFolder(ROOT_FOLDER_NAME);
  const folderMap = {};
  
  SUB_FOLDERS.forEach(subName => {
    const sub = getOrCreateSubFolder(rootFolder, subName);
    folderMap[subName] = sub.getId();
  });
  
  // Buat Google Spreadsheet database utama jika belum ada di dalam ROOT_FOLDER
  let spreadsheet;
  const files = rootFolder.getFilesByName("DATABASE_7_KEBIASAAN_HEBAT");
  if (files.hasNext()) {
    spreadsheet = SpreadsheetApp.open(files.next());
  } else {
    spreadsheet = SpreadsheetApp.create("DATABASE_7_KEBIASAAN_HEBAT");
    const driveFile = DriveApp.getFileById(spreadsheet.getId());
    driveFile.moveTo(rootFolder);
  }
  
  // Buat setiap Sheet tabel dengan header-nya
  Object.keys(SHEETS_CONFIG).forEach(sheetName => {
    let sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
      sheet.appendRow(SHEETS_CONFIG[sheetName]);
      // Format header
      sheet.getRange(1, 1, 1, SHEETS_CONFIG[sheetName].length)
        .setBackground("#1E3A8A")
        .setFontColor("#FFFFFF")
        .setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
  });

  // Hapus Sheet1 default jika ada
  const defaultSheet = spreadsheet.getSheetByName("Sheet1");
  if (defaultSheet && spreadsheet.getSheets().length > 1) {
    spreadsheet.deleteSheet(defaultSheet);
  }
  
  Logger.log("✅ Struktur Google Drive dan Google Sheets berhasil disiapkan!");
  Logger.log("Folder Utama ID: " + rootFolder.getId());
  Logger.log("Spreadsheet ID: " + spreadsheet.getId());
  return {
    rootFolderId: rootFolder.getId(),
    spreadsheetId: spreadsheet.getId(),
    subFolders: folderMap
  };
}

// 2. Handler HTTP GET (Untuk cek koneksi & status)
function doGet(e) {
  const result = {
    status: "ok",
    app: "7 Kebiasaan Anak Indonesia Hebat - Google Drive & Sheets Connector",
    timestamp: new Date().toISOString(),
    message: "Koneksi backend Google Apps Script aktif dan siap menerima data."
  };
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// 3. Handler HTTP POST (Menerima jurnal, sinkronisasi data, simpan foto dokumentasi)
function doPost(e) {
  try {
    const requestData = JSON.parse(e.postData.contents);
    const action = requestData.action;
    let response = { success: true };

    const rootFolder = getOrCreateFolder(ROOT_FOLDER_NAME);
    const docFolder = getOrCreateSubFolder(rootFolder, "DOKUMENTASI-SISWA");

    switch (action) {
      case "PING":
        response.message = "Pong! Backend Google aktif.";
        break;

      case "UPLOAD_PHOTO":
        // Upload base64 foto siswa ke folder Google Drive DOKUMENTASI-SISWA
        if (requestData.base64Data && requestData.fileName) {
          const contentType = requestData.contentType || "image/jpeg";
          const decodedData = Utilities.base64Decode(requestData.base64Data.split(",")[1] || requestData.base64Data);
          const blob = Utilities.newBlob(decodedData, contentType, requestData.fileName);
          const file = docFolder.createFile(blob);
          response.fileId = file.getId();
          response.viewUrl = file.getUrl();
        }
        break;

      case "SYNC_ALL":
        // Simpan snapshot lengkap data ke Google Sheets & arsip JSON di ARSIP-ADMIN
        const arsipFolder = getOrCreateSubFolder(rootFolder, "ARSIP-ADMIN");
        const backupName = "BACKUP_DATA_" + Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd_HH-mm") + ".json";
        arsipFolder.createFile(backupName, JSON.stringify(requestData.payload, null, 2), "application/json");
        response.message = "Sinkronisasi cadangan ke Google Drive berhasil disimpan.";
        break;

      default:
        response = { success: false, error: "Aksi tidak dikenal: " + action };
    }

    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Helper: Ambil atau buat folder
function getOrCreateFolder(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(folderName);
}

function getOrCreateSubFolder(parentFolder, subFolderName) {
  const folders = parentFolder.getFoldersByName(subFolderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return parentFolder.createFolder(subFolderName);
}
`;
