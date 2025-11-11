import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConsultorService } from '../../services/consultor.service';
import { AuthService } from '../../services/auth.service';
import { Consultor } from '../../models/consultor.model';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-consultores-list',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './consultores-list.html',
  styleUrl: './consultores-list.css',
})
export class ConsultoresList implements OnInit, OnDestroy {
  private consultorService = inject(ConsultorService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private routerSubscription?: Subscription;

  consultores: Consultor[] = [];
  filteredConsultores: Consultor[] = [];
  busca: string = '';
  areaFiltro: string = '';
  areas: string[] = [];
  loading: boolean = false;
  allConsultores: Consultor[] = [];

  ngOnInit() {
    this.refreshData();

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const currentUrl = event.urlAfterRedirects || event.url;
        if (currentUrl === '/consultores' || currentUrl.startsWith('/consultores')) {
          setTimeout(() => {
            this.refreshData();
          }, 50);
        }
      });
  }

  refreshData() {
    this.loadAllAreas();
    this.loadConsultores();
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  loadAllAreas() {
    this.consultorService.getAll().subscribe({
      next: (data) => {
        this.allConsultores = data || [];
        this.extractAreas();
      },
      error: (error) => {
        console.error('Erro ao carregar áreas:', error);
        this.allConsultores = [];
        this.areas = [];
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
        console.error('URL tentada:', error.url || 'N/A');
        console.error('Status:', error.status || 'N/A');
        this.loading = false;
        this.consultores = [];
        this.filteredConsultores = [];
        
        let errorMsg = 'Erro ao conectar com o servidor.';
        if (error.status === 0) {
          errorMsg += '\n\nO backend não está respondendo. Verifique se está rodando em http://localhost:3001';
        } else if (error.status === 500) {
          errorMsg += '\n\nErro no servidor (500). Verifique os logs do backend.';
        } else if (error.status === 404) {
          errorMsg += '\n\nEndpoint não encontrado. Verifique a URL da API.';
        }
        alert(errorMsg);
      }
    });
  }

  extractAreas() {
    const areasSet = new Set<string>();
    this.allConsultores.forEach(c => {
      if (c.areaEspecializacao && c.areaEspecializacao.trim() !== '') {
        areasSet.add(c.areaEspecializacao.trim());
      }
    });
    this.areas = Array.from(areasSet).sort();
    console.log('Áreas extraídas:', this.areas);
  }

  onBuscaChange() {
    this.loadConsultores();
  }

  onAreaChange() {
    this.loadConsultores();
  }

  deleteConsultor(id: string) {
    if (confirm('Tem certeza que deseja excluir este consultor? A credencial do Firebase também será removida.')) {
      this.consultorService.delete(id).subscribe({
        next: (response: any) => {
          this.loadAllAreas();
          this.loadConsultores();
          if (response?.warning) {
            alert('⚠️ Consultor excluído, mas a credencial do Firebase pode ainda existir.\n\nConfigure o Firebase Admin SDK no backend para exclusão automática.\nVeja: backend/CONFIGURAR_FIREBASE_ADMIN.md');
          }
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
