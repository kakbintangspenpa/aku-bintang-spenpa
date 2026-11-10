import { User, Role } from '../types';
import { storageService } from './storageService';

const AUTH_USER_KEY = '7k_auth_session_production_v1';

type AuthListener = (user: User | null) => void;

class AuthService {
  private listeners: AuthListener[] = [];

  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(AUTH_USER_KEY);
      if (!data) {
        // Mode Produksi Nyata: Seluruh akses wajib melalui halaman login saat tautan dibuka
        return null;
      }
      return JSON.parse(data) as User;
    } catch {
      return null;
    }
  }

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      this.notify(user);
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
      this.notify(null);
    }
  }

  subscribe(listener: AuthListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(user: User | null): void {
    this.listeners.forEach(fn => fn(user));
  }

  login(username: string, password: string): { success: boolean; user?: User; error?: string } {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      return { success: false, error: 'Username dan kata sandi wajib diisi.' };
    }

    const users = storageService.getUsers();
    const found = users.find(u => 
      u.username.toLowerCase() === cleanUser || 
      (cleanUser === 'admin' && u.role === 'admin')
    );

    if (!found) {
      return { success: false, error: 'Username tidak ditemukan dalam sistem.' };
    }

    if (found.status === 'inactive') {
      return { success: false, error: 'Akun Anda sedang dinonaktifkan oleh Administrator.' };
    }

    const validPassword = found.password || 'password123';
    if (cleanPass !== validPassword) {
      return { success: false, error: 'Kata sandi yang Anda masukkan salah.' };
    }

    // Update last login
    const updated = storageService.updateUser(found.id, {
      lastLogin: new Date().toISOString()
    }, found.fullName, found.role);

    const sessionUser = updated || found;
    this.setCurrentUser(sessionUser);
    storageService.addAuditLog(sessionUser.fullName, sessionUser.role, 'LOGIN_SUKSES', `Pengguna berhasil login ke sistem sebagai ${sessionUser.role}`);
    return { success: true, user: sessionUser };
  }

  loginAsDemoRole(role: Role): User | null {
    const users = storageService.getUsers();
    let target = users.find(u => u.role === role && u.status === 'active');
    if (!target) {
      target = users.find(u => u.role === role);
    }
    if (target) {
      this.setCurrentUser(target);
      storageService.addAuditLog(target.fullName, target.role, 'DEMO_SWITCH', `Beralih peran demo ke: ${role.toUpperCase()}`);
      return target;
    }
    return null;
  }

  loginAsUserId(userId: string): User | null {
    const users = storageService.getUsers();
    const target = users.find(u => u.id === userId);
    if (target) {
      this.setCurrentUser(target);
      storageService.addAuditLog(target.fullName, target.role, 'USER_SWITCH', `Berganti ke akun: ${target.fullName} (${target.role})`);
      return target;
    }
    return null;
  }

  logout(): void {
    const current = this.getCurrentUser();
    if (current) {
      storageService.addAuditLog(current.fullName, current.role, 'LOGOUT', 'Pengguna keluar dari sistem');
    }
    this.setCurrentUser(null);
  }

  resetUserPassword(userId: string, newPassword: string, adminName: string): boolean {
    const updated = storageService.updateUser(userId, { password: newPassword }, adminName, 'admin');
    return !!updated;
  }
}

export const authService = new AuthService();
