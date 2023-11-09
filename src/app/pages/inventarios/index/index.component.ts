import { Component } from '@angular/core';
import { Inventarios } from 'src/app/interfaces/inventarios';
import { InventariosService } from '../inventarios.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Subject, debounceTime  } from 'rxjs';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class InventarioIndexComponent {
  inventarios: Inventarios[] = [];
  loading: boolean = false;

  paginaActual = 1;
  elementosPorPagina = 10;
  
  search: string = '';
  private searchTerms = new Subject<string>();

  constructor(
    private inventariosService: InventariosService,
    private notificationService: NotificationService,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.getInventarios();

    this.searchTerms.pipe(
      debounceTime(500)
    ).subscribe(() => {
      this.realizarBusqueda();
    });
  }

  buscarInventario() {
    this.searchTerms.next(this.search.trim());
  }

  getInventarios(){
    this.userService.user$.subscribe(
      (user: any) => {
        this.inventariosService.getInventariosDelProfesional(user[0].useable_id).subscribe(
          data => this.inventarios = data,
          error => console.error('Error al obtener inventarios', error)
        );
      },
      (error) => {
        console.error('Error al obtener los datos del usuario', error);
      }
    );
  }

  realizarBusqueda() {
    if (this.search.trim() !== '') {
      this.inventariosService.buscador(this.search)
        .subscribe(
          inventarios => this.inventarios = inventarios,
          error => console.error(error)
        );
    } else {
      this.getInventarios();
    }
  }

  showInventario(id: number) {
    this.router.navigate(['/enfermeria/almacenes', id]);
  }

  editInventario(id: number) {
    this.router.navigate(['/enfermeria/almacenes/edit', id]);
  }
}
