import { Component, OnInit, OnDestroy, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';
import { filter, isUndefined } from 'lodash';
import { Subscription } from 'rxjs/Rx';
import { Store } from '@ngrx/store';

// contains the shared app state code
// import { AppState } from '../app.state.service';
// import { ApiController } from '../app.api.service';
import * as model from '../../model';
import * as fromRoot from '../../reducers';
import * as actions from '../../actions';

//
//
//
//
//
//
//     mmmmmmm    mmmmmmm yyyyyyy           yyyyyyy
//   mm:::::::m  m:::::::mmy:::::y         y:::::y
//  m::::::::::mm::::::::::my:::::y       y:::::y
//  m::::::::::::::::::::::m y:::::y     y:::::y
//  m:::::mmm::::::mmm:::::m  y:::::y   y:::::y
//  m::::m   m::::m   m::::m   y:::::y y:::::y
//  m::::m   m::::m   m::::m    y:::::y:::::y
//  m::::m   m::::m   m::::m     y:::::::::y
//  m::::m   m::::m   m::::m      y:::::::y
//  m::::m   m::::m   m::::m       y:::::y
//  m::::m   m::::m   m::::m      y:::::y
//  mmmmmm   mmmmmm   mmmmmm     y:::::y
//                              y:::::y
//                             y:::::y
//                            y:::::y
//                           y:::::y
//                          yyyyyyy
//
//
@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'my',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './my.component.css' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './my.component.html'
})
export class MyComponent implements OnInit, AfterContentChecked, OnDestroy {

  /**
   * A quick access to the height of the container
   *
   * @type {number}
   * @memberOf MyComponent
   */
  public containerHeight: number = 0;

  /**
   * Used to set the card content's height since the height is dynamic based on the content
   *
   * @type {number}
   * @memberOf MyComponent
   */
  public trCardContentHeight: number = 0;

  /**
   * The user's attuid
   *
   * @type {string}
   * @memberOf MyComponent
   */
  public attUid: string = '';

  /**
   * The headers for the tr section of my assignments
   *
   * @type {HeaderStruct[]}
   * @memberOf MyComponent
   */
  public trHeaders: model.HeaderStruct[];

  /**
   * The headers for the order section of my assignments
   *
   * @type {HeaderStruct[]}
   * @memberOf MyComponent
   */
  public orderHeaders: model.HeaderStruct[];

  /**
   * Contains all TRs that are assigned to this user
   *
   * @type {model.transmission_requirements[]}
   * @memberOf MyComponent
   */
  public assignedTRs: model.transmission_requirements[];

  /**
   * Contains all Orders that are assigned to this user
   *
   * @type {model.orders[]}
   * @memberOf MyComponent
   */
  public assignedOrders: model.orders[];

  /**
   * Contains the order in which trs will be displayed
   *
   * @type {number[]}
   * @memberOf MyComponent
   */
  public trOrder: number[];

  /**
   * Contains the order in which orders will be displayed
   *
   * @type {number[]}
   * @memberOf MyComponent
   */
  public orderOrder: number[];

  public trHeaderTemp = model.DataTypes.trList;
  public orderHeaderTemp = model.DataTypes.orderList;

  /**
   * The distance from the view to the top of the container
   *
   * @type {number}
   * @memberOf MyComponent
   */
  public scrollTop: number[];

  /**
   * The distance from the view to the bottom of the container
   *
   * @private
   * @type {number}
   * @memberOf MyComponent
   */
  public scrollBottom: number[];

  /**
   * The height of the view
   *
   * @private
   * @type {number}
   * @memberOf MyComponent
   */
  public scrollHeight: number[];

  /**
   * The index to start rendering elements
   *
   * @type {number}
   * @memberOf MyComponent
   */
  public scrollStartIndex: number[];

  /**
   * The index to stop rendering elements
   *
   * @type {number}
   * @memberOf MyComponent
   */
  public scrollStopIndex: number[];

  /**
   * The height of the top spacer div
   *
   * @type {number}
   * @memberOf MyComponent
   */
  public scrollTopDivHeight: number[];

  /**
   * The height of the bottom spacer div
   *
   * @type {number}
   * @memberOf MyComponent
   */
  public scrollBottomDivHeight: number[];

  public length: number = 0;

  private forceUpdate: boolean = true;

  private heightSubscription: Subscription;
  private uIdSubscription: Subscription;
  private assignedTRsSubscription: Subscription;
  private assignedOrdersSubscription: Subscription;

  //
  //
  //      ffffffffffffffff
  //     f::::::::::::::::f
  //    f::::::::::::::::::f
  //    f::::::fffffff:::::f
  //    f:::::f       ffffffuuuuuu    uuuuuunnnn  nnnnnnnn        cccccccccccccccc
  //    f:::::f             u::::u    u::::un:::nn::::::::nn    cc:::::::::::::::c
  //   f:::::::ffffff       u::::u    u::::un::::::::::::::nn  c:::::::::::::::::c
  //   f::::::::::::f       u::::u    u::::unn:::::::::::::::nc:::::::cccccc:::::c
  //   f::::::::::::f       u::::u    u::::u  n:::::nnnn:::::nc::::::c     ccccccc
  //   f:::::::ffffff       u::::u    u::::u  n::::n    n::::nc:::::c
  //    f:::::f             u::::u    u::::u  n::::n    n::::nc:::::c
  //    f:::::f             u:::::uuuu:::::u  n::::n    n::::nc::::::c     ccccccc
  //   f:::::::f            u:::::::::::::::uun::::n    n::::nc:::::::cccccc:::::c
  //   f:::::::f             u:::::::::::::::un::::n    n::::n c:::::::::::::::::c
  //   f:::::::f              uu::::::::uu:::un::::n    n::::n  cc:::::::::::::::c
  //   fffffffff                uuuuuuuu  uuuunnnnnn    nnnnnn    cccccccccccccccc
  //
  //
  //
  //
  //
  //
  //

  /**
   * Creates an instance of MyComponent.
   * @param {AppState} appState contains the state of variables
   * @param {Router} router the router that can redirect
   *
   * @memberOf MyComponent
   */
  constructor(
    private router: Router,
    private store: Store<fromRoot.State>
  ) {}

  // public getData( array: number[], object: any): any {
  //   // for..in loop
  //   let output = [];
  //   for (let num in array) {
  //     if ( (num) === '' ) {
  //       output.push(object[0][num]);
  //     }
  //   }
  //   return output;
  // }

  public ngOnInit() {
    this.trHeaders = model.getHeaders(model.DataTypes.trList);
    this.orderHeaders = model.getHeaders(model.DataTypes.orderList);

    this.scrollBottom = [0, 0];
    this.scrollBottomDivHeight = [0, 0];
    this.scrollTop = [0, 0];
    this.scrollTopDivHeight = [0, 0];
    this.scrollStartIndex = [0, 0];
    this.scrollStopIndex = [0, 0];
    this.scrollHeight = [0, 0];

    this.assignedOrders = [];
    this.assignedTRs = [];

    this.orderOrder = [];
    this.trOrder = [];

    this.heightSubscription = this.store.select(fromRoot.getHeight).subscribe(
      (value: number) => {
        this.containerHeight = value;
        this.forceUpdate = true;
      }
    );

    this.uIdSubscription = this.store.select(fromRoot.getUserId).subscribe(
      (value: string) => {
        this.attUid = value;
        this.forceUpdate = true;
      }
    );

    this.assignedTRsSubscription = this.store.select(fromRoot.getAssignedTrs).subscribe(
      (value: model.transmission_requirements[]) => {
        this.assignedTRs = value;
        this.trOrder = Array.from({length: this.assignedTRs.length}, (v, i) => i);
        this.length = this.assignedTRs.length;
      }
    );

    this.assignedOrdersSubscription = this.store.select(fromRoot.getAssignedOrders).subscribe(
      (value: model.orders[]) => {
        this.assignedOrders = value;
        this.orderOrder = Array.from({length: this.assignedOrders.length}, (v, i) => i);
      }
    );
  }

  public ngOnDestroy() {
    if (!isUndefined(this.heightSubscription)) {
      this.heightSubscription.unsubscribe();
    }

    if (!isUndefined(this.uIdSubscription)) {
      this.uIdSubscription.unsubscribe();
    }

    if (!isUndefined(this.assignedOrdersSubscription)) {
      this.assignedOrdersSubscription.unsubscribe();
    }

    if (!isUndefined(this.assignedTRsSubscription)) {
      this.assignedTRsSubscription.unsubscribe();
    }
  }
  //   this.listDataSet = false;

