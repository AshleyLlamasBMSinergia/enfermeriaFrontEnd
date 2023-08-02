import { Component, Input, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.css']
})
export class EventModalComponent {

  @Input() event: any; // Recibe la información del evento

}
