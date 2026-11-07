import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

export interface Item {
  iditem: number;
  idcategoria: number;
  categoria?: string;
  item: string;
  descricao_item: string;
  preco: number;
  tipo_item: string;
  ativo_produto_servico: boolean;
}

@Component({
  selector: 'app-catalogo-servico',
  imports: [CommonModule],
  templateUrl: './catalogo-servico.html',
  styleUrls: ['./catalogo-servico.css']
})
export class CatalogoServico implements OnInit {
  private readonly apiUrl = 'https://localhost:7000/api/item'; // ajuste para a sua rota

  categorias: string[] = ['Todas', 'Maquiagem', 'Skincare', 'Cabelos', 'Perfumaria', 'Unhas'];
  categoriaSelecionada = 'Todas';

  itens: Item[] = [];
  itensFiltrados: Item[] = [];

  carregando = false;
  erro = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.carregarItens();
  }

  carregarItens(): void {
    this.carregando = true;
    this.erro = '';

    this.http.get<Item[]>(this.apiUrl).subscribe({
      next: (dados) => {
        this.itens = dados.filter(i => i.ativo_produto_servico);
        this.aplicarFiltro();
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar o catálogo.';
        this.carregando = false;
      }
    });
  }

  filtrar(categoria: string): void {
    this.categoriaSelecionada = categoria;
    this.aplicarFiltro();
  }

  private aplicarFiltro(): void {
    this.itensFiltrados = this.categoriaSelecionada === 'Todas'
      ? [...this.itens]
      : this.itens.filter(i => i.categoria === this.categoriaSelecionada);
  }
}