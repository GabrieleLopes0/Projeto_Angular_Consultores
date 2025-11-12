import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConsultorService } from '../../services/consultor.service';
import { Consultor } from '../../models/consultor.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-consultor-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './consultor-form.html',
  styleUrl: './consultor-form.css',
})
export class ConsultorForm implements OnInit {
  private consultorService = inject(ConsultorService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  consultor: Consultor = {
    nome: '',
    email: '',
    telefone: '',
    areaEspecializacao: ''
  };

  password: string = '';
  currentPassword: string = '';

  isEditMode: boolean = false;
  consultorId: string | null = null;
  errorMessage: string = '';
  isAdmin: boolean = false;
  currentUserEmail: string | null = null;
  canEditThisConsultor: boolean = true;

  async ngOnInit() {
    this.isAdmin = await this.authService.isAdmin();
    this.currentUserEmail = await this.authService.getCurrentUserEmail();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.consultorId = id;
      this.loadConsultor(id);
    } else {
      if (!this.isAdmin) {
        this.errorMessage = 'Apenas administradores podem criar novos consultores';
        setTimeout(() => {
          this.router.navigate(['/consultores']);
        }, 2000);
      }
    }
  }

  loadConsultor(id: string) {
    this.consultorService.getById(id).subscribe({
      next: async (data) => {
        this.consultor = data;
        
        if (!this.isAdmin && this.consultor.email !== this.currentUserEmail) {
          this.errorMessage = 'Você só pode editar seu próprio perfil';
          this.canEditThisConsultor = false;
          setTimeout(() => {
            this.router.navigate(['/consultores']);
          }, 2000);
        }
      },
      error: (error) => {
        console.error('Erro ao carregar consultor:', error);
        this.errorMessage = 'Erro ao carregar consultor';
      }
    });
  }

  async submit() {
    if (!this.canEditThisConsultor) {
      return;
    }

    if (!this.validateForm()) {
      return;
    }

    if (!this.isAdmin && this.isEditMode && this.consultor.email !== this.currentUserEmail) {
      this.errorMessage = 'Você só pode editar seu próprio perfil';
      return;
    }

    if (this.isEditMode && this.consultorId) {
      if (this.password && this.password.trim() !== '') {
        if (!this.currentPassword || this.currentPassword.trim() === '') {
          this.errorMessage = 'Para alterar a senha, é necessário informar a senha atual';
          return;
        }
        if (this.password.length < 6) {
          this.errorMessage = 'A nova senha deve ter pelo menos 6 caracteres';
          return;
        }
      }

      this.consultorService.update(this.consultorId, this.consultor).subscribe({
        next: async () => {
          if (this.password && this.password.trim() !== '' && this.currentPassword && this.currentPassword.trim() !== '') {
            try {
              await this.authService.updatePasswordByEmail(this.consultor.email, this.currentPassword, this.password);
              this.password = '';
              this.currentPassword = '';
            } catch (error: any) {
              console.error('Erro ao atualizar senha:', error);
              if (error.code === 'auth/wrong-password') {
                this.errorMessage = 'Senha atual incorreta';
              } else if (error.code === 'auth/user-not-found') {
                this.errorMessage = 'Usuário não encontrado no Firebase';
              } else {
                this.errorMessage = error.message || 'Erro ao atualizar senha';
              }
              return;
            }
          }
          setTimeout(() => {
            this.router.navigate(['/consultores']);
          }, 200);
        },
        error: (error) => {
          console.error('Erro ao atualizar consultor:', error);
          this.errorMessage = error.error?.error || 'Erro ao atualizar consultor';
        }
      });
    } else {
      this.authService.register(this.consultor.email, this.password)
        .then(() => {
          this.consultorService.create(this.consultor).subscribe({
            next: () => {
              setTimeout(() => {
                this.router.navigate(['/consultores']);
              }, 200);
            },
            error: (error) => {
              console.error('Erro ao criar consultor:', error);
              this.errorMessage = error.error?.error || 'Erro ao criar consultor';
            }
          });
        })
        .catch((error: any) => {
          console.error('Erro ao registrar usuário:', error);

          if (error.code === 'auth/email-already-in-use') {
            this.errorMessage = 'Este email já está sendo usado para login';
          } else {
            this.errorMessage = error.message || 'Erro ao registrar usuário';
          }
        });

    }
  }

  validateForm(): boolean {

    this.errorMessage = '';

    if (!this.consultor.nome || !this.consultor.email ||
        !this.consultor.telefone || !this.consultor.areaEspecializacao) {
      this.errorMessage = 'Todos os campos são obrigatórios';
      return false;
    }

    if (!this.isEditMode && !this.password) {
      this.errorMessage = 'Senha é obrigatória';
            return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.consultor.email)) {
      this.errorMessage = 'Email inválido';
      return false;
    }

    return true;
  }


  cancel() {
    this.router.navigate(['/consultores']);
  }
}
