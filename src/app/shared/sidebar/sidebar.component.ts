import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  menuItems?:any[];

  constructor(
    private authService: AuthService,
    private UserServices: UserService, // Inyecta el UserStateService
    private sidebarServices: SidebarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.menuItems = this.sidebarServices.menu;
  }

  logout() {
    this.authService.logout().subscribe(
      () => {
        localStorage.removeItem('token'); // Elimina el token almacenado
        this.router.navigateByUrl('/login'); // Redirige al componente de inicio de sesión
      },
      error => {
        console.error('Error al cerrar sesión:', error);
      }
    );
  }
}