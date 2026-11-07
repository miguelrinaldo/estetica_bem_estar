import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';

function cpfValidator(control: AbstractControl): ValidationErrors | null {
  const cpf = (control.value || '').replace(/\D/g, '');

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return { cpfInvalido: true };
  }

  for (let t = 9; t < 11; t++) {
    let soma = 0;
    for (let i = 0; i < t; i++) {
      soma += Number(cpf[i]) * (t + 1 - i);
    }
    const digito = ((soma * 10) % 11) % 10;
    if (digito !== Number(cpf[t])) {
      return { cpfInvalido: true };
    }
  }

  return null;
}

@Component({
  selector: 'app-logincliente',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './login-cliente.html',
  styleUrls: ['./login-cliente.css']
})
export class LoginclienteComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);

  // Ajuste para a URL da sua API
  private readonly apiUrl = 'https://localhost:7000/api/pessoa';

  readonly clienteForm = this.fb.group({
    nome: ['', [Validators.required, Validators.maxLength(80)]],
    cpf: ['', [Validators.required, cpfValidator]],
    sexo: ['', Validators.required],
    data_nascimento: ['', Validators.required]
  });

  mensagemSucesso = '';
  mensagemErro = '';
  carregando = false;

  onSubmit(): void {
    this.mensagemSucesso = '';
    this.mensagemErro = '';

    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    const { nome, cpf, sexo, data_nascimento } = this.clienteForm.value;
    const cliente = {
      nome,
      cpf: (cpf ?? '').replace(/\D/g, ''),
      sexo,
      data_nascimento
    };

    this.carregando = true;

    this.http.post(this.apiUrl, cliente).subscribe({
      next: () => {
        this.carregando = false;
        this.mensagemSucesso = 'Cliente cadastrado com sucesso!';
        this.clienteForm.reset();
      },
      error: (erro) => {
        this.carregando = false;
        this.mensagemErro = erro.status === 409
          ? 'Já existe um cliente com este CPF.'
          : 'Erro ao cadastrar cliente. Tente novamente.';
      }
    });
  }

  limpar(): void {
    this.clienteForm.reset();
    this.mensagemSucesso = '';
    this.mensagemErro = '';
  }
}