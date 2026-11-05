import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';

type Situacao = 'estoque_cheio' | 'estoque_baixo' | 'estoque_zerado';
type FiltroSituacao = 'todas' | Situacao;
type ChaveOrdem = 'codigoProduto' | 'categoria' | 'preco' | 'quantidade' | 'valorTotal' | 'situacao';

interface ItemEstoque {
  codigoProduto: number;
  produto: string;
  categoria: string;
  preco: number;
  quantidade: number;
}

interface LinhaEstoque extends ItemEstoque {
  valorTotal: number;
  situacao: Situacao;
}

@Component({
  selector: 'app-estoque',
  standalone: true,
  imports: [NgFor, NgIf, CurrencyPipe],
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.css']
})
export class EstoqueComponent implements OnInit {
  private readonly http = inject(HttpClient);

  // Ajuste para a URL da sua API
  private readonly apiUrl = 'https://localhost:7000/api/estoque';

  // Até esta quantidade o item é considerado "estoque baixo"
  private readonly limiteBaixo = 5;

  readonly colunas: { chave: ChaveOrdem; rotulo: string }[] = [
    { chave: 'codigoProduto', rotulo: 'Cód. Produto' },
    { chave: 'categoria', rotulo: 'Categoria' },
    { chave: 'preco', rotulo: 'Preço' },
    { chave: 'quantidade', rotulo: 'Quantidade' },
    { chave: 'valorTotal', rotulo: 'Valor Total' },
    { chave: 'situacao', rotulo: 'Situação' }
  ];

  readonly rotuloSituacao: Record<Situacao, string> = {
    estoque_cheio: 'Em estoque',
    estoque_baixo: 'Estoque baixo',
    estoque_zerado: 'Estoque zerado'
  };

  linhas: LinhaEstoque[] = [];
  busca = '';
  situacaoSelecionada: FiltroSituacao = 'todas';
  ordemChave: ChaveOrdem = 'codigoProduto';
  ordemAsc = true;
  carregando = false;
  mensagemErro = '';

  ngOnInit(): void {
    this.carregarEstoque();
  }

  // Totais do topo (consideram todos os itens, sem filtro)
  get totalItens(): number {
    return this.linhas.length;
  }

  get totalUnidades(): number {
    return this.linhas.reduce((soma, l) => soma + l.quantidade, 0);
  }

  get totalValor(): number {
    return this.linhas.reduce((soma, l) => soma + l.valorTotal, 0);
  }

  get totalAlertas(): number {
    return this.linhas.filter(l => l.situacao !== 'estoque_cheio').length;
  }

  // Lista exibida: busca + situação + ordenação
  get linhasFiltradas(): LinhaEstoque[] {
    const termo = this.busca.trim().toLowerCase();

    return this.linhas
      .filter(l => this.situacaoSelecionada === 'todas' || l.situacao === this.situacaoSelecionada)
      .filter(l =>
        !termo ||
        l.produto.toLowerCase().includes(termo) ||
        l.categoria.toLowerCase().includes(termo) ||
        String(l.codigoProduto).includes(termo)
      )
      .sort((a, b) => this.comparar(a, b));
  }

  onBusca(evento: Event): void {
    this.busca = (evento.target as HTMLInputElement).value;
  }

  onSituacao(evento: Event): void {
    this.situacaoSelecionada = (evento.target as HTMLSelectElement).value as FiltroSituacao;
  }

  ordenarPor(chave: ChaveOrdem): void {
    if (this.ordemChave === chave) {
      this.ordemAsc = !this.ordemAsc;
    } else {
      this.ordemChave = chave;
      this.ordemAsc = true;
    }
  }

  private comparar(a: LinhaEstoque, b: LinhaEstoque): number {
    const va = a[this.ordemChave];
    const vb = b[this.ordemChave];
    const resultado = typeof va === 'number' && typeof vb === 'number'
      ? va - vb
      : String(va).localeCompare(String(vb), 'pt-BR');
    return this.ordemAsc ? resultado : -resultado;
  }

  private calcularSituacao(quantidade: number): Situacao {
    if (quantidade <= 0) return 'estoque_zerado';
    if (quantidade <= this.limiteBaixo) return 'estoque_baixo';
    return 'estoque_cheio';
  }

  private carregarEstoque(): void {
    this.carregando = true;
    this.mensagemErro = '';

    this.http.get<ItemEstoque[]>(this.apiUrl).subscribe({
      next: (dados) => {
        this.linhas = dados.map(d => ({
          ...d,
          valorTotal: d.preco * d.quantidade,
          situacao: this.calcularSituacao(d.quantidade)
        }));
        this.carregando = false;
      },
      error: () => {
        this.mensagemErro = 'Erro ao carregar o estoque. Tente novamente.';
        this.carregando = false;
      }
    });
  }
}