import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Funcionario {
  idPessoa: number;
  nome: string;
  cpf: string;
  cargo: string;
  dataAdmissao: string;
  email: string;
  telefone: string;
  ativo: boolean;
}

@Component({
  selector: 'app-funcionarios',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe],
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.css']
})
export class FuncionariosComponent implements OnInit {
  private readonly http = inject(HttpClient);

  // Ajuste para a URL da sua API
  private readonly apiUrl = 'https://localhost:7000/api/funcionario';

  funcionarios: Funcionario[] = [];
  busca = '';
  cargoSelecionado = '';
  somenteAtivos = false;
  carregando = false;
  mensagemErro = '';

  ngOnInit(): void {
    this.carregarFuncionarios();
  }

  // Opções do select, geradas a partir dos dados
  get cargos(): string[] {
    return [...new Set(this.funcionarios.map(f => f.cargo))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }

  get funcionariosFiltrados(): Funcionario[] {
    const termo = this.busca.trim().toLowerCase();
    const termoCpf = termo.replace(/\D/g, '');

    return this.funcionarios
      .filter(f => !this.cargoSelecionado || f.cargo === this.cargoSelecionado)
      .filter(f => !this.somenteAtivos || f.ativo)
      .filter(f =>
        !termo ||
        f.nome.toLowerCase().includes(termo) ||
        f.email.toLowerCase().includes(termo) ||
        (termoCpf !== '' && f.cpf.replace(/\D/g, '').includes(termoCpf))
      )
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  }

  get contagem(): string {
    const n = this.funcionariosFiltrados.length;
    return `${n} ${n === 1 ? 'funcionário encontrado' : 'funcionários encontrados'}`;
  }

  formatarCpf(cpf: string): string {
    const n = (cpf || '').replace(/\D/g, '');
    return n.length === 11 ? n.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : cpf;
  }

  onBusca(evento: Event): void {
    this.busca = (evento.target as HTMLInputElement).value;
  }

  onCargo(evento: Event): void {
    this.cargoSelecionado = (evento.target as HTMLSelectElement).value;
  }

  onAtivos(evento: Event): void {
    this.somenteAtivos = (evento.target as HTMLInputElement).checked;
  }

  private carregarFuncionarios(): void {
    this.carregando = true;
    this.mensagemErro = '';

    this.http.get<Funcionario[]>(this.apiUrl).subscribe({
      next: (dados) => {
        this.funcionarios = dados;
        this.carregando = false;
      },
      error: () => {
        this.mensagemErro = 'Erro ao carregar os funcionários. Tente novamente.';
        this.carregando = false;
      }
    });
  }
}