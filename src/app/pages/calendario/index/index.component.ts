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
import { AbstractControl, FormArray, FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification.service';

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

  //BUSCAR PDF
  excelCitaForm!: FormGroup;
  mensajesDeError: string[] = [];

  nombresDescriptivos: { [key: string]: string } = {
    profesional_id: 'profesional',
    tipo: 'tipo de cita',
    fechaInicial: 'fecha inicial',
    fechaFinal: 'fecha final',
  };

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
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
  ) {
    this.excelCitaForm = this.formBuilder.group({
      profesional_id: [this.profesional?.useable_id, Validators.required],
      tipo: ['', Validators.required],
      fechaInicial: [null, Validators.required],
      fechaFinal: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.userService.user$.subscribe(
      (user: any) => {
        this.profesional = user[0];
        this.excelCitaForm.get('profesional_id')?.setValue(user[0].useable_id);
      },
      (error) => {
        console.error('Error al obtener los datos del usuario', error);
      }
    );

    this.calendarioService.getCalendarioEventos(this.profesional.useable_id).subscribe(
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

  buscarExcel(){
    if (this.excelCitaForm.invalid) {
      const camposNoValidos = Object.keys(this.excelCitaForm.controls).filter(controlName => this.excelCitaForm.get(controlName)?.invalid);
      const mensajes: string[] = [];

      camposNoValidos.forEach(controlName => {
        this.excelCitaForm.get(controlName)!;
        const control = this.excelCitaForm.get(controlName)!;
        const errores = this.obtenerMensajesDeError(control).join(', ');
        mensajes.push(`El campo ${this.nombresDescriptivos[controlName]} ${errores}`);
      });

      this.mensajesDeError = mensajes;

    } else {

      const buscarExcel = this.excelCitaForm.value;

      this.calendarioService.buscarExcel(buscarExcel).subscribe(
        (response: any) => {
          const blob = new Blob([response], { type: 'application/xlsx' });
      
          // Crear un enlace para la descarga
          const downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(blob);
          downloadLink.download = 'citas.xlsx';  // ¡Asegúrate de que el nombre coincida con el que especificas en Laravel!
      
          // Simular un clic en el enlace para iniciar la descarga
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        },
        (error) => {
          console.log(error);
          this.notificationService.error(error);
        }
      );
      
    
    }
  }

  obtenerMensajesDeError(control: AbstractControl): string[] {
    const mensajes: string[] = [];

    if (control.errors) {
      for (const errorKey in control.errors) {
        switch (errorKey) {
          case 'required':
            mensajes.push(' es obligatorio');
            break;
          case 'maxlength':
            mensajes.push(' excede el límite de longitud permitido');
            break;
          default:
            mensajes.push(`Error: ${errorKey}`);
          break;
        }
      }
    }

    if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach(key => {
        mensajes.push(...this.obtenerMensajesDeError(control.get(key)!));
      });
    }

    return mensajes;
  }
}