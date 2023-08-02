import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, EventApi, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listWeekPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarioService } from '../calendario.service';
import { DatePipe } from '@angular/common';
import { Calendario } from '../calendario';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})

export class CalendarioIndexComponent implements OnInit {

  events: any[] = [];
  relatedEvents: any[] = [];
  selectedDate: Date = new Date();
  selectedEvent: any;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listWeekPlugin],
    locale: 'es',
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    events: [],
  };

  constructor(private calendarioService: CalendarioService, private datePipe: DatePipe) {}

  ngOnInit() {
    this.calendarioService.getCalendarioEventos().subscribe(
      (calendarioEventos: Calendario[]) => {
        this.events = calendarioEventos.map((evento) => ({
          title: `${evento.Tipo} - ${evento.paciente?.pacientable?.Nombres} ${evento.paciente?.pacientable?.Paterno}`,
          start: this.datePipe.transform(evento.Fecha, 'yyyy-MM-ddTHH:mm:ss'),
          end: this.datePipe.transform(evento.Fecha, 'yyyy-MM-ddTHH:mm:ss'),
          color: evento.Color,
          calendario: evento // Almacenar el objeto Calendario completo en los eventos
        }));
        this.calendarOptions.events = this.events;
        this.calendarOptions.dateClick = this.onDateClick.bind(this);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onDateClick(res: any) {
    const dateISO = res.date.toISOString();
    this.selectedDate = new Date(dateISO);

    // Obtener los eventos relacionados con la fecha seleccionada
    this.relatedEvents = this.events.filter(event => {
      const eventDate = this.datePipe.transform(event.start, 'yyyy-MM-dd');
      const selectedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
      return eventDate === selectedDate;
    });

    this.openDateModal();
  }

  openDateModal(): void {
    const modalElement = document.getElementById('dateModal');
    if (modalElement) {
      modalElement.setAttribute('data-bs-date', this.selectedDate.toISOString());
      (window as any).$('#dateModal').modal('show');
    }
  }

  openEventModal(event: any) {
    console.log('Evento recibido:', event);
    this.selectedEvent = event; // Set the selected event
    const modalElement = document.getElementById('eventModal');
    if (modalElement) {
      (window as any).$('#eventModal').modal('show');
    }
  }
}