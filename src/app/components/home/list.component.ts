import { Component, OnInit, OnDestroy, AfterContentChecked, ElementRef, ContentChild, ChangeDetectorRef,
  EventEmitter } from '@angular/core';
import { trigger, state, transition, style, animate, keyframes, AnimationEvent } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { isUndefined, isNull, find } from 'lodash';
import { Store } from '@ngrx/store';

// contains the shared app state code
import { ApiController } from '../../services';
import * as model from '../../model';
import * as fromRoot from '../../reducers';
import * as actions from '../../actions';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'list',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './list.component.css' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit, AfterContentChecked, OnDestroy {

  /**
   * Makes the current data type avaliable to the component
   *
   * @type {string}
   * @memberOf HomeComponent
   */
  public dataName: model.DataTypes;

  /**
   * The last data type that was being viewed
   *
   * @type {string}
   * @memberOf HomeComponent
   */
  public lastDataName: model.DataTypes;

  /**
   * This string array contains the header metadata for the current data
   * @type {HeaderStruct[]}
   * @memberOf HomeComponent
   */
  public headers: model.HeaderStruct[];

  /**
   * The length of the headers string array
   *
   * @type {number}
   * @memberOf HomeComponent
   */
  public headerLength: number;

  /**
   * The array that contains the data to displayed in the list
   *
   * @type {any[]}
   * @memberOf HomeComponent
   */
  public listData: any[];

  /**
   * The ordering of the data in the listData array
   *
   * @type {number[]}
   * @memberOf HomeComponent
   */
  public listOrder: number[];

  // /**
  //  * The class the creats dummy data for the list
  //  *
  //  * @type {DataCreatorStub}
  //  * @memberOf HomeComponent
  //  */
  // public dummyData: DataCreatorStub;

  /**
   * String to be used as the fxFlex component
   *
   * @type {string}
   * @memberOf HomeComponent
   */
  public fxFlexString: string;

  /**
   * Boolean check if the list data has been retrieved and stored here
   *
   * @private
   * @type {boolean}
   * @memberOf HomeComponent
   */
  public listDataSet: boolean = false;

  /**
   * This is where this component should be based on it's params
   *
   * @type {string}
   * @memberOf HomeComponent
   */
  public shouldBeOn: model.DataTypes;

  /**
   * The distance from the view to the top of the container
   *
   * @private
   * @type {number}
   * @memberOf HomeComponent
   */
  public scrollTop: number = 0;

  /**
   * The distance from the view to the bottom of the container
   *
   * @private
   * @type {number}
   * @memberOf HomeComponent
   */
  public scrollBottom: number = 0;

  /**
   * The height of the view
   *
   * @private
   * @type {number}
   * @memberOf HomeComponent
   */
  public scrollHeight: number = 0;

  /**
   * The index to start rendering elements
   *
   * @type {number}
   * @memberOf HomeComponent
   */
  public scrollStartIndex: number = 0;

  /**
   * The index to stop rendering elements
   *
   * @type {number}
   * @memberOf HomeComponent
   */
  public scrollStopIndex: number = 0;

  /**
   * The height of the top spacer div
   *
   * @type {number}
   * @memberOf HomeComponent
   */
  public scrollTopDivHeight: number;

  /**
   * The height of the bottom spacer div
   *
   * @type {number}
   * @memberOf HomeComponent
   */
  public scrollBottomDivHeight: number;

  public length: number = 0;

  public listCardHeight: number = 0;

  public trSitesList: model.tr_sites[];
  public sitesList: model.site_list[];
  public cart: model.equipment_reference[];

  /**
   * Used to read the params passed to the home route
   *
   * @private
   * @type {Subscription}
   * @memberOf HomeComponent
   */
  private homeSub: Subscription;

  private typeSubscription: Subscription;

  private listSubscription: Subscription;

  private viewSubscription: Subscription;

  private scrollSubscription: Subscription;

  private heightSubscription: Subscription;

  private trSitesSubscription: Subscription;

  private siteSubscription: Subscription;

  private containerHeight: number = 0;

  private headerView: string;

  private forceUpdate: boolean = true;

  private searchCard: any;

  private cartSubscription: Subscription;

  private buttonSubscription: Subscription;

  private buttonEmitter: EventEmitter<string>;

  private buttonEventSubscription: Subscription;

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
   * Creates an instance of ListComponent.
   * @param {Router} route
   * @param {ActivatedRoute} activeRoute
   * @param {ChangeDetectorRef} cdr angular change detector
   * @param {Store<fromRoot.State>} store app-wide state
   *
   * @memberof ListComponent
   */
  constructor(
    private route: Router,
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private apiHost: ApiController,
    private store: Store<fromRoot.State>,
    private elementRef: ElementRef
  ) {}

  /**
   * Angular Lifecycle hook
   * runs once on destroy
   *
   *
   * @memberof ListComponent
   */
  public ngOnDestroy() {
    // this.updateSubscription.unsubscribe();
    this.homeSub.unsubscribe();

    if ( !isUndefined(this.typeSubscription) ) {
      this.typeSubscription.unsubscribe();
    }

    if ( !isUndefined(this.listSubscription) ) {
      this.listSubscription.unsubscribe();
    }

    if ( !isUndefined(this.viewSubscription) ) {
      this.viewSubscription.unsubscribe();
    }

    if ( !isUndefined(this.scrollSubscription) ) {
      this.scrollSubscription.unsubscribe();
    }

    if ( !isUndefined(this.heightSubscription) ) {
      this.heightSubscription.unsubscribe();
    }

    if ( !isUndefined(this.trSitesSubscription) ) {
      this.trSitesSubscription.unsubscribe();
    }

    if ( !isUndefined(this.siteSubscription) ) {
      this.siteSubscription.unsubscribe();
    }

    if (!isUndefined(this.cartSubscription) ) {
      this.cartSubscription.unsubscribe();
    }

    if (!isUndefined(this.buttonSubscription) ) {
      this.buttonSubscription.unsubscribe();
    }

    if (!isUndefined(this.buttonEventSubscription) ) {
      this.buttonEventSubscription.unsubscribe();
    }
  }

  /**
   * Angular lifecycle hook runs
   * runs once on intilization
   *
   *
   * @memberof ListComponent
   */
  public ngOnInit() {
    this.listDataSet = false;

    this.apiHost.startSubscription();

    this.store.dispatch(new actions.SetViewAction('List: '));

    this.homeSub = this.activeRoute.params.subscribe((params) => {
      switch (params['list']) {
        default:
        case 'TR':
          this.shouldBeOn = model.DataTypes.trList;
          break;

        case 'Site':
          this.shouldBeOn = model.DataTypes.siteList;
          break;

        case 'Order':
          this.shouldBeOn = model.DataTypes.orderList;
          break;

        case 'Part':
          this.shouldBeOn = model.DataTypes.partList;
          break;
      }
    });

    this.typeSubscription = this.store.select(fromRoot.getDataType).subscribe(
      (value: model.DataTypes) => {
        this.dataName = value;
      }
    );

    this.listSubscription = this.store.select(fromRoot.getDataList).subscribe(
      (value: model.transmission_requirements[] | model.site_list[] | model.orders[] | model.equipment_reference[]) => {
        this.listData = value;
        this.headers = model.getHeaders(this.dataName);
        this.headerLength = this.headers.length;
        this.fxFlexString = '1 1 ' + String(Math.floor(100 / ((this.headerLength).valueOf()))) + '%';
        this.listOrder = Array.from({length: this.listData.length}, (v, i) => i);
        this.listDataSet = true;
        this.length = this.listOrder.length;
      }
    );

    this.viewSubscription = this.store.select(fromRoot.getView).subscribe(
      (value: string) => {
        this.headerView = value;
      }
    );

    this.scrollSubscription = this.store.select(fromRoot.getEmitter).skip(1).subscribe(
      (value: any[]) => {
        this.scrollStartIndex = !isUndefined(value[0]) ? value[0] : 0;
        this.scrollStopIndex = !isUndefined(value[1]) ? value[1] : 0;
        this.cdr.detectChanges();
      }
    );

    this.heightSubscription = this.store.select(fromRoot.getHeight).subscribe(
      (value: number) => {
        this.containerHeight = value;
      }
    );

    this.trSitesSubscription = this.store.select(fromRoot.getTRSites).subscribe(
      (value: model.tr_sites[]) => {
        this.trSitesList = value;
      }
    );

    this.siteSubscription = this.store.select(fromRoot.getAllSites).subscribe(
      (value: model.site_list[]) => {
        this.sitesList = value;
      }
    );

    this.cartSubscription = this.store.select(fromRoot.getCart).subscribe(
      (value: model.equipment_reference[]) => {
        this.cart = value;
      }
    );

    this.buttonSubscription = this.store.select(fromRoot.getButtonEmitter).subscribe(
      (value: EventEmitter<string>) => {
        this.buttonEmitter = value;
        if (!isUndefined(this.buttonEventSubscription) ) {
          this.buttonEventSubscription.unsubscribe();
        }

        this.buttonEventSubscription = this.buttonEmitter.subscribe(
          (input: string) => {
            console.log('emitted: ' + input);
            if ( input === 'checkout' ) {
              this.store.dispatch(new actions.SetViewAction('Add'));
              this.store.dispatch(new actions.SetSelectedAction(-100));
              this.store.dispatch(new actions.SetTypeAction(model.DataTypes.orderList));
              this.route.navigateByUrl('/access');
            }
          }
        );
      }
    );

    this.searchCard = this.elementRef.nativeElement['firstChild'];
  }

  public ngAfterContentChecked() {
    /**
     * This section of code allows the back button to work. How it works is that when it checks the
     * param passed by the url is different then what the current data we are looking at is it'll re route
     * the view to the correct one
     */
    if ( this.shouldBeOn !== this.dataName ) {
      // re routes view
      this.store.dispatch(new actions.SetTypeAction(this.shouldBeOn));
      this.dataName = this.shouldBeOn;
      let dataString;
      switch (this.shouldBeOn) {
        default:
        case model.DataTypes.trList:
          dataString = 'TR';
          break;

        case model.DataTypes.siteList:
          dataString = 'Site';
          break;

        case model.DataTypes.orderList:
          dataString = 'Order';
          break;

        case model.DataTypes.partList:
          dataString = 'Part';
          break;
      }
      this.route.navigateByUrl(`/home/${ dataString }`);
    }

    // 134 search card height
    // 5 margin bottom search card
    // 10 container padding
    let searchCardHeight: number = 98;
    if ( !isNull(this.searchCard) ) {
      searchCardHeight = this.searchCard.offsetHeight;
    }

    const listCardHeight = this.containerHeight - searchCardHeight - 15;

    /**
     * This is necessary because it seems this lifecycle function is run several times,
     * For instance it is ran at least 3 times after each heartbeat
     */
    if ( this.lastDataName !== this.dataName || this.listCardHeight !== listCardHeight || this.forceUpdate ) {
      // set the view name
      this.store.dispatch(new actions.SetViewAction('List: '));
      this.lastDataName = this.dataName;
      this.forceUpdate = false;

      this.listCardHeight = listCardHeight;
    }
  }

  public getDataName(): string {
    let str = '';

    switch (this.dataName) {
      case model.DataTypes.trList:
        str = 'TR';
        break;
      case model.DataTypes.siteList:
        str = 'Site';
        break;
      case model.DataTypes.partList:
        str = 'Part';
        break;
      case model.DataTypes.orderList:
        str = 'Order';
        break;
      default:
        str = '';
        break;
    }

    return str;
  }

  //
  //  bbbbbbbb
  //  b::::::b                     tttt
  //  b::::::b                  ttt:::t
  //  b::::::b                  t:::::t
  //   b:::::b                  t:::::t
  //   b:::::bbbbbbbbb    ttttttt:::::ttttttt  nnnn  nnnnnnnn
  //   b::::::::::::::bb  t:::::::::::::::::t  n:::nn::::::::nn
  //   b::::::::::::::::b t:::::::::::::::::t  n::::::::::::::nn
  //   b:::::bbbbb:::::::btttttt:::::::tttttt  nn:::::::::::::::n
  //   b:::::b    b::::::b      t:::::t          n:::::nnnn:::::n
  //   b:::::b     b:::::b      t:::::t          n::::n    n::::n
  //   b:::::b     b:::::b      t:::::t          n::::n    n::::n
  //   b:::::b     b:::::b      t:::::t    ttttttn::::n    n::::n
  //   b:::::bbbbbb::::::b      t::::::tttt:::::tn::::n    n::::n
  //   b::::::::::::::::b       tt::::::::::::::tn::::n    n::::n
  //   b:::::::::::::::b          tt:::::::::::ttn::::n    n::::n
  //   bbbbbbbbbbbbbbbb             ttttttttttt  nnnnnn    nnnnnn
  //
  //
  //
  //
  //
  //
  //

  /**
   * Function used by home list to navigate to add a new data entry
   *
   *
   * @memberOf AppComponent
   */
  public add() {
    this.store.dispatch(new actions.SetViewAction('Add'));
    this.store.dispatch(new actions.SetSelectedAction(-1));
    this.route.navigateByUrl('/access');
  }

  /**
   * Function used by home list to navigate to view a data entry
   *
   * @param {string} id
   *
   * @memberOf HomeComponent
   */
  public view(id: number) {
    this.store.dispatch(new actions.SetViewAction('View'));
    this.store.dispatch(new actions.SetSelectedAction(id));
    this.route.navigateByUrl('/access');
  }

  /**
   * Funciton used by home list to navigate to edit a data entry
   *
   * @param {string} id
   *
   * @memberOf HomeComponent
   */
  public edit(id: number) {
    this.store.dispatch(new actions.SetViewAction('Edit'));
    this.store.dispatch(new actions.SetSelectedAction(id));
    this.route.navigateByUrl('/access');
  }

  /**
   * Sort ascending
   *
   * @param {string} field
   *
   * @memberOf HomeComponent
   */
  public asc(field: string) {
    this.listData = this.listData.sort( (n1: any, n2: any) => {
        if (String(n1[field]).toLowerCase() > String(n2[field]).toLowerCase()) {
          return 1;
        }

        if (String(n1[field]).toLowerCase() < String(n2[field]).toLowerCase()) {
          return -1;
        }

        return 0;
    });
  }

  /**
   * Sort descending
   *
   * @param {string} field
   *
   * @memberOf HomeComponent
   */
  public dsc(field: string) {
    this.listData = this.listData.sort( (n1: any, n2: any) => {
        if (String(n1[field]).toLowerCase() < String(n2[field]).toLowerCase()) {
          return 1;
        }

        if (String(n1[field]).toLowerCase() > String(n2[field]).toLowerCase()) {
          return -1;
        }

        return 0;
    });
  }

  public cartEvent(element: model.equipment_reference, inCart: boolean) {
    if (!inCart) {
      this.store.dispatch(new actions.AddToCart(element));
    } else {
      this.store.dispatch(new actions.RemoveFromCart(element.equip_ref_id));
    }
  }

  //
  //
  //    iiii
  //   i::::i
  //    iiii
  //
  //  iiiiiii     ssssssssss
  //  i:::::i   ss::::::::::s
  //   i::::i ss:::::::::::::s
  //   i::::i s::::::ssss:::::s
  //   i::::i  s:::::s  ssssss
  //   i::::i    s::::::s
  //   i::::i       s::::::s
  //   i::::i ssssss   s:::::s
  //  i::::::is:::::ssss::::::s
  //  i::::::is::::::::::::::s
  //  i::::::i s:::::::::::ss
  //  iiiiiiii  sssssssssss
  //
  //
  //
  //
  //
  //
  //

  /**
   * Function used by sidebar to check if we are currently on the tr pages
   *
   * @returns {boolean}
   *
   * @memberOf HomeComponent
   */
  public isTR(): boolean {
    return this.dataName === model.DataTypes.trList;
  }

  /**
   * Function used by sidebar to check if we are currently on teh site pages
   *
   * @returns {boolean}
   *
   * @memberOf HomeComponent
   */
  public isSite(): boolean {
    return this.dataName === model.DataTypes.siteList;
  }

  /**
   * Function used by sidebar to check if we are currently on the order pages
   *
   * @returns {boolean}
   *
   * @memberOf HomeComponent
   */
  public isOrder(): boolean {
    return this.dataName === model.DataTypes.orderList;
  }

  /**
   * Function used by sidebar to check if we are currently on teh part pages
   *
   * @returns {boolean}
   *
   * @memberOf HomeComponent
   */
  public isPart(): boolean {
    return this.dataName === model.DataTypes.partList;
  }

  /**
   * function used by sidebar to check if we are currently on my assignments
   *
   * @returns {boolean}
   *
   * @memberOf HomeComponent
   */
  public isAssignment(): boolean {
    return this.headerView === 'My Assignments';
  }
}
