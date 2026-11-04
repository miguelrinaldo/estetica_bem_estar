import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogoProduto } from './catalogo-produto';

describe('CatalogoProduto', () => {
  let component: CatalogoProduto;
  let fixture: ComponentFixture<CatalogoProduto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogoProduto],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogoProduto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
