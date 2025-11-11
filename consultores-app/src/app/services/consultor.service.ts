import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consultor } from '../models/consultor.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsultorService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/consultores`;

  getAll(busca?: string, area?: string): Observable<Consultor[]> {
    let params = new HttpParams();
    if (busca) {
      params = params.set('busca', busca);
    }
    if (area) {
      params = params.set('area', area);
    }

    console.log('Buscando consultores em:', this.apiUrl);
    return this.http.get<Consultor[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Consultor> {
    return this.http.get<Consultor>(`${this.apiUrl}/${id}`);
  }

  create(consultor: Consultor): Observable<Consultor> {
    return this.http.post<Consultor>(this.apiUrl, consultor);
  }

  update(id: string, consultor: Consultor): Observable<Consultor> {
    return this.http.put<Consultor>(`${this.apiUrl}/${id}`, consultor);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

