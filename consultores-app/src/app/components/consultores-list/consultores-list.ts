import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConsultorService } from '../../services/consultor.service';
import { AuthService } from '../../services/auth.service';
import { Consultor } from '../../models/consultor.model';

@Component({
  selector: 'app-consultores-list',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './consultores-list.html',
  styleUrl: './consultores-list.css',
})
export class ConsultoresList implements OnInit {
  private consultorService = inject(ConsultorService);
  private authService = inject(AuthService);
  private router = inject(Router);

  consultores: Consultor[] = [];
  filteredConsultores: Consultor[] = [];
  busca: string = '';
  areaFiltro: string = '';
  areas: string[] = [];
  loading: boolean = false;
  allConsultores: Consultor[] = []; // Para extrair todas as áreas disponíveis

  ngOnInit() {
    this.loadAllAreas();
    this.loadConsultores();
  }

  loadAllAreas() {
    // Carrega todos os consultores sem filtro para extrair todas as áreas disponíveis
    this.consultorService.getAll().subscribe({
      next: (data) => {
        this.allConsultores = data;
        this.extractAreas();
      },
      error: (error) => {
        console.error('Erro ao carregar áreas:', error);
      }
    });
  }

  loadConsultores() {
    this.loading = true;
    this.consultorService.getAll(this.busca, this.areaFiltro).subscribe({
      next: (data) => {
        this.consultores = data;
        this.filteredConsultores = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar consultores:', error);
        this.loading = false;
      }
    });
  }

  extractAreas() {
    const areasSet = new Set<string>();
    // Extrai áreas de TODOS os consultores, não apenas dos filtrados
    this.allConsultores.forEach(c => areasSet.add(c.areaEspecializacao));
    this.areas = Array.from(areasSet).sort();
  }

  onBuscaChange() {
    this.loadConsultores();
  }

  onAreaChange() {
    this.loadConsultores();
  }

  deleteConsultor(id: string) {
    if (confirm('Tem certeza que deseja excluir este consultor?')) {
      this.consultorService.delete(id).subscribe({
        next: () => {
          this.loadAllAreas(); // Atualiza a lista de áreas
          this.loadConsultores();
        },
        error: (error) => {
          console.error('Erro ao excluir consultor:', error);
          alert('Erro ao excluir consultor');
        }
      });
    }
  }

  editConsultor(id: string) {
    this.router.navigate(['/consultores/editar', id]);
  }

  newConsultor() {
    this.router.navigate(['/consultores/novo']);
  }

  logout() {
    this.authService.logout();
  }

  // formatDate(date: Date | string | undefined): string {
  //   if (!date) return '';
  //   const d = new Date(date);
  //   return d.toLocaleDateString('pt-BR');
  // }

  formatDate(date: any): string {
  if (!date) return '';

  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return '';
  }

  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
}
