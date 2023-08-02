import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ConsultasIndexComponent } from './index/index.component';
import { ConsultasCreateComponent } from './create/create.component';
//import { ConsultasEditComponent } from './edit/edit.component';
import { ConsultasShowComponent } from './show/show.component';
import { RouterModule } from '@angular/router';
import { ConsultasRoutingModule } from './consultas-routing.module';
import { Select2Module } from 'ng-select2-component';



@NgModule({
  declarations: [
    ConsultasIndexComponent,
    ConsultasShowComponent,
    ConsultasCreateComponent,
    // ConsultasEditComponent,
    
  ],
  imports: [
    CommonModule,
    RouterModule,
    ConsultasRoutingModule,
    Select2Module
  ],
  providers: [DatePipe],
})
export class ConsultasModule { }
