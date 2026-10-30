import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListagemCadastro } from './component/listagem-cadastro/listagem-cadastro';

@Component({
  imports: [RouterOutlet, ListagemCadastro],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('estetica_bem_estar');
}
