import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CalendarioIndexComponent } from './index/index.component';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarioRoutingModule } from './calendario-routing.module';
import { DateModalComponent } from './index/date-modal/date-modal.component';

@NgModule({
  declarations: [
    CalendarioIndexComponent,
    DateModalComponent,
  ],
  imports: [
    CommonModule,
    FullCalendarModule,
    RouterModule,
    CalendarioRoutingModule
  ],
  providers: [DatePipe],
})
export class CalendarioModule { }
