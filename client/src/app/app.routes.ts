import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { ProductosAdminComponent } from './pages/productos-admin/productos-admin';
import { RegisterComponent } from './pages/register/register';  

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegisterComponent },
    { 
      path: 'dashboard', 
      component: Dashboard,
      canActivate: [authGuard] // <--- Ahora está protegido
    },
    {path: 'productos', component: ProductosAdminComponent},
    { path: '', redirectTo: 'registro', pathMatch: 'full' }
];