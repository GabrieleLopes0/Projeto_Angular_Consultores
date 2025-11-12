import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged, User, updatePassword, deleteUser, getAuth, fetchSignInMethodsForEmail } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  async isAdmin(): Promise<boolean> {
    const user = this.auth.currentUser;
    if (!user) {
      return false;
    }
    
    try {
      const tokenResult = await user.getIdTokenResult();
      return tokenResult.claims['role'] === 'admin';
    } catch (error) {
      console.error('Erro ao verificar role:', error);
      return false;
    }
  }

  async getUserRole(): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) {
      return 'user';
    }
    
    try {
      const tokenResult = await user.getIdTokenResult();
      return tokenResult.claims['role'] || 'user';
    } catch (error) {
      console.error('Erro ao obter role:', error);
      return 'user';
    }
  }

  async getCurrentUserEmail(): Promise<string | null> {
    const user = this.auth.currentUser;
    return user?.email || null;
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      await userCredential.user.getIdToken(true);
      this.router.navigate(['/consultores']);
    } catch (error) {
      throw error;
    }
  }

  async register(email: string, password: string): Promise<void> {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
      this.router.navigate(['/consultores']);
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(newPassword: string): Promise<void> {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      await updatePassword(user, newPassword);
    } catch (error) {
      throw error;
    }
  }

  async updatePasswordByEmail(email: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, currentPassword);
      await updatePassword(userCredential.user, newPassword);
      await signOut(this.auth);
    } catch (error) {
      throw error;
    }
  }

  async deleteUserByEmail(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      await deleteUser(userCredential.user);
    } catch (error: any) {
      if (error?.code === 'auth/user-not-found') {
        return;
      }
      throw error;
    }
  }

  async checkUserExists(email: string): Promise<boolean> {
    try {
      const methods = await fetchSignInMethodsForEmail(this.auth, email);
      return methods.length > 0;
    } catch (error) {
      return false;
    }
  }

  isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
}

