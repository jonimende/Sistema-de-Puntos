import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register'; // Asegurate que la ruta sea correcta
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Importamos el componente porque es standalone
      imports: [RegisterComponent], 
      
      // AQUÍ ESTÁ LA SOLUCIÓN:
      // Proveemos las dependencias que el componente pide (Http y Router)
      providers: [
        provideHttpClient(),        // Necesario para AuthService
        provideHttpClientTesting(), // Mock para no hacer llamadas reales
        provideRouter([])           // Necesario para el Router
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Importante para iniciar el ciclo de vida de Angular
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});