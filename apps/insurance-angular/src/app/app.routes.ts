import { Route } from '@angular/router';
import { AppComponent } from './app.component';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'dokumente' },
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: 'dokumente',
        loadChildren: async () => await import('./features/dokumente/dokumente.routes')
      }
    ]
  }
];
