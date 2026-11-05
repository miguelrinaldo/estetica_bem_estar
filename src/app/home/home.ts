import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  readonly nomeEmpresa = 'Estética & Bem-Estar';
  readonly tituloHome = 'Bem-vindo(a)!';

  // Ideal: salvar a imagem em src/assets e usar 'assets/home.jpg'
  readonly imagem =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFvp70XLSn7JMq5yrTn7lFGTzqZiQVK282flrnNlL7mA&s=10';
}