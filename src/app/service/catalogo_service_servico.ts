import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { catalogo_service} from '../models/catalogo';

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private readonly http = inject(HttpClient);

  // Ajuste para a URL da sua API
  private readonly apiUrl = 'https://localhost:7000/api/item';

  // Lista só os itens ativos
  listar(): Observable<catalogo_service[]> {
    return this.http.get<catalogo_service[]>(this.apiUrl).pipe(
      map(itens => itens.filter(i => i.ativo))
    );
  }

  // Use se a API filtrar por categoria (GET /api/item?categoria=Skincare)
  listarPorCategoria(categoria: string): Observable<catalogo_service[]> {
    const params = new HttpParams().set('categoria', categoria);
    return this.http.get<catalogo_service[]>(this.apiUrl, { params }).pipe(
      map(itens => itens.filter(i => i.ativo))
    );
  }

  buscarPorId(id: number): Observable<catalogo_service> {
    return this.http.get<catalogo_service>(`${this.apiUrl}/${id}`);
  }
}