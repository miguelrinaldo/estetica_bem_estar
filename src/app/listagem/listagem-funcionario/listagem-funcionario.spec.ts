import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListagemFuncionario } from './listagem-funcionario';

describe('ListagemFuncionario', () => {
  let component: ListagemFuncionario;
  let fixture: ComponentFixture<ListagemFuncionario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListagemFuncionario],
    }).compileComponents();

    fixture = TestBed.createComponent(ListagemFuncionario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