  //   // this.dummyData = new DataCreatorStub(this.appState.get('data'));\
  //   this.appState.set('view', `Home - ${ this.appState.get('data') } List`);

  //   // set subscribe to undefined
  //   this.updateSubscription = undefined;

  //   this.homeSub = this.activeRoute.params.subscribe((params) => {
  //     if ( params['list'] !== undefined ) {
  //       this.shouldBeOn = params['list'];
  //     } else {
  //       this.shouldBeOn = 'TR';
  //     }
  //   });
  // }

  /**
   * Angular 2 lifecycle hook
   *
   *
   * @memberOf MyComponent
   */
  public ngAfterContentChecked() {
    /**
     * 0.75 * tempOffsetHeight = max height of the card
     * 64 = height of header of card
     * 10 = bottom margin of header of card
     */
    let tempTrCardContentHeight = 0.75 * this.containerHeight - 64 - 10;

    if ( this.forceUpdate || this.trCardContentHeight !== tempTrCardContentHeight ) {
      this.forceUpdate = false;

      this.store.dispatch(new actions.SetViewAction('My Assignments'));

      // Sets the tr card content height
      this.trCardContentHeight = tempTrCardContentHeight;
    }
  }
  
  //   // get the data type we are working with
  //   this.dataName = this.appState.get('data');

  //   // if ( this.tableView !== undefined ) {
  //   //   console.log(this.tableView.nativeElement.offsetHeight);
  //   // }

  //   /**
  //    * This section of code allows the back button to work. How it works is that when it checks the
  //    * param passed by the url is different then what the current data we are looking at is it'll re route
  //    * the view to the correct one
  //    */
  //   if ( this.shouldBeOn !== this.dataName ) {
  //     // if statement done if the url has no passed param
  //     if ( this.shouldBeOn === undefined || ['Site', 'TR', 'Part', 'Order'].indexOf(this.shouldBeOn) < 0 ) {
  //       this.shouldBeOn = 'TR';
  //     }

  //     // re routes view
  //     this.appState.set('data', this.shouldBeOn);
  //     this.dataName = this.shouldBeOn;
  //     this.route.navigateByUrl(`/home/${ this.shouldBeOn }`);
  //   }

  //   /**
  //    * This is necessary because it seems this lifecycle function is run several times,
  //    * For instance it is ran at least 3 times after each heartbeat
  //    */
  //   if ( this.lastDataName !== this.dataName ) {
  //     // set the view name
  //     this.appState.set('view', `Home - ${ this.dataName } List`);

  //     // reset scroll variables
  //     this.scrollBottom = 0;
  //     this.scrollBottomDivHeight = 0;
  //     this.scrollTop = 0;
  //     this.scrollTopDivHeight = 0;
  //     this.scrollStartIndex = 0;
  //     this.scrollStopIndex = 0;

  //     // if there is already a subscribed to emitter
  //     if ( this.updateSubscription !== undefined ) {
  //       this.updateSubscription.unsubscribe();
  //     }

  //     // subscibes to the list emitter for new list data
  //     this.updateSubscription = this.appState.getEmitter(`list-${ this.dataName }`).subscribe(
  //       (list: Object[]) => {
  //         this.listData = list;
  //         this.headers = this.getHeaders(this.dataName);
  //         this.headerLength = this.headers.length;
  //         this.fxFlexString = '1 1 ' + String(Math.floor(100 / ((this.headerLength).valueOf()))) + '%';
  //         this.listOrder = Array.from({length: this.listData.length}, (v, i) => i);
  //         this.listDataSet = true;
  //       },
  //       (err: any) => {
  //         // Log errors if any
  //         console.log(err);
  //       }
  //     );

  //     // If there is already data that is usable
  //     if ( this.appState.isSet(`list-${ this.dataName }`) ) {
  //       this.listData = this.appState.get('list-' + this.dataName);
  //       this.headers = this.getHeaders(this.appState.get('data'));
  //       this.headerLength = this.headers.length;
  //       this.fxFlexString = '1 1 ' + String(Math.floor(100 / ((this.headerLength).valueOf()))) + '%';
  //       this.listOrder = Array.from({length: this.listData.length}, (v, i) => i);
  //       this.listDataSet = true;
  //     }

  //     // sets data name so that we don't recall subscriptions or data
  //     this.lastDataName = this.dataName;

  //     // set the scroll default
  //     this.setDistances([0, 0]);
  //   }
  // }

