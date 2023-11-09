import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSelectModule } from 'ngx-select-ex';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InventariosRoutingModule } from './inventarios-routing.module';
import { InventarioIndexComponent } from './index/index.component';
import { InventarioShowComponent } from './show/show.component';
import { InsumoShowComponent } from './show/insumos/show/show.component';
import { InsumoCreateComponent } from './show/insumos/create/create.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { LotesShowComponent } from './show/insumos/lotes/show/show.component';
import { LotesCreateComponent } from './show/insumos/lotes/create/create.component';
import { DatePipe } from '@angular/common';
import { MovimientosShowComponent } from './show/movimientos/show/show.component';
import { MovimientosCreateComponent } from './show/movimientos/create/create.component';

@NgModule({
  declarations: [
    InventarioIndexComponent,
    InventarioShowComponent,
    InsumoShowComponent,
    InsumoCreateComponent,
    LotesShowComponent,
    LotesCreateComponent,
    MovimientosShowComponent,
    MovimientosCreateComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    InventariosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxSelectModule,
    CKEditorModule,
    DatePipe
  ],
})
export class InventariosModule { }
