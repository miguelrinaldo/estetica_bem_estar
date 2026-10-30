import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalagoServico } from './catalago-servico';

describe('CatalagoServico', () => {
  let component: CatalagoServico;
  let fixture: ComponentFixture<CatalagoServico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalagoServico],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalagoServico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
