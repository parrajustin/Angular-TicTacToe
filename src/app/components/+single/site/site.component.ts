import { Component, AfterContentChecked, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { isUndefined, findIndex, map, keys, remove, uniq } from 'lodash';
import { MdSnackBar } from '@angular/material';
import { Subscription } from 'rxjs/Rx';
import { Store } from '@ngrx/store';

import { Storage } from '../single.component';
import * as model from '../../../model';
import * as fromRoot from '../../../reducers';
import * as actions from '../../../actions';
import { ApiController } from '../../../services';

/**
 * Site component that handles updating and editing sites
 *
 * @export
 * @class SiteComponent
 * @implements {OnInit}
 * @implements {AfterContentChecked}
 */
@Component({
  selector: 'siteAdd',
  styleUrls: [ './site.component.css' ],
  templateUrl: './site.component.html'
})
export class SiteComponent implements OnInit, OnDestroy {
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
   * The array that contains the attachments for this stie
   *
   * @type {model.attachments}
   * @memberOf SiteComponent
   */
  @Input() public modelArray: Storage;

  /**
   * Tr storage
   *
   * @type {TR[]}
   * @memberOf SiteComponent
   */
  public trStorage: model.transmission_requirements[];

  /**
   * The types a file can be
   *
   * @type {string[]}
   * @memberOf SiteComponent
   */
  public types: string[] = [
    'PCN',
    'RF-CERT',
    '1A-SURVEY',
    'TAPE-DROPS',
    'PICTURE',
    'SKETCH',
    'STRUCTUAL',
    'LICENSED',
    'PROPOSED',
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
   * Contains the model information
   *
   * @type {Site}
   * @memberOf SiteComponent
   */
  @Input() public model: model.site_list;

  /**
   * The id holder for the next attachment
   *
   * @type {number}
   * @memberOf SiteComponent
   */
  public attachmentId: number = 0;

  private trSubscription: Subscription;

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
    public remoteApi: ApiController,
    public snackBar: MdSnackBar,
    private store: Store<fromRoot.State>
  ) {}

  /**
   * Angular 2 life cycle hook that runs when creating this view
   *
   *
   * @memberOf OrderComponent
   */
  public ngOnInit() {
    this.onInit.emit(true);

    this.trSubscription = this.store.select(fromRoot.getAllTRs).subscribe(
      (value: model.transmission_requirements[]) => {
        this.trStorage = value;
      }
    );
  }

  public ngOnDestroy() {
    if ( !isUndefined(this.trSubscription) ) {
      this.trSubscription.unsubscribe();
    }
  }

  /**
   * The action done when pushing the plus button next to attachments
   *
   *
   * @memberOf SiteComponent
   */
  public addSite() {
    this.modelArray[String(this.attachmentId)] = new model.attachments(
      this.attachmentId,
      '',
      new Date(),
      (this.model as model.site_list).site_id,
      '',
      '',
      false
    );
    this.attachmentId += 1;
  }

  /**
   * The action done when pushing the x button next to each individual attachment title
   *
   * @param {number} siteId
   *
   * @memberOf SiteComponent
   */
  public removeSite(id: number) {
    delete this.modelArray[String(id)];
    delete this.files[String(id)];
  }

  /**
   * Returns the array to trs that have this site in it's siteIds
   *
   *
   * @memberOf SiteComponent
   */
  public getTRs(): model.transmission_requirements[] {
    let temp: model.transmission_requirements[] = [];
    // this.trStorage.forEach((tr) => {
    //   if ( tr.siteIds.indexOf(this.model._id) >= 0 ) {
    //     temp.push(tr);
    //   }
    // });
    return temp;
  }

  /**
   * Sends the site to view a tr
   *
   * @param {string} id
   *
   * @memberOf SiteComponent
   */
  public goToTR(id: number) {
    this.store.dispatch(new actions.SetTypeAction(model.DataTypes.trList));
    this.store.dispatch(new actions.SetViewAction('View'));
    this.store.dispatch(new actions.SetSelectedAction(id));
  }

  /**
   * Event that happens everytime there is a change to the attachment input tags
   *
   * @param {*} fileInput the file data
   * @param {number} id link between file and attachment
   *
   * @memberOf SiteComponent
   */
  public fileChange(fileInput: any, id: number) {
    if ( !isUndefined(fileInput) && !isUndefined(fileInput.target) && !isUndefined(fileInput.target['files']) ) {
      // index of the attachment in the attachment array
      // let index: number = _.findIndex(this.model.attachments, { id });
      // hack this files array onto the attachment array
      // todo: fix this
      this.files[String(id)] = fileInput.target['files'][0];
    }
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
   * Necessary since in the model array States that are affected in the state are also included
   * also used because the modelArray is a key=>value pair when we need an array
   *
   * @returns {model.attachments[]} the array of attachment objects
   *
   * @memberOf SiteComponent
   */
  public getAttachmentsArray(): model.attachments[] {
    return map(remove(keys(this.modelArray), (input) => { if ( input !== 'states') { return input; } }), (key: string) => {
      return this.modelArray[key];
    }) as model.attachments[];
  }

}
