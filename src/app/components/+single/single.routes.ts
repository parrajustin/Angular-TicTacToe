import { SingleComponent } from './single.component';

export const routes = [
  { path: '', children: [
    { path: '', component: SingleComponent },
  ]},
];
