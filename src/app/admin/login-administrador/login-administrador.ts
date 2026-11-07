import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Login_Adm } from '../../models/login';

@Component({
  selector: 'app-login-admistrador',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './login-administrador.html',
  styleUrls: ['./login-administrador.css']
})
export class login_adm {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // Ajuste para a URL da sua API
  private readonly apiUrl = 'https://localhost:7000/api/auth/login';

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    senha: ['', [Validators.required, Validators.maxLength(100)]]
  });

  mensagemErro = '';
  carregando = false;

  onSubmit(): void {
    this.mensagemErro = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const login = new Login_Adm();
    login.email = this.loginForm.value.email ?? '';
    login.senha = this.loginForm.value.senha ?? '';

    this.carregando = true;

    this.http.post<{ token?: string }>(this.apiUrl, login).subscribe({
      next: (resposta) => {
        this.carregando = false;
        // Se a API devolver um token, guarde-o
        if (resposta?.token) {
          localStorage.setItem('token', resposta.token);
        }
        this.router.navigate(['/home']);
      },
      error: (erro) => {
        this.carregando = false;
        this.mensagemErro = erro.status === 401
          ? 'Email ou senha inválidos.'
          : 'Erro ao realizar login. Tente novamente.';
      }
    });
  }
}