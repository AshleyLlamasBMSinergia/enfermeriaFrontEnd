import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-date-modal',
  templateUrl: './date-modal.component.html',
  styleUrls: ['./date-modal.component.css']
})
export class DateModalComponent {
  
  @Input() selectedDate: any;
  @Input() relatedEvents: any[] = [];

  constructor() { }

}