import { Routes } from '@angular/router';
import { CalendarioComponent } from './pages/calendario/calendario';
import { Calendarizar } from './pages/calendarizar/calendarizar';

export const routes: Routes = [
  { path: '', redirectTo: 'calendario', pathMatch: 'full' },
  { path: 'calendario', component: CalendarioComponent },
  { path: 'calendarizar',component: Calendarizar}
];
