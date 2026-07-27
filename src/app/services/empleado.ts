import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  private apiUrl = 'http://18.219.177.118:5000/api/empleado/dias';

  constructor(private http: HttpClient) {}

  getDias(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getVacaciones(empleadoId: number, start: string, end: string) {
  return this.http.get<any[]>(
    `http://18.219.177.118:5000/api/Vacaciones?empleadoId=${empleadoId}&start=${start}&end=${end}`
  );
}
}