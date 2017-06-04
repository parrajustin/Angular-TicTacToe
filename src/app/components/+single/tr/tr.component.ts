
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { cloneDeep, keys, forEach, isUndefined, map, sortBy, uniq, find } from 'lodash';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Store } from '@ngrx/store';

import { Storage } from '../single.component';
import * as model from '../../../model';
import * as fromRoot from '../../../reducers';
import * as actions from '../../../actions';

/**
 * TR component that handles updating and editing sites
 *
 * @export
 * @class TRComponent
 */
@Component({
  selector: 'trAdd',
  styleUrls: [ './tr.component.css' ],
  templateUrl: './tr.component.html'
})
export class TRComponent implements OnInit, OnDestroy {
  /**
   * The contents of this variable represents the view type of the SiteComponent
   * which is either view, edit, add
   * @type {String}
   * @memberOf SiteComponent
   */
  @Input() public viewType: String;

  /**
   * This is the output emitter for production to tell the parent to check it's content
   *
   * @type {EventEmitter<boolean>}
   * @memberOf OrderComponent
   */
  @Output() public onInit: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Array to hold the files to be uploaded
   *
   * @type {any[]}
   * @memberOf SiteComponent
   */
  @Input() public files: Storage;

  /**
   * The types a file can be
   *
   * @type {string[]}
   * @memberOf SiteComponent
   */
  public types: string[] = [
    'PCN',
    'RF_CERT',
    '1A_SURVEY',
    'TAPE_DROPS',
    'PICTURE',
    'SKETCH',
    'STRUCTUAL',
    'LICENSED',
    'PROPOSED',
    'OTHER'
  ];

  public states: string[] = [
    'COMPLETE',
    'CANCELLED',
    'IN_PROGRESS',
    'OTHER'
  ];

  /**
   * Contains what are accepted inputs for the statea
   *
   *
   * @memberOf SiteComponent
   */
  public autocompleteStates = [
    'AL',
    'AK',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'FL',
    'GA',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'OH',
    'OK',
    'OR',
    'PA',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY'
  ];

  /**
   * Contains the tr information of this specific element
   *
   * @type {Site}
   * @memberOf SiteComponent
   */
  @Input() public model: model.transmission_requirements;

  /**
   * Used to pass the states that a tr affects
   *
   * @type {dbStorage}
   * @memberOf TRComponent
   */
  @Input() public modelArray: Storage;

  /**
   * If the usere is currently selecting a site
   *
   * @type {boolean}
   * @memberOf TRComponent
   */
  public selectSite: boolean = false;

  /**
   * Will contain the storage of sites
   *
   * @type {Site[]}
   * @memberOf TRComponent
   */
  public siteStorage: model.site_list[];

  /**
   * Used to contain a temporary copy of the affected sites
   *
   * @type {dbStorage}
   * @memberOf TRComponent
   */
  public checkContainers: Storage = {};

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
  public scrollStartIndex: number;

  /**
   * The index to stop rendering elements
   *
   * @type {number}
   * @memberOf HomeComponent
   */
  public scrollStopIndex: number;

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

  private selectedId: string;

  private sitesSubscription: Subscription;

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
   * Creates an instance of SiteComponent.
   * @param {AppState} appState
   *
   * @memberOf SiteComponent
   */
  constructor(
    public snackBar: MdSnackBar,
    private route: Router,
    private store: Store<fromRoot.State>
  ) {}

  /**
   * Angular 2 life cycle hook that runs when creating this view
   *
   *
   * @memberOf TRComponent
   */
  public ngOnInit() {
    // TODO: fix the need for this line
    /**
     * This line was done because of a bug where the component woudln't render when it was started
     */
    this.onInit.emit(true);

    this.sitesSubscription = this.store.select(fromRoot.getAllSites).subscribe(
      (value: model.site_list[]) => {
        this.siteStorage = value;
      }
    );
  }

  public ngOnDestroy() {
    if ( !isUndefined(this.sitesSubscription) ) {
      this.sitesSubscription.unsubscribe();
    }
  }

  /**
   * Action done when the plus butotn is pushed on adding affected sites
   *
   *
   * @memberOf TRComponent
   */
  public addSitesPopup() {
    this.selectSite = true;
    this.checkContainers = {};
    this.checkContainers = cloneDeep(this.modelArray);
  }

  /**
   * Used to retrieve the boolean value for a site
   *
   * @param {string} siteId the site id that is being affected
   *
   * @memberOf TRComponent
   */
  public getSite(siteId: string) {
    this.checkContainers[siteId] = Boolean(this.checkContainers[siteId]);
    return this.checkContainers[siteId];
  }

  /**
   * flips the state of the affected state
   *
   * @param {string} siteId is for added site
   *
   * @memberOf TRComponent
   */
  public flipSite(siteId: string) {
    this.checkContainers[siteId] = !this.checkContainers[siteId];
  }

  /**
   * Action done when pushing the x button next to an affected site
   *
   * @param {number} siteId the id of the affected site to remove
   *
   * @memberOf TRComponent
   */
  public removeSite(siteId: number) {
    delete this.modelArray[siteId];
  }

  /**
   * Exits the adding of affected sites overlay
   *
   *
   * @memberOf TRComponent
   */
  public exit() {
    this.selectSite = false;
    this.checkContainers = {};
  }

