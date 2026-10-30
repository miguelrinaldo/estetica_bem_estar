import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaProduto } from './lista-produto';

describe('ListaProduto', () => {
  let component: ListaProduto;
  let fixture: ComponentFixture<ListaProduto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaProduto],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaProduto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
