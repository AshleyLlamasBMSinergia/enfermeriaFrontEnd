import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistorialesMedicosIndexComponent } from './index/index.component';
import { HistorialesMedicosCreateComponent } from './create/create.component';
import { HistorialesMedicosEditComponent } from './edit/edit.component';
import { HistorialesMedicosShowComponent } from './show/show.component';

const routes: Routes = [
  {
    path: '',
    component: HistorialesMedicosIndexComponent,
    data: {
      subtitulo: 'Historiales médicos',
    },
  },
  {
    path: 'create',
    component: HistorialesMedicosCreateComponent,
    data: {
      subtitulo: 'Crear historial médico',
    },
  },
  {
    path: 'edit/:HistorialMedico',
    component: HistorialesMedicosEditComponent,
    data: {
      subtitulo: 'Editar historial médico',
    },
  },
  {
    path: ':HistorialMedico',
    component: HistorialesMedicosShowComponent,
    data: {
      subtitulo: 'Ver historial médico',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialesMedicosRoutingModule {}