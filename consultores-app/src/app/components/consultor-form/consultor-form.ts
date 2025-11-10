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

  isEditMode: boolean = false;
  consultorId: string | null = null;
  errorMessage: string = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.consultorId = id;
      this.loadConsultor(id);
    }
  }

  loadConsultor(id: string) {
    this.consultorService.getById(id).subscribe({
      next: (data) => {
        this.consultor = data;
      },
      error: (error) => {
        console.error('Erro ao carregar consultor:', error);
        this.errorMessage = 'Erro ao carregar consultor';
      }
    });
  }

  submit() {
    if (!this.validateForm()) {
      return;
    }

    if (this.isEditMode && this.consultorId) {
      this.consultorService.update(this.consultorId, this.consultor).subscribe({
        next: () => {
          this.router.navigate(['/consultores']);
        },
        error: (error) => {
          console.error('Erro ao atualizar consultor:', error);
          this.errorMessage = error.error?.error || 'Erro ao atualizar consultor';
        }
      });
    } else {
      // this.consultorService.create(this.consultor).subscribe({
      //   next: () => {
      //     this.router.navigate(['/consultores']);
      //   },
      //   error: (error) => {
      //     console.error('Erro ao criar consultor:', error);
      //     this.errorMessage = error.error?.error || 'Erro ao criar consultor';
      //   }
      // });
            // CRIAR: 1) registra no Firebase  2) cria consultor no backend
      this.authService.register(this.consultor.email, this.password)
        .then(() => {
          this.consultorService.create(this.consultor).subscribe({
            next: () => {
              this.router.navigate(['/consultores']);
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

        // senha só obrigatória na criação
    if (!this.isEditMode && !this.password) {
      this.errorMessage = 'Senha é obrigatória para novo consultor';
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
