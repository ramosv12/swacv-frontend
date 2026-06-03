import { Routes } from '@angular/router';
import { CalendarioComponent } from './pages/calendario/calendario';

export const routes: Routes = [
  { path: '', redirectTo: 'calendario', pathMatch: 'full' },
  { path: 'calendario', component: CalendarioComponent }
];
