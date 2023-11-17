import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSelectModule } from 'ngx-select-ex';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { IncapacidadesRoutingModule } from './incapacidades-routing.module';
import { IncapacidadesIndexComponent } from './index/index.component';
import { IncapacidadesShowComponent } from './show/show.component';
import { IncapacidadesCreateComponent } from './create/create.component';
import { IncapacidadesEditComponent } from './edit/edit.component';

@NgModule({
  declarations: [
    IncapacidadesIndexComponent,
    IncapacidadesShowComponent,
    IncapacidadesCreateComponent,
    IncapacidadesEditComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    IncapacidadesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxSelectModule,
    CKEditorModule,
    DatePipe
  ]
})
export class IncapacidadesModule { }