  // /**
  //  * Lifecycle hook only when this component is dying
  //  *
  //  *
  //  * @memberOf HomeComponent

  //   this.updateSubscription.unsubscribe();
  //   this.homeSub.unsubscribe();
  // }

  // //
  // //  bbbbbbbb
  // //  b::::::b                     tttt
  // //  b::::::b                  ttt:::t
  // //  b::::::b                  t:::::t
  // //   b:::::b                  t:::::t
  // //   b:::::bbbbbbbbb    ttttttt:::::ttttttt  nnnn  nnnnnnnn
  // //   b::::::::::::::bb  t:::::::::::::::::t  n:::nn::::::::nn
  // //   b::::::::::::::::b t:::::::::::::::::t  n::::::::::::::nn
  // //   b:::::bbbbb:::::::btttttt:::::::tttttt  nn:::::::::::::::n
  // //   b:::::b    b::::::b      t:::::t          n:::::nnnn:::::n
  // //   b:::::b     b:::::b      t:::::t          n::::n    n::::n
  // //   b:::::b     b:::::b      t:::::t          n::::n    n::::n
  // //   b:::::b     b:::::b      t:::::t    ttttttn::::n    n::::n
  // //   b:::::bbbbbb::::::b      t::::::tttt:::::tn::::n    n::::n
  // //   b::::::::::::::::b       tt::::::::::::::tn::::n    n::::n
  // //   b:::::::::::::::b          tt:::::::::::ttn::::n    n::::n
  // //   bbbbbbbbbbbbbbbb             ttttttttttt  nnnnnn    nnnnnn
  // //
  // //
  // //
  // //
  // //
  // //
  // //

  /**
   * Function used by home list to navigate to add a new data entry
   *
   *
   * @memberOf AppComponent
   */
  public add() {
    // this.appState.set('view', `Add ${ this.dataName }`);
    // this.appState.set('selected', '');
    // this.route.navigateByUrl('/access');
  }

  /**
   * Function used by home list to navigate to view a data entry
   *
   * @param {string} id
   *
   * @memberOf HomeComponent
   */
  public view(id: string, type: string) {
    // this.appState.set('view', `View ${ this.dataName }`);
    // this.appState.set('selected', id);
    // this.route.navigateByUrl('/access');
  }

  /**
   * Funciton used by home list to navigate to edit a data entry
   *
   * @param {string} id
   *
   * @memberOf HomeComponent
   */
  public edit(id: string, type: string) {
    // this.appState.set('view', `Edit ${ this.dataName }`);
    // this.appState.set('selected', id);
    // this.route.navigateByUrl('/access');
  }

  /**
   * Sort ascending
   *
   * @param {string} field
   *
   * @memberOf HomeComponent
   */
  public asc(field: string) {
    // this.listData = this.listData.sort( (n1: any, n2: any) => {
    //     if (String(n1[field]).toLowerCase() > String(n2[field]).toLowerCase()) {
    //       return 1;
    //     }

    //     if (String(n1[field]).toLowerCase() < String(n2[field]).toLowerCase()) {
    //       return -1;
    //     }

    //     return 0;
    // });
  }

  /**
   * Sort descending
   *
   * @param {string} field
   *
   * @memberOf HomeComponent
   */
  public dsc(field: string) {
    // this.listData = this.listData.sort( (n1: any, n2: any) => {
    //     if (String(n1[field]).toLowerCase() < String(n2[field]).toLowerCase()) {
    //       return 1;
    //     }

    //     if (String(n1[field]).toLowerCase() > String(n2[field]).toLowerCase()) {
    //       return -1;
    //     }

    //     return 0;
    // });
  }

