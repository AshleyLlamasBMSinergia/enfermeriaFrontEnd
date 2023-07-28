import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultasIndexComponent } from './index/index.component';
import { ConsultasCreateComponent } from './create/create.component';
import { ConsultasEditComponent } from './edit/edit.component';
import { ConsultasShowComponent } from './show/show.component';
import { RouterModule } from '@angular/router';
import { ConsultasRoutingModule } from './consultas-routing.module';



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
    ConsultasRoutingModule
  ],
})
export class ConsultasModule { }
