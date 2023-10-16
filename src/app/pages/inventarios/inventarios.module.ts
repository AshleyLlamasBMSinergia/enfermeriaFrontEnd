import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSelectModule } from 'ngx-select-ex';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InventariosRoutingModule } from './inventarios-routing.module';
import { InventarioCreateComponent } from './create/create.component';
import { InventarioEditComponent } from './edit/edit.component';
import { InventarioIndexComponent } from './index/index.component';
import { InventarioShowComponent } from './show/show.component';

@NgModule({
  declarations: [
    InventarioCreateComponent,
    InventarioEditComponent,
    InventarioIndexComponent,
    InventarioShowComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    InventariosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxSelectModule,
  ],
})
export class InventariosModule { }
