import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ConsultasIndexComponent } from './index/index.component';
import { ConsultasCreateComponent } from './create/create.component';
import { ConsultasShowComponent } from './show/show.component';
import { RouterModule } from '@angular/router';
import { ConsultasRoutingModule } from './consultas-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSelectModule } from 'ngx-select-ex';

@NgModule({
  declarations: [
    ConsultasIndexComponent,
    ConsultasShowComponent,
    ConsultasCreateComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ConsultasRoutingModule,
    NgxSelectModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [DatePipe],
})
export class ConsultasModule { }
