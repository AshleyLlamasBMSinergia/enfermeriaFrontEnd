import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorialesMedicosIndexComponent } from './index/index.component';
import { HistorialesMedicosCreateComponent } from './create/create.component';
import { HistorialesMedicosEditComponent } from './edit/edit.component';
import { HistorialesMedicosShowComponent } from './show/show.component';
import { RouterModule } from '@angular/router';
import { HistorialesMedicosRoutingModule } from './historiales-medicos-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSelectModule } from 'ngx-select-ex';
import { AntecedentesPersonalesPatologicosComponent } from './show/antecedentes-personales-patologicos/antecedentes-personales-patologicos.component';
import { AntecedentesPersonalesNoPatologicosComponent } from './show/antecedentes-personales-no-patologicos/antecedentes-personales-no-patologicos.component';
import { AntecedentesHeredofamiliaresComponent } from './show/antecedentes-heredofamiliares/antecedentes-heredofamiliares.component';
import { ExamenesAntidopingComponent } from './show/examenes-antidoping/examenes-antidoping.component';
import { ExamenesFisicosComponent } from './show/examenes-fisicos/examenes-fisicos.component';
import { ExamenesEmbarazoComponent } from './show/examenes-embarazo/examenes-embarazo.component';
import { ExamenesVistaComponent } from './show/examenes-vista/examenes-vista.component';
import { DependientesComponent } from './show/dependientes/dependientes.component';
import { PaginationModule } from 'src/app/pagination/pagination.module';

@NgModule({
  declarations: [
    HistorialesMedicosIndexComponent,
    HistorialesMedicosShowComponent,
    HistorialesMedicosCreateComponent,
    HistorialesMedicosEditComponent,
    AntecedentesPersonalesPatologicosComponent,
    AntecedentesPersonalesNoPatologicosComponent,
    AntecedentesHeredofamiliaresComponent,
    ExamenesAntidopingComponent,
    ExamenesFisicosComponent,
    ExamenesEmbarazoComponent,
    ExamenesVistaComponent,
    DependientesComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    HistorialesMedicosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxSelectModule,
    PaginationModule
  ],
})
export class HistorialesMedicosModule { }
