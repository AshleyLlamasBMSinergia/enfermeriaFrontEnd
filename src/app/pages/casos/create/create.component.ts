import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ImageService } from 'src/app/services/imagen.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CasosCreateComponent {
  constructor(
    private userService: UserService,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
  ) {}

  profesional: any;
  imageProfesional: any;
  imageEmpleado: any;

  ngOnInit(): void {
    this.userService.user$.subscribe(
      (user: any) => {
        this.profesional = user[0];
        if (user[0].useable.image) {
          this.obtenerImagen(user[0].useable.image.url).subscribe((imagen) => {
            this.imageProfesional = imagen;
          });
        } else {
          this.imageProfesional = '/assets/dist/img/user.png';
        }
      },
      (error) => {
        console.error('Error al obtener los datos del usuario', error);
      }
    );
  }

  obtenerImagen(url: string): Observable<any> {
    return this.imageService.getImagen(url).pipe(
      map((response: any) => {
        const blob = new Blob([response], { type: 'image/jpeg' });
        return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      }),
      catchError((error) => {
        return of('/assets/dist/img/user.png');
      })
    );
  }
}
