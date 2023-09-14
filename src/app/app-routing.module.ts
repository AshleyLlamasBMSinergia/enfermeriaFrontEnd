import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NopageFoundComponent } from './nopage-found/nopage-found.component';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages/pages-routing.module';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes =  [
  {
    path: 'enfermeria',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
    canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: '404', component: NopageFoundComponent },
  { path: '**', redirectTo: '/404' },
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    PagesRoutingModule,
    AuthRoutingModule,
    HttpClientModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
