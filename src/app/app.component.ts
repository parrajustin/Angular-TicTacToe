/*
 * Angular 2 decorators and services
 */
import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild, ElementRef, AfterContentChecked, EventEmitter,
  ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { isUndefined } from 'lodash';

import * as model from './model';
import * as fromRoot from './reducers';
import * as actions from './actions/state';
import { ApiController } from './services';
import { DataTypes } from './model';

/**
 * This apps top level component
 *
 * @export
 * @class AppComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  // /**
  //  * Reference to the container that holds this entire component
  //  * used to know the usable width and height
  //  *
  //  * @type {ElementRef}
  //  * @memberOf MyComponent
  //  */
  // @ViewChild('mainContainer') public container: ElementRef;

  // /**
  //  * Weather or not the sidebar is currently open
  //  *
  //  * @type {boolean}
  //  * @memberOf AppComponent
  //  */
  // public openedSet: boolean = false;

  // /**
  //  * The mode of the sidebar
  //  *
  //  * @type {string}
  //  * @memberOf AppComponent
  //  */
  // public modeSet: string = 'over';

  // /**
  //  * The width of the window
  //  *
  //  * @type {number}
  //  * @memberOf AppComponent
  //  */
  // public windowWidth: number = 0;

  // /**
  //  * The height of the component view
  //  *
  //  * @type {number}
  //  * @memberOf AppComponent
  //  */
  // public componentHeight: number = 0;

  // /**
  //  * The width of the component view
  //  *
  //  * @type {number}
  //  * @memberOf AppComponent
  //  */
  // public componentWidth: number = 0;

  // /**
  //  * The text displayed on the header of the app
  //  *
  //  * @type {string}
  //  * @memberof AppComponent
  //  */
  // public header: string = '';

  // public cartLength: number = 0;

  // /**
  //  * The subscription for the header text
  //  * this sets both the header text and the data type
  //  *
  //  * @private
  //  * @type {Subscription}
  //  * @memberof AppComponent
  //  */
  // private headerSubscription: Subscription;

  // /**
  //  * The subscription to set the view variable for the header
  //  *
  //  * @private
  //  * @type {Subscription}
  //  * @memberof AppComponent
  //  */
  // private viewSubscription: Subscription;

  // /**
  //  * The view variable that holds the first section of the header
  //  *
  //  * @private
  //  * @type {string}
  //  * @memberof AppComponent
  //  */
  // private view: string = '';

  // /**
  //  * The type variable holds the current datatype the app is on
  //  *
  //  * @private
  //  * @type {DataTypes}
  //  * @memberof AppComponent
  //  */
  // private type: DataTypes;

  // /**
  //  * Subscription for accessing the button emitter to send button commands
  //  *
  //  * @private
  //  * @type {Subscription}
  //  * @memberof AppComponent
  //  */
  // private buttonSubscription: Subscription;

  // /**
  //  * Emitter to send button commands to the children components
  //  *
  //  * @private
  //  * @type {EventEmitter<string>}
  //  * @memberof AppComponent
  //  */
  // private buttonEmitter: EventEmitter<string>;

  // private cartSubscription: Subscription;

  // /**
  //  * Creates an instance of AppComponent.
  //  * @param {Router} router router service controller
  //  * @param {ApiController} apiHost reference to api access
  //  * @param {Store<fromRoot.State>} store app-wide state
  //  *
  //  * @memberof AppComponent
  //  */
  // constructor(
  //   public router: Router,
  //   public apiHost: ApiController,
  //   private store: Store<fromRoot.State>
  //   // private cdr: ChangeDetectorRef
  // ) {}

  // /**
  //  * Lifecycle hook only when this component is being initialized
  //  *
  //  *
  //  * @memberOf AppComponent
  //  */
  // public ngOnInit() {

  //   // Checks the size of the window
  //   if ( window.innerWidth > 960 ) {
  //     this.windowWidth = window.innerWidth;
  //     this.modeSet = 'side';
  //     this.openedSet = true;
  //   }

  //   this.componentHeight = this.container.nativeElement.offsetHeight;
  //   this.componentWidth = this.container.nativeElement.offsetWidth;

  //   this.store.dispatch(new actions.SetHeightAction(this.componentHeight));
  //   this.store.dispatch(new actions.SetWidthAction(this.componentHeight));
  //   this.store.dispatch(new actions.SetTypeAction(model.DataTypes.trList));

  //   // view store subscription
  //   this.viewSubscription = this.store.select(fromRoot.getView).subscribe(
  //     (value: string) => {
  //       this.view = value;
  //       // this.cdr.detectChanges();
  //     }
  //   );

  //   this.buttonSubscription = this.store.select(fromRoot.getButtonEmitter).subscribe(
  //     (value: EventEmitter<string>) => {
  //       this.buttonEmitter = value;
  //     }
  //   );

  //   // data type store subscription
  //   this.headerSubscription = this.store.select(fromRoot.getDataType).subscribe(
  //     (value: DataTypes) => {
  //       let typeString = '';

  //       switch (value) {
  //         default:
  //           typeString = '';
  //           break;
  //         case DataTypes.trList:
  //           typeString = 'TR';
  //           break;
  //         case DataTypes.siteList:
  //           typeString = 'Site';
  //           break;
  //         case DataTypes.partList:
  //           typeString = 'Part';
  //           break;
  //         case DataTypes.orderList:
  //           typeString = 'Order';
  //           break;
  //       }

  //       this.header = this.view + ' ' + typeString;
  //       this.type = value;
  //     }
  //   );

  //   this.cartSubscription = this.store.select(fromRoot.getCart).subscribe(
  //     (value: model.equipment_reference[]) => {
  //       this.cartLength = value.length;
  //     }
  //   );
  // }

  // /**
  //  * Angular 2 lifecycle hook
  //  *
  //  *
  //  * @memberOf AppComponent
  //  */
  // public ngAfterContentChecked() {
  //   let tempWindowWidth = window.innerWidth;
  //   let tempHeight = this.container.nativeElement.offsetHeight;
  //   let tempWidth = this.container.nativeElement.offsetWidth;

  //   if ( tempWindowWidth !== this.windowWidth || tempWidth !== this.componentWidth || tempHeight !== this.componentHeight ) {
  //     this.windowWidth = tempWindowWidth;
  //     this.componentHeight = tempHeight;
  //     this.componentWidth = tempWidth;

  //     this.store.dispatch(new actions.SetHeightAction(this.componentHeight));
  //     this.store.dispatch(new actions.SetWidthAction(this.componentHeight));

  //     if ( this.windowWidth > 960 ) {
  //       this.modeSet = 'side';
  //     } else {
  //       this.modeSet = 'over';
  //     }

  //   }
  // }

  // /**
  //  * Lifecycle hook only when this component is dying
  //  *
  //  *
  //  * @memberOf AppComponent
  //  */
  // public ngOnDestroy() {
  //   // this.apiHost.stopSubscriptions();

  //   if (!isUndefined(this.headerSubscription)) {
  //     this.headerSubscription.unsubscribe();
  //   }

  //   if (!isUndefined(this.viewSubscription)) {
  //     this.viewSubscription.unsubscribe();
  //   }

  //   if (!isUndefined(this.buttonSubscription)) {
  //     this.buttonSubscription.unsubscribe();
  //   }

  //   if (!isUndefined(this.cartSubscription)) {
  //     this.cartSubscription.unsubscribe();
  //   }
  // }

  // /**
  //  * Function used by sidbar to navigate to tr home list
  //  *
  //  *
  //  * @memberOf AppComponent
  //  */
  // public trHome() {
  //   this.store.dispatch(new actions.SetTypeAction(DataTypes.trList));
  //   this.router.navigateByUrl('/home/TR');
  // }

  // /**
  //  * Funciton used by sidebar to navigate to tr add component
  //  *
  //  *
  //  * @memberOf AppComponent
  //  */
  // public trAdd() {
  //   this.store.dispatch(new actions.SetTypeAction(DataTypes.trList));
  //   this.store.dispatch(new actions.SetViewAction('Add'));
  //   this.router.navigateByUrl('/access');
  // }

  // /**
  //  * Function used by sidebar to navigate to site home list
  //  *
  //  *
  //  * @memberOf AppComponent
  //  */
  // public siteHome() {
  //   this.store.dispatch(new actions.SetTypeAction(DataTypes.siteList));
  //   this.router.navigateByUrl('/home/Site');
  // }

  // /**
  //  * Funciton used by sidebar to navigate to the site add component
  //  *
  //  *
  //  * @memberOf AppComponent
  //  */
  // public siteAdd() {
  //   this.store.dispatch(new actions.SetTypeAction(DataTypes.siteList));
  //   this.store.dispatch(new actions.SetViewAction('Add'));
  //   this.router.navigateByUrl('/access');
  // }

  // /**
  //  * Function used by sidebar to navigate to part home list
  //  *
  //  *
  //  * @memberOf AppComponent
  //  */
  // public partHome() {
  //   this.store.dispatch(new actions.SetTypeAction(DataTypes.partList));
  //   this.router.navigateByUrl('/home/Part');
  // }

  // /**
  //  * Funciton used by sidebar to navigate to part add component
  //  *
  //  *
  //  * @memberOf AppComponent
  //  */
  // public partAdd() {
  //   this.store.dispatch(new actions.SetTypeAction(DataTypes.partList));
  //   this.store.dispatch(new actions.SetViewAction('Add'));
  //   this.router.navigateByUrl('/access');
  // }

  // /**
  //  * Function used by sidebar to navigate to order home list
  //  *
  //  *
  //  * @memberOf AppComponent
  //  */
  // public orderHome() {
  //   this.store.dispatch(new actions.SetTypeAction(DataTypes.orderList));
  //   this.router.navigateByUrl('/home/Order');
  // }

  // /**
  //  * Function used by sidebar to navigate to order add component
  //  *
  //  *
  //  * @memberOf AppComponent
  //  */
  // public orderAdd() {
  //   this.store.dispatch(new actions.SetTypeAction(DataTypes.orderList));
  //   this.store.dispatch(new actions.SetViewAction('Add'));
  //   this.router.navigateByUrl('/access');
  // }

  // /**
  //  * Function used by sidebar to navigate to add a site
  //  *
  //  *
  //  * @memberOf AppComponent
  //  */
  // public addSite() {
  //   this.store.dispatch(new actions.SetTypeAction(DataTypes.siteList));
  //   this.store.dispatch(new actions.SetViewAction('Add'));
  //   this.router.navigateByUrl('/add');
  // }

  // /**
  //  * Function used by sidebar to navigate to the my component
  //  *
  //  *
  //  * @memberOf AppComponent
  //  */
  // public myAssignments() {
  //   this.store.dispatch(new actions.SetTypeAction(100));
  //   this.router.navigateByUrl('/assignments');
  // }

  // /**
  //  * Function used by sidebar to check if we are currently on the tr pages
  //  *
  //  * @returns {boolean}
  //  *
  //  * @memberOf AppComponent
  //  */
  // public isTR(): boolean {
  //   return this.type === DataTypes.trList;
  // }

  // /**
  //  * Function used by sidebar to check if we are currently on teh site pages
  //  *
  //  * @returns {boolean}
  //  *
  //  * @memberOf AppComponent
  //  */
  // public isSite(): boolean {
  //   return this.type === DataTypes.siteList;
  // }

  // /**
  //  * Function used by sidebar to check if we are currently on the order pages
  //  *
  //  * @returns {boolean}
  //  *
  //  * @memberOf AppComponent
  //  */
  // public isOrder(): boolean {
  //   return this.type === DataTypes.orderList;
  // }

  // /**
  //  * Function used by sidebar to check if we are currently on the part pages
  //  *
  //  * @returns {boolean}
  //  *
  //  * @memberOf AppComponent
  //  */
  // public isPart(): boolean {
  //   return this.type === DataTypes.partList;
  // }

  // /**
  //  * function used by sidebar to check if we are currently on my assignments
  //  *
  //  * @returns {boolean}
  //  *
  //  * @memberOf AppComponent
  //  */
  // public isAssignment(): boolean {
  //   return this.view === 'My Assignments';
  // }

  // public isView(): boolean {
  //   return this.view === 'View';
  // }

  // public isAdd(): boolean {
  //   return this.view === 'Add';
  // }

  // public isEdit(): boolean {
  //   return this.view === 'Edit';
  // }

  // public headerButtonEvent() {
  //   console.log('test click');
  //   if ( this.isAdd() ) {
  //     this.buttonEmitter.emit('add');
  //   } else if ( this.isEdit() ) {
  //     this.buttonEmitter.emit('edit');
  //   } else if ( this.isView() ) {
  //     this.buttonEmitter.emit('view');
  //   } else if (this.isPart() && !this.isView() && !this.isAdd() && !this.isEdit()) {
  //     console.log('emitted');
  //     this.buttonEmitter.emit('checkout');
  //   }
  // }
}
