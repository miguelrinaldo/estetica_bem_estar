import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Produto {
  idItem: number;
  item: string;
  descricaoItem: string;
  preco: number;
  categoria: string;
  ativo: boolean;
}

@Component({
  selector: 'app-catalogoproduto',
  standalone: true,
  imports: [NgFor, NgIf, CurrencyPipe],
  templateUrl: './catalogoproduto.component.html',
  styleUrls: ['./catalogoproduto.component.css']
})
export class catalogo_produto implements OnInit {
  private readonly http = inject(HttpClient);

  // Ajuste para a URL da sua API
  private readonly apiUrl = 'https://localhost:7000/api/item';

  produtos: Produto[] = [];
  busca = '';
  categoriaSelecionada = 'Todas';
  carregando = false;
  mensagemErro = '';

  ngOnInit(): void {
    this.carregarProdutos();
  }

  // Botões de categoria, gerados a partir dos dados
  get categorias(): string[] {
    const nomes = [...new Set(this.produtos.map(p => p.categoria))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, 'pt-BR'));
    return ['Todas', ...nomes];
  }

  get produtosFiltrados(): Produto[] {
    const termo = this.busca.trim().toLowerCase();

    return this.produtos
      .filter(p => this.categoriaSelecionada === 'Todas' || p.categoria === this.categoriaSelecionada)
      .filter(p => !termo || p.item.toLowerCase().includes(termo))
      .sort((a, b) => a.item.localeCompare(b.item, 'pt-BR'));
  }

  get contagem(): string {
    const n = this.produtosFiltrados.length;
    return `${n} ${n === 1 ? 'item encontrado' : 'itens encontrados'}`;
  }

  onBusca(evento: Event): void {
    this.busca = (evento.target as HTMLInputElement).value;
  }

  selecionarCategoria(categoria: string): void {
    this.categoriaSelecionada = categoria;
  }

  private carregarProdutos(): void {
    this.carregando = true;
    this.mensagemErro = '';

    this.http.get<Produto[]>(this.apiUrl).subscribe({
      next: (dados) => {
        this.produtos = dados.filter(p => p.ativo);
        this.carregando = false;
      },
      error: () => {
        this.mensagemErro = 'Erro ao carregar o catálogo. Tente novamente.';
        this.carregando = false;
      }
    });
  }
}