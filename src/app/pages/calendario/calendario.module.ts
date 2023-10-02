import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CalendarioIndexComponent } from './index/index.component';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarioRoutingModule } from './calendario-routing.module';
import { DateModalComponent } from './index/date-modal/date-modal.component';
import { FormsModule } from '@angular/forms';
import { NgxSelectModule } from 'ngx-select-ex';

@NgModule({
  declarations: [
    CalendarioIndexComponent,
    DateModalComponent,
  ],
  imports: [
    CommonModule,
    FullCalendarModule,
    RouterModule,
    CalendarioRoutingModule,
    FormsModule,
    NgxSelectModule
  ],
  providers: [DatePipe],
})
export class CalendarioModule { }