import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listWeekPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarioService } from '../calendario.service';
import { DatePipe } from '@angular/common';
import { Calendario } from 'src/app/interfaces/calendario';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

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

  profesional: any;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listWeekPlugin],
    locale: 'es',
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    buttonText: {
      today: 'Hoy', // Cambiar el texto del botón "Today"
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      list: 'Lista',
    },
    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    events: [],
  };

  constructor(
    private calendarioService: CalendarioService,
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.userService.user$.subscribe(
      (user: any) => {
        this.profesional = user[0];
      },
      (error) => {
        console.error('Error al obtener los datos del usuario', error);
      }
    );

    this.calendarioService.getCalendarioEventos(this.profesional.id).subscribe(
      (calendarioEventos: Calendario[]) => {
        this.events = calendarioEventos.map((evento) => ({
          title: `${evento.tipo} - ${evento.paciente?.pacientable?.nombre}`,
          start: this.datePipe.transform(evento.fecha, 'yyyy-MM-ddTHH:mm:ss'),
          end: this.datePipe.transform(evento.fecha, 'yyyy-MM-ddTHH:mm:ss'),
          color: evento.color,
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
      (window as any).$('#dateModal').modal({ backdrop: 'static', keyboard: false });
    }
  }
}