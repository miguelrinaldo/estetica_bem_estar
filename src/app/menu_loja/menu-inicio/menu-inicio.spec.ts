import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuInicio } from './menu-inicio';

describe('MenuInicio', () => {
  let component: MenuInicio;
  let fixture: ComponentFixture<MenuInicio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuInicio],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuInicio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
