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
  isAdmin: boolean = false;
  currentUserEmail: string | null = null;

  async ngOnInit() {
    await this.checkPermissions();
    this.refreshData();

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(async (event: NavigationEnd) => {
        const currentUrl = event.urlAfterRedirects || event.url;
        if (currentUrl === '/consultores' || currentUrl.startsWith('/consultores')) {
          await this.checkPermissions();
          setTimeout(() => {
            this.refreshData();
          }, 50);
        }
      });
  }

  async checkPermissions() {
    try {
      const user = this.authService.getCurrentUser();
      if (user) {
        await user.getIdToken(true);
      }
      this.isAdmin = await this.authService.isAdmin();
      this.currentUserEmail = await this.authService.getCurrentUserEmail();
      console.log('Permissões verificadas - isAdmin:', this.isAdmin, 'email:', this.currentUserEmail);
    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
      this.isAdmin = false;
      this.currentUserEmail = await this.authService.getCurrentUserEmail();
    }
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

  loadConsultores(retryCount: number = 0) {
    this.loading = true;
    this.consultorService.getAll(this.busca, this.areaFiltro).subscribe({
      next: (data) => {
        this.consultores = data;
        this.filteredConsultores = data;
        this.loading = false;
      },
      error: (error) => {
        const apiUrl = this.consultorService['apiUrl'] || 'N/A';
        console.error('Erro ao carregar consultores:', error);
        console.error('URL tentada:', error.url || apiUrl);
        console.error('Status:', error.status || 'N/A');
        
        if (error.status === 503 && retryCount < 3 && apiUrl.includes('onrender.com')) {
          console.log(`Tentativa ${retryCount + 1}/3: Backend iniciando, aguardando 5 segundos...`);
          this.loading = false;
          setTimeout(() => {
            this.loadConsultores(retryCount + 1);
          }, 5000);
          return;
        }
        
        this.loading = false;
        this.consultores = [];
        this.filteredConsultores = [];
        
        let errorMsg = 'Erro ao conectar com o servidor.\n\n';
        errorMsg += `URL: ${apiUrl}\n\n`;
        
        if (error.status === 0 || !error.status) {
          if (apiUrl.includes('localhost')) {
            errorMsg += 'O backend local não está respondendo.\n';
            errorMsg += 'Verifique se o backend está rodando:\n';
            errorMsg += '1. Abra um terminal\n';
            errorMsg += '2. cd backend\n';
            errorMsg += '3. npm start\n';
            errorMsg += '\nO backend deve estar em: http://localhost:3001';
          } else {
            errorMsg += 'O backend remoto não está respondendo.\n';
            errorMsg += 'Verifique se o backend no Render está online:\n';
            errorMsg += 'https://projeto-angular-consultores.onrender.com';
          }
        } else if (error.status === 500) {
          errorMsg += 'Erro no servidor (500).\nVerifique os logs do backend.';
        } else if (error.status === 404) {
          errorMsg += 'Endpoint não encontrado (404).\nVerifique a URL da API.';
        } else if (error.status === 401) {
          errorMsg += 'Não autorizado (401).\nFaça login novamente.';
        } else if (error.status === 503) {
          errorMsg += 'Serviço temporariamente indisponível (503).\n';
          errorMsg += 'O backend no Render está iniciando (pode levar 30-60 segundos).\n';
          errorMsg += 'Aguarde alguns segundos e recarregue a página.';
        } else {
          errorMsg += `Erro HTTP ${error.status}: ${error.message || 'Erro desconhecido'}`;
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

  async editOwnProfile() {
    if (!this.currentUserEmail) {
      return;
    }
    
    const ownConsultor = this.consultores.find(c => c.email === this.currentUserEmail);
    if (ownConsultor && ownConsultor._id) {
      this.router.navigate(['/consultores/editar', ownConsultor._id]);
    } else {
      alert('Seu perfil não foi encontrado. Entre em contato com um administrador.');
    }
  }

  newConsultor() {
    this.router.navigate(['/consultores/novo']);
  }

  canEdit(consultor: Consultor): boolean {
    if (this.isAdmin) {
      return true;
    }
    return consultor.email === this.currentUserEmail;
  }

  canDelete(consultor: Consultor): boolean {
    return this.isAdmin;
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
