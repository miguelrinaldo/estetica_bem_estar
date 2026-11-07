import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';

type Ordem = 'nome' | 'menor' | 'maior';

interface Produto {
  idItem: number;
  item: string;
  descricaoItem: string;
  preco: number;
  categoria: string;
  tipoItem: string;
  ativo: boolean;
}

interface FiltroCategoria {
  rotulo: string;
  categoria?: string; // filtra pelo nome da categoria
  tipo?: string;      // filtra pelo tipo do item (produto ou serviço)
}

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [NgFor, NgIf, CurrencyPipe],
  templateUrl: './lista-produto.html',
  styleUrls: ['./lista-produto.css']
})
export class ProdutosComponent implements OnInit {
  private readonly http = inject(HttpClient);

  // Ajuste para a URL da sua API
  private readonly apiUrl = 'https://localhost:7000/api/item';

  readonly filtros: FiltroCategoria[] = [
    { rotulo: 'Todos' },
    { rotulo: 'Rosto', categoria: 'Rosto' },
    { rotulo: 'Corpo', categoria: 'Corpo' },
    { rotulo: 'Cabelo', categoria: 'Cabelo' },
    { rotulo: 'Serviços', tipo: 'servico' }
  ];

  produtos: Produto[] = [];
  busca = '';
  ordem: Ordem = 'nome';
  filtroSelecionado = 'Todos';
  carregando = false;
  mensagemErro = '';

  ngOnInit(): void {
    this.carregarProdutos();
  }

  get produtosFiltrados(): Produto[] {
    const termo = this.busca.trim().toLowerCase();
    const filtro = this.filtros.find(f => f.rotulo === this.filtroSelecionado);

    return this.produtos
      .filter(p => {
        if (!filtro) return true;
        if (filtro.categoria) return p.categoria === filtro.categoria;
        if (filtro.tipo) return p.tipoItem.toLowerCase() === filtro.tipo;
        return true;
      })
      .filter(p => !termo || p.item.toLowerCase().includes(termo))
      .sort((a, b) => {
        if (this.ordem === 'menor') return a.preco - b.preco;
        if (this.ordem === 'maior') return b.preco - a.preco;
        return a.item.localeCompare(b.item, 'pt-BR');
      });
  }

  get contagem(): string {
    const n = this.produtosFiltrados.length;
    return `${n} ${n === 1 ? 'item encontrado' : 'itens encontrados'}`;
  }

  onBusca(evento: Event): void {
    this.busca = (evento.target as HTMLInputElement).value;
  }

  onOrdem(evento: Event): void {
    this.ordem = (evento.target as HTMLSelectElement).value as Ordem;
  }

  selecionarFiltro(rotulo: string): void {
    this.filtroSelecionado = rotulo;
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
        this.mensagemErro = 'Erro ao carregar os produtos. Tente novamente.';
        this.carregando = false;
      }
    });
  }
}