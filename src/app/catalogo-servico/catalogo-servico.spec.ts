import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogoServico } from './catalogo-servico';

describe('CatalogoServico', () => {
  let component: CatalogoServico;
  let fixture: ComponentFixture<CatalogoServico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogoServico],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogoServico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