  /**
   * Adds the selected sites into the affected site array
   *
   *
   * @memberOf TRComponent
   */
  public addExit() {
    // remove all entries where the value isn't true
    forEach(keys(this.checkContainers), (key: string) => {
      this.modelArray[key] = this.checkContainers[key];
    });

    forEach(keys(this.modelArray), (key: string) => {
      if ( !this.modelArray[key] ) {
        delete this.modelArray[key];
      }
    });

    // reset
    this.checkContainers = {};
    this.selectSite = false;
  }

  /**
   * Add another site
   *
   *
   * @memberOf TRComponent
   */
  public newSite() {
    this.store.dispatch(new actions.SetTypeAction(model.DataTypes.siteList));
    this.store.dispatch(new actions.SetViewAction('Add'));
    this.store.dispatch(new actions.SetSelectedAction(-1));
  }

  /**
   * Event that happens everytime there is a change to the attachment input tags
   *
   * @param {*} fileInput
   * @param {number} id
   *
   * @memberOf SiteComponent
   */
  public fileChange(fileInput: any) {
    if ( !isUndefined(fileInput) && !isUndefined(fileInput.target) && !isUndefined(fileInput.target['files']) ) {
      // index of the attachment in the attachment array
      // let index: number = _.findIndex(this.model.attachments, { id });
      // hack this files array onto the attachment array
      // todo: fix this
      // this.files = { 0: fileInput.target['files'][0] };
      this.files['0'] = fileInput.target['files'][0];
    }
  }

  /**
   * Return a site as a string
   *
   * @param {model.site_list} element the site to be transformed
   * @returns {string} the string representation of the site
   *
   * @memberOf TRComponent
   */
  public siteString(element: model.site_list): string {
    // {{ siteModel.site_name  }}, {{ siteModel.site_callSign }}, {{ siteModel.site_clli }}, {{ getStates(siteModel.site_id) }}
    return element.site_name + ', ' + element.site_callSign + ', ' + element.site_clli + ', ' + this.getStates(element.site_id);
  }

  /**
   * Returns a string of the states on a site
   *
   * @param {string} id the site's id
   *
   * @memberOf TRComponent
   */
  public getStates(id: number): string {
    /**
     * This section handles retriving the states a site is on
     */
    let sites = this.siteStorage;
    return (find(sites, (s: model.site_list) => { return s.site_id === id; }) as model.site_list).site_state;
  }

  /**
   * Routes the view to a specific site
   *
   * @param {string} id
   *
   * @memberOf TRComponent
   */
  public goToSite(id: number)  {
    this.store.dispatch(new actions.SetTypeAction(model.DataTypes.siteList));
    this.store.dispatch(new actions.SetViewAction('View'));
    this.store.dispatch(new actions.SetSelectedAction(id));
  }

  /**
   * Check to see if this add is in readonly mode
   *
   * @returns {boolean}
   *
   * @memberOf SiteComponent
   */
  public isReadOnly(): boolean {
    return this.viewType === 'View';
  }

  /**
   * returns the sites that this tr is affecting
   *
   * @returns {string[]}
   *
   * @memberOf TRComponent
   */
  public getKeys(): string[] {
    return keys(this.modelArray);
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
  public setDistances(input: number[]) {
    // the height of a single element
    const elementHeight = 30;

    /**
     * The two following sections set the scrollTop and bottom variables
     * these variables are used to know where on the scroll bar the user is
     */
     // scrollTop = input[0]
    if ( input[0] !== this.scrollTop ) {
      this.scrollTop = input[0];
    }

    // scrollBottom = input[1]
    if ( input[1] !== this.scrollBottom ) {
      this.scrollBottom = input[1];
    }

    /**
     * The following deal with setting the div's scroll heights so that the div can change size
     */

    // set the top scroll height
    if ( this.scrollTop <= 0 ) {
      this.scrollStartIndex = 0;
      this.scrollTopDivHeight = 0;
    } else {
      /**
       * the total number of elements that fit fully into the space
       * also take away an element such that there is a little bit of a spacer when scrolling
       */
      const numberOfElements = Math.max(0, Math.floor(this.scrollTop / elementHeight) - 1 );
      const height = numberOfElements * elementHeight;
      if ( height !== this.scrollTopDivHeight ) {
        this.scrollStartIndex = numberOfElements;
        this.scrollTopDivHeight = height;
      }
    }

    // set the bottom scroll height
    if ( this.scrollBottom <= 0 && this.scrollTop <= 0 ) {
      this.scrollStopIndex = Math.max(0, Math.floor(this.scrollHeight / elementHeight) + 1 );
      this.scrollBottomDivHeight = 0;
    } else {
      /**
       * the total number of elements that fit fully into the space
       * also take away an element such that there is a little bit of a spacer when scrolling
       */
      const numberOfElements = Math.max(0, Math.floor(this.scrollBottom / elementHeight) - 1 );
      const height = Math.max(0, numberOfElements * elementHeight - 5);
      if ( height !== this.scrollBottomDivHeight ) {
        this.scrollStopIndex = this.siteStorage.length - numberOfElements;
        this.scrollBottomDivHeight = height;
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
  public setHeight(input: number) {
    if ( input !== this.scrollHeight ) {
      this.scrollHeight = input;
    }
  }

  /**
   * Returns the height, in px, that the container has to be to contain all the data elements
   *
   * @returns {number}
   *
   * @memberOf HomeComponent
   */
  public getHeight(): number {
    // Each element is 83px tall or
    // 36px header + 42px body + 5px bottom margin
    // the last elements margin-bottom isn't included that is why the -5 is there
    return Math.max(0, this.siteStorage.length * 30 - 5);
  }
}
