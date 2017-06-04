import { MdButtonModule, MdCardModule, MdProgressSpinnerModule, MdInputModule, MdSelectModule, MdToolbarModule, MdIconModule,
  MdOptionModule, MdCheckboxModule, MdSnackBarModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout'; // used for layout design
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScrollModule } from '../scrollWrapper';

import { GetSelectedSites, GetSlice, GetParts } from '../../pipes';
import { routes } from './single.routes';

import { SingleComponent } from './single.component';
import { SiteComponent } from './site';
import { TRComponent } from './tr';
import { PartComponent } from './part';
import { OrderComponent } from './order';

import { StoreModule } from '@ngrx/store';
import { reducer } from '../../reducers';

@NgModule({
  bootstrap: [ SingleComponent ],
  declarations: [
    // Components / Directives/ Pipes
    SiteComponent,
    TRComponent,
    PartComponent,
    SingleComponent,
    GetSelectedSites,
    OrderComponent,
    GetSlice,
    GetParts
  ],
  imports: [
    MdButtonModule,
    MdCardModule,
    MdProgressSpinnerModule,
    MdInputModule,
    MdOptionModule,
    MdCheckboxModule,
    MdSnackBarModule,
    MdSelectModule,
    MdToolbarModule,
    MdIconModule,
    FlexLayoutModule,
    CommonModule,
    FormsModule,
    ScrollModule,
    RouterModule.forChild(routes)
  ],
})
export class SingleModule {
  public static routes = routes;
}
