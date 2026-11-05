import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Item {
  idItem: number;
  categoria: string;
  item: string;
  descricaoItem: string;
  preco: number;
  tipoItem: string;
  ativo: boolean;
}

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [NgFor, NgIf, CurrencyPipe],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class catalogo_service implements OnInit {
  private readonly http = inject(HttpClient);

  // Ajuste para a URL da sua API
  private readonly apiUrl = 'https://localhost:7000/api/item';

  readonly categorias = ['Todas', 'Maquiagem', 'Skincare', 'Cabelos', 'Perfumaria', 'Unhas'];

  itens: Item[] = [];
  categoriaSelecionada = 'Todas';
  carregando = false;
  mensagemErro = '';

  ngOnInit(): void {
    this.carregarItens();
  }

  get itensFiltrados(): Item[] {
    return this.categoriaSelecionada === 'Todas'
      ? this.itens
      : this.itens.filter(i => i.categoria === this.categoriaSelecionada);
  }

  selecionarCategoria(categoria: string): void {
    this.categoriaSelecionada = categoria;
  }

  private carregarItens(): void {
    this.carregando = true;
    this.mensagemErro = '';

    this.http.get<Item[]>(this.apiUrl).subscribe({
      next: (dados) => {
        this.itens = dados.filter(i => i.ativo);
        this.carregando = false;
      },
      error: () => {
        this.mensagemErro = 'Erro ao carregar o catálogo. Tente novamente.';
        this.carregando = false;
      }
    });
  }
}