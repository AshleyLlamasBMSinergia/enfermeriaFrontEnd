import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';

// const routes:Routes = [
//   {
//     path: 'login', component: LoginComponent
//   }
// ]

const routes: Routes = [
  {
    path: '',
    children: [
      {path: 'login', component: LoginComponent},
      {path: '**', redirectTo: 'login'}
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // RouterModule.forRoot(routes)
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
