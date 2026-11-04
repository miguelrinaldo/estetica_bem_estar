import { TestBed } from '@angular/core/testing';
import { Listagem } from './listagem';

describe('Listagem', () => {
  let service: Listagem;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Listagem);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
