import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FlowComponent } from './blogs/flow/flow.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'flow',
    component: FlowComponent
  }
];
