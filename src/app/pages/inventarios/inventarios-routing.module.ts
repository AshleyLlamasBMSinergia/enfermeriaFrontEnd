import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventarioIndexComponent } from './index/index.component';
import { InventarioCreateComponent } from './create/create.component';
import { InventarioEditComponent } from './edit/edit.component';
import { InventarioShowComponent } from './show/show.component';

const routes: Routes = [
  {
    path: '',
    component: InventarioIndexComponent,
    data: {
      subtitulo: 'Inventarios',
    },
  },
  {
    path: 'create',
    component: InventarioCreateComponent,
    data: {
      subtitulo: 'Crear Inventario',
    },
  },
  {
    path: 'edit/:edit',
    component: InventarioEditComponent,
    data: {
      subtitulo: 'Editar Inventario',
    },
  },
  {
    path: ':id',
    component: InventarioShowComponent,
    data: {
      subtitulo: 'Ver Inventario',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventariosRoutingModule {}