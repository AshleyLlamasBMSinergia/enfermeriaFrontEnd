import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventarioIndexComponent } from './index/index.component';
import { InventarioShowComponent } from './show/show.component';
import { InsumoShowComponent } from './show/insumos/show/show.component';
import { InsumoCreateComponent } from './show/insumos/create/create.component';
import { LotesShowComponent } from './show/insumos/lotes/show/show.component';
import { LotesCreateComponent } from './show/insumos/lotes/create/create.component';
import { MovimientosComponent } from './show/movimientos/movimientos.component';

const routes: Routes = [
  {
    path: '',
    component: InventarioIndexComponent,
    data: {
      subtitulo: 'Inventarios',
    },
  },
  {
    path: ':id',
    component: InventarioShowComponent,
    data: {
      subtitulo: 'Ver Inventario', 
    },
  },
  {
    path: ':inventarioId/insumos/create',
    component: InsumoCreateComponent,
    data: {
      subtitulo: 'Ingresar Insumo',
    },
  },
  {
    path: ':inventarioId/insumos/:insumoId',
    component: InsumoShowComponent,
    data: {
      subtitulo: 'Ver Insumo',
    },
  },
  {
    path: ':inventarioId/insumos/:insumoId/lotes/create',
    component: LotesCreateComponent,
    data: {
      subtitulo: 'Ingresar Lote',
    },
  },
  {
    path: ':inventarioId/insumos/:insumoId/lotes/:loteId',
    component: LotesShowComponent,
    data: {
      subtitulo: 'Ver Lote',
    },
  },
  {
    path: ':inventarioId/movimientos/create',
    component: MovimientosComponent,
    data: {
      subtitulo: 'Generar movimiento de lotes',
    },
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventariosRoutingModule {}