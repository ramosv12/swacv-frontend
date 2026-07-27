import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';



@Component({
  selector: 'app-calendarizar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule
  ],
  templateUrl: './calendarizar.html',
  styleUrl: './calendarizar.css'
})
export class Calendarizar implements OnInit{

  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  observaciones: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  get diasHabiles(): number {
    if (!this.fechaInicio || !this.fechaFin) return 0;

    const inicio = new Date(this.fechaInicio);
    const fin = new Date(this.fechaFin);

    let dias = 0;

    while (inicio <= fin) {
      const dia = inicio.getDay();
      if (dia !== 0 && dia !== 6) {
        dias++;
      }
      inicio.setDate(inicio.getDate() + 1);
    }

    return dias;
  }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      console.log("PARAMS:", params); // DEBUG

      //  LIMPIAR SIEMPRE PRIMERO
      this.fechaInicio = null;
      this.fechaFin = null;

      if (params['inicio']) {
        const [year, month, day] = params['inicio'].split('-').map(Number);
        this.fechaInicio = new Date(year, month - 1, day);
      }

      if (params['fin']) {
        const [y, m, d] = params['fin'].split('-').map(Number);

        const fin = new Date(y, m - 1, d);

        fin.setDate(fin.getDate() - 1); // ✔ mantener esto

        this.fechaFin = fin;
      }

      // Si solo seleccionaron un día
      if (params['inicio'] && !params['fin']) {
        this.fechaFin = this.fechaInicio;
      }

    });

  }

  limpiar() {
    this.fechaInicio = undefined as any;
    this.fechaFin = undefined as any;
    this.observaciones = '';
  }

  formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');

    return `${y}-${m}-${d}`;
  }

  enviar() {
    if (!this.fechaInicio || !this.fechaFin) {
      alert("Selecciona fechas");
      return;
    }

    const payload = {
      fechaInicio: this.formatDate(this.fechaInicio),
      fechaFin: this.formatDate(this.fechaFin),
      comentarios: this.observaciones
    };

    // 👇 puedes dejar esto (debug útil)
    console.log("Payload enviado:", payload);

    this.http.post('http://localhost:5071/api/Vacaciones', payload)
      .subscribe({
        next: () => {
          console.log("Guardado correctamente");

          alert("Vacaciones guardadas");

          this.router.navigate(['/calendario']);
        },
            error: (err) => {
          console.error("ERROR COMPLETO:", err);
          alert(JSON.stringify(err.error || err));
        }
          });
    }
}
