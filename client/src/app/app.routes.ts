import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { ProductosAdminComponent } from './pages/productos-admin/productos-admin';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { 
      path: 'dashboard', 
      component: Dashboard,
      canActivate: [authGuard] // <--- Ahora está protegido
    },
    {path: 'productos', component: ProductosAdminComponent},
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];