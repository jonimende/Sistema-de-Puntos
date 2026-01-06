import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteNuevoComponent } from './cliente-nuevo';

describe('ClienteNuevo', () => {
  let component: ClienteNuevoComponent;
  let fixture: ComponentFixture<ClienteNuevoComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteNuevoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteNuevoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
