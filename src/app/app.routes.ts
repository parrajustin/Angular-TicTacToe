import { Routes } from '@angular/router';

// components
import { ListComponent } from './components/home';
import { SingleComponent } from './components/single';
import { NoContentComponent } from './components/no-content';
import { MyComponent } from './components/my';
import { SplashComponent } from './components/Splash';

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
  { path: '',      component: SplashComponent },
  { path: 'home/:list',  component: ListComponent },
  { path: 'home',  component: ListComponent },
  { path: 'assignments', component: MyComponent },
  { path: 'access', loadChildren: './components/+single#SingleModule' },
  { path: '**',    component: NoContentComponent },
];
