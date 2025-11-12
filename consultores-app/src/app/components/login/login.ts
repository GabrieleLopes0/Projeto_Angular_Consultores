import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isRegistering: boolean = false;

  toggleMode() {
    this.isRegistering = !this.isRegistering;
    this.errorMessage = '';
  }

  async submit() {
    console.log('submit() chamado');
    this.errorMessage = '';
    
    if (!this.email || !this.password) {
      console.log('Campos vazios');
      this.errorMessage = 'Por favor, preencha todos os campos';
      return;
    }
    
    console.log('Campos preenchidos, email:', this.email);

    try {
      console.log('Tentando:', this.isRegistering ? 'registrar' : 'login', this.email);
      if (this.isRegistering) {
        await this.authService.register(this.email, this.password);
        console.log('Registro bem-sucedido');
      } else {
        await this.authService.login(this.email, this.password);
        console.log('Login bem-sucedido');
      }
    } catch (error: any) {
      console.error('Erro no login/registro:', error);
      console.error('Código do erro:', error?.code);
      console.error('Mensagem do erro:', error?.message);
      
      let errorMsg = 'Erro ao fazer login/registro';
      if (error?.code === 'auth/user-not-found') {
        errorMsg = 'Usuário não encontrado. Verifique o email.';
      } else if (error?.code === 'auth/wrong-password') {
        errorMsg = 'Senha incorreta.';
      } else if (error?.code === 'auth/invalid-email') {
        errorMsg = 'Email inválido.';
      } else if (error?.code === 'auth/email-already-in-use') {
        errorMsg = 'Este email já está em uso.';
      } else if (error?.code === 'auth/weak-password') {
        errorMsg = 'A senha deve ter pelo menos 6 caracteres.';
      } else if (error?.message) {
        errorMsg = error.message;
      }
      
      this.errorMessage = errorMsg;
    }
  }
}
