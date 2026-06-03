import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  private apiUrl = 'http://localhost:5071/api/empleado/dias';

  constructor(private http: HttpClient) {}

  getDias(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}