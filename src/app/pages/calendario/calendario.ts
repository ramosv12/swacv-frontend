import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import esLocale from '@fullcalendar/core/locales/es';

import { EmpleadoService } from '../../services/empleado';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    FullCalendarModule
  ],
  templateUrl: './calendario.html',
  styleUrl: './calendario.css'
})
export class CalendarioComponent implements OnInit {

  diasDisponibles: number = 0;
  selectedRange: { inicio: string, fin?: string } | null = null;
  eventoSeleccionado: any = null;

  year = 2026;
  vista: string = 'mes';

  months = Array.from({ length: 12 }, (_, i) => i);

  constructor(private empleadoService: EmpleadoService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.empleadoService.getDias().subscribe({
      next: (data) => {
        this.diasDisponibles = Number(data?.diasVacacionesDisponibles) || 0;

        console.log("Asignado:", this.diasDisponibles);

        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error("ERROR:", err);
      }
    });

    document.addEventListener('contextmenu', (event) => {

    const calendar = document.querySelector('.fc'); // FullCalendar

    if (calendar && calendar.contains(event.target as Node)) {
      event.preventDefault();

      if (this.selectedRange) {

        if (this.selectedRange.fin) {
          this.router.navigate(['/calendarizar'], {
            queryParams: {
              inicio: this.selectedRange.inicio,
              fin: this.selectedRange.fin
            }
          });
        } else {
          this.router.navigate(['/calendarizar'], {
            queryParams: {
              inicio: this.selectedRange.inicio
            }
          });
        }

      }

  }

});

document.addEventListener('keydown', (event: KeyboardEvent) => {

  if (event.key === 'Delete' && this.eventoSeleccionado) {

    const confirmar = confirm('¿Deseas eliminar esta vacación?');

    if (confirmar) {

      const id = this.eventoSeleccionado.id; // 👈 importante

      console.log("Eliminar evento:", id);

      // 👉 aquí después llamamos API
      //this.eliminarEvento(id);

      // limpiar selección
      this.eventoSeleccionado = null;
    }
  }

});

  }

  
  cambiarVista(nuevaVista: string) {
    this.vista = '';

    setTimeout(() => {
      this.vista = nuevaVista;
    });
  }

  // FECHA POR MES
  getMonthDate(month: number): Date {
    return new Date(this.year, month, 1);
  }

  // 🔥 TRACKBY (EVITA DUPLICADOS)
  trackByMonth(index: number, item: number) {
    return index;
  }

  // =========================
  //  VISTA MES 
  // =========================
  calendarOptions: CalendarOptions = {
  initialView: 'dayGridMonth',

  plugins: [
    dayGridPlugin,
    interactionPlugin
  ],
  selectable: true,
  locale: esLocale,

  headerToolbar: {
    left: 'prevYear,prev,next,nextYear today',
    center: 'title',
    right: 'dayGridMonth,dayGridWeek'
  },

  buttonText: {
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana'
  },
  
  initialDate: '2026-01-01',
  //  CLICK EN UN SOLO DÍA
  

  dateClick: (info) => {
  // Solo guardar selección de un día
  this.selectedRange = {
    inicio: info.dateStr
  };
},

select: (info) => {
  // Guardar rango seleccionado
  this.selectedRange = {
    inicio: info.startStr,
    fin: info.endStr
  };
},

dayCellDidMount: (info) => {
  info.el.addEventListener('contextmenu', (e: MouseEvent) => {
    e.preventDefault();

    if (this.selectedRange) {

      this.router.navigate(['/calendarizar'], {
        queryParams: {
          inicio: this.selectedRange.inicio,
          fin: this.selectedRange.fin
        }
      });

      // 🔥 LIMPIAR DESPUÉS
      this.selectedRange = null;
    }
  });
},

  eventClick: (info) => {

    // Guardar evento seleccionado
    this.eventoSeleccionado = info.event;

    // Quitar selección previa
    document.querySelectorAll('.fc-event').forEach(el => {
      el.classList.remove('evento-seleccionado');
    });

    // Marcar visualmente
    info.el.classList.add('evento-seleccionado');
  },
  //  eventos dinámicos desde API
  events: (info, successCallback, failureCallback) => {

    const start = info.startStr;
    const end = info.endStr;

    this.empleadoService.getVacaciones(2, start, end).subscribe({
      next: (data) => {
        console.log("EVENTOS:", data);
        successCallback(data); //  pinta los eventos
      },
      error: (err) => {
        console.error("ERROR EVENTOS:", err);
        failureCallback(err);
      }
    });
  },

  // 🔥 OPCIONAL (pero recomendado visualmente)
  eventDisplay: 'block'
};

  // =========================
  // 📅 VISTA AÑO (12 MESES)
  // =========================
  getCalendarOptions(month: number): CalendarOptions {
    return {
      initialView: 'dayGridMonth',

      plugins: [dayGridPlugin],

      locale: esLocale,

      initialDate: this.getMonthDate(month),

      headerToolbar: false,

      height: 220,

      fixedWeekCount: false,

      showNonCurrentDates: false
    };
  }

}