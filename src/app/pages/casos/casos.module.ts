import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSelectModule } from 'ngx-select-ex';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CasosIndexComponent } from './index/index.component';
import { CasosRoutingModule } from './casos-routing.module';
import { CasosCreateComponent } from './create/create.component';
import { CreateComponent } from './incapacidades/create/create.component';
import { CasosShowComponent } from './show/show.component';
import { AccidentesShowComponent } from './accidentes/show/show.component';
import { FormComponent } from './incapacidades/form/form.component';
import { AccidentesCreateComponent } from './accidentes/create/create.component';
import { incapacidadesEditComponent } from './incapacidades/edit/edit.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CasosEditComponent } from './edit/edit.component';

@NgModule({
  declarations: [
    CasosIndexComponent,
    CasosCreateComponent,
    CreateComponent,
    FormComponent,
    CasosShowComponent,
    AccidentesCreateComponent,
    AccidentesShowComponent,
    incapacidadesEditComponent,
    CasosEditComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    CasosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxSelectModule,
    CKEditorModule,
    DatePipe,
    FullCalendarModule,
  ],
  providers: [
    DatePipe
  ],
})
export class CasosModule { }
