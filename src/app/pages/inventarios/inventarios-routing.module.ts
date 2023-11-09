import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventarioIndexComponent } from './index/index.component';
import { InventarioShowComponent } from './show/show.component';
import { InsumoShowComponent } from './show/insumos/show/show.component';
import { InsumoCreateComponent } from './show/insumos/create/create.component';
import { LotesShowComponent } from './show/insumos/lotes/show/show.component';
import { LotesCreateComponent } from './show/insumos/lotes/create/create.component';
import { MovimientosCreateComponent } from './show/movimientos/create/create.component';
import { MovimientosShowComponent } from './show/movimientos/show/show.component';

const routes: Routes = [
  {
    path: '',
    component: InventarioIndexComponent,
    data: {
      subtitulo: 'Almacenes',
    },
  },
  {
    path: ':id',
    component: InventarioShowComponent,
    data: {
      subtitulo: 'Ver almacén', 
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
    component: MovimientosCreateComponent,
    data: {
      subtitulo: 'Generar movimiento de lotes',
    },
  },
  {
    path: ':inventarioId/movimientos/:movimientoId',
    component: MovimientosShowComponent,
    data: {
      subtitulo: 'Reporte del movimiento',
    },
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventariosRoutingModule {}