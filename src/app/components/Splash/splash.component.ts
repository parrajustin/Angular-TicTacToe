import { Component, AfterContentChecked } from '@angular/core';
import { Store } from '@ngrx/store';

import { DataTypes } from '../../model';
import * as fromRoot from '../../reducers';
import * as state from '../../actions/state';

@Component({
  selector: 'splash',
  providers: [],
  styleUrls: [ './splash.component.css' ],
  template: `
    <div class="splash-container" fxLayout="row">
      <div fxLayoutAlign="center center" fxFlex="1 1 100%">
        <img [src]="logoSrc">
      </div>
    </div>
  `
})
export class SplashComponent implements AfterContentChecked {
  /**
   * The location of the logo for the splash
   *
   *
   * @memberof SplashComponent
   */
  public logoSrc: string = 'assets/img/logo.png';

  /**
   * Creates an instance of SplashComponent.
   * @param {Store<fromRoot.State>} store the global app redux store
   *
   * @memberof SplashComponent
   */
  constructor(
    private store: Store<fromRoot.State>
  ) {}

  /**
   * Angular 2 lifecycle hook
   *
   *
   * @memberof SplashComponent
   */
  public ngAfterContentChecked() {
    this.store.dispatch(new state.SetTypeAction(null));
    this.store.dispatch(new state.SetViewAction('RF Engineering Website'));
  }
}