  //
  //
  //                                                                            lllllll lllllll
  //                                                                            l:::::l l:::::l
  //                                                                            l:::::l l:::::l
  //                                                                            l:::::l l:::::l
  //      ssssssssss       ccccccccccccccccrrrrr   rrrrrrrrr      ooooooooooo    l::::l  l::::l
  //    ss::::::::::s    cc:::::::::::::::cr::::rrr:::::::::r   oo:::::::::::oo  l::::l  l::::l
  //  ss:::::::::::::s  c:::::::::::::::::cr:::::::::::::::::r o:::::::::::::::o l::::l  l::::l
  //  s::::::ssss:::::sc:::::::cccccc:::::crr::::::rrrrr::::::ro:::::ooooo:::::o l::::l  l::::l
  //   s:::::s  ssssss c::::::c     ccccccc r:::::r     r:::::ro::::o     o::::o l::::l  l::::l
  //     s::::::s      c:::::c              r:::::r     rrrrrrro::::o     o::::o l::::l  l::::l
  //        s::::::s   c:::::c              r:::::r            o::::o     o::::o l::::l  l::::l
  //  ssssss   s:::::s c::::::c     ccccccc r:::::r            o::::o     o::::o l::::l  l::::l
  //  s:::::ssss::::::sc:::::::cccccc:::::c r:::::r            o:::::ooooo:::::ol::::::ll::::::l
  //  s::::::::::::::s  c:::::::::::::::::c r:::::r            o:::::::::::::::ol::::::ll::::::l
  //   s:::::::::::ss    cc:::::::::::::::c r:::::r             oo:::::::::::oo l::::::ll::::::l
  //    sssssssssss        cccccccccccccccc rrrrrrr               ooooooooooo   llllllllllllllll
  //
  //
  //
  //
  //
  //
  //

  /**
   * Sets the scroll space on top and below the div
   *
   * @param {number[]} input
   *
   * @memberOf HomeComponent
   */
  public setDistances(input: number[], index: number) {
    // the height of a single element
    const elementHeight = 83;

    /**
     * The two following sections set the scrollTop and bottom variables
     * these variables are used to know where on the scroll bar the user is
     */
     // scrollTop = input[0]
    if ( input[0] !== this.scrollTop[index] ) {
      this.scrollTop[index] = input[0];
    }

    // scrollBottom = input[1]
    if ( input[1] !== this.scrollBottom[index] ) {
      this.scrollBottom[index] = input[1];
    }

    /**
     * The following deal with setting the div's scroll heights so that the div can change size
     */

    // set the top scroll height
    if ( this.scrollTop[index] <= 0 ) {
      this.scrollStartIndex[index] = 0;
      this.scrollTopDivHeight[index] = 0;
    } else {
      /**
       * the total number of elements that fit fully into the space
       * also take away an element such that there is a little bit of a spacer when scrolling
       */
      const numberOfElements = Math.max(0, Math.floor(this.scrollTop[index] / elementHeight) - 1 );
      const height = numberOfElements * elementHeight;
      if ( height !== this.scrollTopDivHeight[index] ) {
        this.scrollStartIndex[index] = numberOfElements;
        this.scrollTopDivHeight[index] = height;
      }
    }

    // set the bottom scroll height
    if ( this.scrollBottom[index] <= 0 && this.scrollTop[index] <= 0 ) {
      this.scrollStopIndex[index] = Math.max(0, Math.floor(this.scrollHeight[index] / elementHeight) + 1 );
      this.scrollBottomDivHeight[index] = 0;
    } else {
      /**
       * the total number of elements that fit fully into the space
       * also take away an element such that there is a little bit of a spacer when scrolling
       */
      const numberOfElements = Math.max(0, Math.floor(this.scrollBottom[index] / elementHeight) - 1 );
      const height = Math.max(0, numberOfElements * elementHeight - 5);
      if ( height !== this.scrollBottomDivHeight[index] ) {
        if ( index === 0) {
          this.scrollStopIndex[index] = this.assignedTRs.length - numberOfElements;
        } else {
          this.scrollStopIndex[index] = this.assignedOrders.length - numberOfElements;
        }
        this.scrollBottomDivHeight[index] = height;
      }
    }
  }

  /**
   * Sets the height for the scroll div
   *
   * @param {number} input
   *
   * @memberOf HomeComponent
   */
  public setHeight(input: number, index: number) {
    if ( input !== this.scrollHeight[index] ) {
      this.scrollHeight[index] = input;
    }
  }

  /**
   * Returns the height, in px, that the container has to be to contain all the data elements
   *
   * @returns {number}
   *
   * @memberOf HomeComponent
   */
  public getHeight(index: number): number {
    // Each element is 83px tall or
    // 36px header + 42px body + 5px bottom margin
    // the last elements margin-bottom isn't included that is why the -5 is there
    if ( index === 0 ) {
      return Math.max(0, this.assignedTRs.length * 83 - 5);
    } else {
      return Math.max(0, this.assignedOrders.length * 83 - 5);
    }
  }
}
