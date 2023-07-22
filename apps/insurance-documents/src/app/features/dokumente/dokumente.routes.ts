import { Route } from '@angular/router';
import { DokumenteView } from './dokumente/dokumente.view';
import { DokumentNewDialog } from './dokument-new/dokument-new.dialog';

const routes: Route[] = [
  {
    path: '',
    component: DokumenteView,
    children: [{ path: 'neu', component: DokumentNewDialog }]
  }
];

export default routes;
