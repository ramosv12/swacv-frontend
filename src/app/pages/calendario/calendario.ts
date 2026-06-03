import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { EmpleadoService } from '../../services/empleado';

@Component({
  selector: 'app-calendario',
  imports: [CommonModule, MatCardModule],
  templateUrl: './calendario.html',
  styleUrl: './calendario.css',
})
export class CalendarioComponent implements OnInit {

  months = [
    'Enero','Febrero','Marzo','Abril',
    'Mayo','Junio','Julio','Agosto',
    'Septiembre','Octubre','Noviembre','Diciembre'
  ];

  days = Array.from({ length: 30 }, (_, i) => i + 1);

  diasDisponibles: number = 12;

  constructor(private empleadoService: EmpleadoService) {}

  ngOnInit(): void {
  console.log("INIT CALENDARIO");

  this.empleadoService.getDias().subscribe({
    next: (data) => {
      console.log("DATA COMPLETA:", data);
      this.diasDisponibles = data?.diasVacacionesDisponibles ?? 0;
    },
    error: (err) => {
      console.error("ERROR:", err);
    }
  });
}
}