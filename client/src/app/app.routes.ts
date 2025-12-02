import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { HomeComponent } from './pages/home/home';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { 
      path: 'dashboard', 
      component: DashboardComponent,
      canActivate: [authGuard] // <--- Ahora está protegido
    },
    { path: 'home', component: HomeComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];