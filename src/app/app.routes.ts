import { Routes } from '@angular/router';

import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ListComponent } from './features/list/list.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: DashboardComponent },
          { path: 'list', component: ListComponent}
        ]
      }
];
