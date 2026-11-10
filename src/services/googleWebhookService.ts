import { JournalEntry } from '../types';

export interface WebhookResponse {
  success: boolean;
  message: string;
  error?: string;
  fileId?: string;
  viewUrl?: string;
}

export const googleWebhookService = {
  /**
   * Mengirim request HTTP POST ke Google Apps Script Web App.
   * Menggunakan Content-Type text/plain agar tidak memicu CORS OPTIONS preflight
   * dan mode: 'no-cors' karena Apps Script melakukan redirect domain saat eksekusi.
   */
  async sendPost(webhookUrl: string, payload: any): Promise<WebhookResponse> {
    const cleanUrl = webhookUrl?.trim();
    if (!cleanUrl || !cleanUrl.startsWith('http')) {
      return {
        success: false,
        message: 'URL Webhook Google Apps Script belum disetel. Buka menu Admin > Drive & Sheets.'
      };
    }

    try {
      await fetch(cleanUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload),
        mode: 'no-cors'
      });

      return {
        success: true,
        message: 'Data berhasil dikirimkan ke Google Apps Script (Drive & Sheets).'
      };
    } catch (err: any) {
      console.error('Error saat menghubungi Webhook Google Apps Script:', err);
      return {
        success: false,
        message: 'Gagal terhubung ke Google Apps Script: ' + (err?.message || 'Jaringan bermasalah')
      };
    }
  },

  /**
   * Mengunggah berkas foto kegiatan siswa ke Google Drive (DOKUMENTASI-SISWA)
   */
  async uploadPhoto(webhookUrl: string, base64Data: string, fileName: string): Promise<WebhookResponse> {
    return this.sendPost(webhookUrl, {
      action: 'UPLOAD_PHOTO',
      base64Data,
      fileName,
      contentType: 'image/jpeg'
    });
  },

  /**
   * Mencatat data jurnal harian siswa ke tabel TB_JURNAL_HARIAN di Google Spreadsheet
   */
  async recordJournal(webhookUrl: string, entry: JournalEntry): Promise<WebhookResponse> {
    return this.sendPost(webhookUrl, {
      action: 'RECORD_JOURNAL',
      entry
    });
  },

  /**
   * Menyimpan arsip cadangan lengkap JSON ke folder ARSIP-ADMIN di Google Drive
   */
  async syncAll(webhookUrl: string, payload: any): Promise<WebhookResponse> {
    return this.sendPost(webhookUrl, {
      action: 'SYNC_ALL',
      payload
    });
  },

  /**
   * Melakukan handshake PING ke backend Google Apps Script
   */
  async ping(webhookUrl: string): Promise<WebhookResponse> {
    return this.sendPost(webhookUrl, {
      action: 'PING'
    });
  }
};
