import { Routes } from '@angular/router';

// components
import { BoardComponent } from './components/board';

/**
 * Not to sure why this is necessary but if you remove it
 * a lot of errors get thrown
 *
 * TODO: fix router dependency on this
 *
 * DON'T DELTE
 */
import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: '',      component: BoardComponent },
  // { path: 'home/:list',  component: ListComponent },
  // { path: 'home',  component: ListComponent },
  // { path: 'assignments', component: MyComponent },
  // { path: 'access', loadChildren: './components/+single#SingleModule' },
  { path: '**',    component: BoardComponent },
];
