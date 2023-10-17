import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ImageService } from 'src/app/services/imagen.service';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  menuItems?:any[];
  user: any;
  image: any;

  constructor(
    private authService: AuthService,
    public userService: UserService,
    private imageService: ImageService,
    private sidebarService: SidebarService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.menuItems = this.sidebarService.menu;

    this.userService.user$.subscribe(
      (user: any) => {
        this.user = user[0];
        if(user[0].useable.image.url){
          this.imageService.getImagen(user[0].useable.image.url).subscribe(
            (response: any) => {
              const blob = new Blob([response], { type: 'image/jpeg' });
              this.image = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
            },
            (error) => {
              console.error('Error al obtener la imagen', error);
              this.image = '/assets/dist/img/user.png';
            }
          );
        }else{
          this.image = '/assets/dist/img/user.png';
        }
      },
      (error) => {
        console.error('Error al obtener los datos del usuario', error);
      }
    );
  }

  logout() {
    this.authService.logout().subscribe(
      () => {
        localStorage.removeItem('token');
        this.router.navigateByUrl('/login');
      },
      error => {
        console.error('Error al cerrar sesión:', error);
      }
    );
  }
}