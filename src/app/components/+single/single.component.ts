import { Component, AfterContentChecked, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { isUndefined, cloneDeep, forEach, map, keys } from 'lodash';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Store } from '@ngrx/store';

// import { AppState } from '../app.state.service';
import { ApiController } from '../../services';
import * as model from '../../model';
import * as fromRoot from '../../reducers';
import * as action from '../../actions';

export interface Storage {
  [key: string]: any;
};

/**
 * This is the component outlet for all the different data types
 * This allows the user to add/edit/view the different data types
 *
 * @export
 * @class SingleComponent
 * @implements {AfterContentChecked}
 */
@Component({
  selector: 'single',
  styleUrls: [ './single.component.css' ],
  templateUrl: './single.component.html'
})
export class SingleComponent implements AfterContentChecked, OnDestroy, OnInit {

  /**
   * The contents of this variable represents the view type of the SiteComponent
   * which is either view, edit, add
   *
   * @type {String}
   * @memberOf SingleComponent
   */
  public viewType: string;

  /**
   * Are we submitting something?
   *
   * @type {boolean}
   * @memberOf SingleComponent
   */
  public submitting: boolean = false;

  /**
   * Array to hold the files to be uploaded
   *
   * @type {any[]}
   * @memberOf SiteComponent
   */
  public files: Storage = {};

  /**
   * Text displayed on the sending screen
   *
   * @type {string}
   * @memberOf SingleComponent
   */
  public submitText: string = 'Sending...';

  /**
   * Contains the model information
   *
   * @type {any}
   * @memberOf SingleComponent
   */
  public model: any;

  /**
   * Used to pass aditional information from children to parent
   *
   * @type {dbStorage}
   * @memberOf SingleComponent
   */
  public modelArray: Storage = {};

  /**
   * If the component should reset
   *
   * @type {boolean}
   * @memberOf SingleComponent
   */
  public forceReset: boolean = true;

  public loaded: boolean = false;

  private dataName: model.DataTypes;
  private selctedId: number;

  private typeSubscription: Subscription;
  private viewSubscription: Subscription;
  private idSubscription: Subscription;
  private selectedDataSubscription: Subscription;

  /**
   * Creates an instance of SingleComponent.
   * @param {AppState} appState the internal state handler
   * @param {ApiController} remoteApi the interal api outlet to contact the server
   * @param {MdSnackBar} snackBar the reference to use the material snackbar
   *
   * @memberOf SingleComponent
   */
  constructor(
    public snackBar: MdSnackBar,
    public router: Router,
    private store: Store<fromRoot.State>,
    private remoteApi: ApiController
  ) {}

  /**
   * Angular 2 lifecycle hook
   *
   *
   * @memberOf SingleComponent
   */
  public ngOnDestroy() {
    if ( !isUndefined(this.typeSubscription) ) {
      this.typeSubscription.unsubscribe();
    }

    if ( !isUndefined(this.viewSubscription) ) {
      this.viewSubscription.unsubscribe();
    }

    if ( !isUndefined(this.idSubscription) ) {
      this.idSubscription.unsubscribe();
    }
  }

  public ngOnInit() {
    this.forceReset = true;

    this.typeSubscription = this.store.select(fromRoot.getDataType).subscribe(
      (value: model.DataTypes) => {
        this.dataName = value;
        this.forceReset = true;
      }
    );

    this.viewSubscription = this.store.select(fromRoot.getView).subscribe(
      (value: string) => {
        console.log('view: ' + value);
        this.viewType = value;
        this.forceReset = true;
      }
    );

    this.idSubscription = this.store.select(fromRoot.getSelectedId).subscribe(
      (value: number) => {
        this.selctedId = value;
        this.forceReset = true;
      }
    );

    this.store.select(fromRoot.getDataType).take(1).subscribe(
      (value: model.DataTypes) => {
        this.dataName = value;
      }
    );

    this.store.select(fromRoot.getView).take(1).subscribe(
      (value: string) => {
        this.viewType = value;
      }
    );
  }

  /**
   * Angular 2 lifecycle hook
   * Ran several times
   *
   * @memberOf SingleComponent
   */
  public ngAfterContentChecked() {

    /**
     * This is necessary because it seems this lifecycle function is ran several times
     */
    if ( this.forceReset ) {
      // stop the forceReset check
      this.forceReset = false;

      // if we are adding some element or no element has been chosen
      if ( this.selctedId !== -100 && (this.viewType === 'Add' || this.selctedId === -1) ) {
        this.store.dispatch(new action.SetViewAction('Add'));
        this.store.dispatch(new action.SetSelectedAction(-1));

        this.reset();
      } else {
        // a current data id was specified so load up the data
        this.modelArray = { a: 'idk' };

        if ( this.selctedId === -100 ) {
          this.model = new model.orders(0, '', '', new Date(), '', '', false);
          this.store.select(fromRoot.getCart).take(1).subscribe(
            (value: model.equipment_reference[]) => {
              let temp = {};
              forEach(value, (element: model.equipment_reference) => {
                temp[element.equip_ref_id] = element;
              });
              this.modelArray = temp;
            }
          );
        } else {

          this.store.select(fromRoot.getSelected).take(1).subscribe(
            (value: model.transmission_requirements | model.site_list | model.orders | model.equipment_reference) => {
              console.log(value);
              if ( isUndefined(value) ) {
                this.store.dispatch(new action.SetViewAction('Add'));
                this.store.dispatch(new action.SetSelectedAction(-1));

                this.reset();
              } else if ( this.dataName === model.DataTypes.siteList ) {
                this.store.select(fromRoot.getSiteAttachments).take(1).subscribe(
                  (attachments: model.attachments[]) => {
                    forEach(attachments, (element: model.attachments) => {
                      this.modelArray[String(element.attachment_id)] = element;
                    });
                  }
                );
                this.model = value;
              } else if ( this.dataName === model.DataTypes.trList ) {
                this.store.select(fromRoot.getAffectedSites).take(1).subscribe(
                  (affectedSites: model.site_list[]) => {
                    forEach(affectedSites, (element: model.tr_sites) => {
                      if ( element.tr_id === (value as model.transmission_requirements).tr_id ) {
                        this.modelArray[element.site_id] = true;
                      }
                    });
                  }
                );
                this.model = value;
              } else {
                this.model = value;
              }
            }
          );

        }
      }

    }
  }

  /**
   * Resets the data model
   *
   *
   * @memberOf SingleComponent
   */
  public reset() {
    switch (this.dataName) {
      case model.DataTypes.trList:
        this.model = new model.transmission_requirements(-1, '', '', new Date(), '', new Date(), new Date(), '', '', '', '', '', true);
        this.modelArray = {};
        break;
      case model.DataTypes.siteList:
        this.model = new model.site_list(-1, '', '', '', '', '', 0, '', '', '', '', 0, 0, '', true);
        this.modelArray = {};
        break;
      case model.DataTypes.partList:
        this.model = new model.equipment_reference(-1, model.equipmentType.ANTENNA, '', '', '', '', '', '', false, '', '');
        this.modelArray = {};
        break;
      case model.DataTypes.orderList:
        this.model = new model.orders(-1, '', '', new Date(), '', '', false);
        this.modelArray = {};
        break;
      default:
        break;
    }
  }

  /**
   * Form submit action that handles submitting the data to the server
   *
   * @param {boolean} valid the validity of the form
   *
   * @memberOf SingleComponent
   */
  public submit(valid: boolean) {
    // will stop the submit function if the submit form is not valid
    if ( !valid ) {
      return;
    }
    this.submitting = true;

    /**
     * The temporary list data object that can be edited without worry
     */
    let temp: any;

    // if not part data we just clone the model
    if ( this.dataName !== model.DataTypes.partList ) {
      temp = cloneDeep(this.model);
    }

    // If we are submitting sites fix the data
    if ( this.dataName === model.DataTypes.siteList ) {
      let states: string[] = [];
      forEach((this.modelArray as Storage)['states'], (value: any) => {
        states.push(value['display'] || value);
        /**
         * The value['dislpay'] || value is done because if we edit a site and add a new state
         * one of the states might already be in the 'TX' state instead of the object returned
         * from the ng-input-tag component
         */
      });
      temp.states = states;
    } else if ( this.dataName === model.DataTypes.partList ) {
      temp = map(this.model, (input: any) => {
        return input;
      });
    } else if ( this.dataName === model.DataTypes.trList ) {
      temp['sites'] = keys(this.modelArray);
    }

    // // upload data and wait for response
    this.remoteApi.add(temp).subscribe(
      (response: model.ResponsePost) => {
        if ( response['status'] === 'success') {
          // the site was correctly updated or added so now we need to update/add files
          if ( this.dataName === model.DataTypes.siteList || this.dataName === model.DataTypes.trList ) {
            if ( keys(this.files).length > 0 ) {
              this.submitText = 'Uploading files...';
              this.uploadFiles(response.id);
            } else {
              this.submitting = false;
              this.submitText = 'Sending...';
              this.snackBar.open('Successfully uploaded/edited data', 'Understood', {duration: 2000});
            }
          } else if ( this.dataName === model.DataTypes.partList ) {
            this.submitting = false;
            this.submitText = 'Sending...';
            this.snackBar.open('Successfully uploaded/edited data', 'Understood', {duration: 2000});
            this.reset();
          }

        } else {
          // the saite failed to be uploaded
          let snackBarRef = this.snackBar.open(`ERROR: ${ response.response['error'] }`, 'Understood', {duration: 3000});
          snackBarRef.afterDismissed().subscribe(() => {
            this.submitting = false;
          });
          snackBarRef.onAction().subscribe(() => {
            this.submitting = false;
          });
        }
      }, (err: any) => {
        // TODO: error reporting
        console.error(JSON.stringify(err) || 'ERROR.');
        let snackBarRef = this.snackBar.open('Code: 0000x1, Upload Failed...', 'Understood', {duration: 3000});
        snackBarRef.afterDismissed().subscribe(() => {
          this.submitting = false;
        });
        snackBarRef.onAction().subscribe(() => {
          this.submitting = false;
        });
      }
    );
  }

  /**
   * Method used to upload files from the files array
   *
   * @param {string} id returned id of uploaded element
   *
   * @memberOf SingleComponent
   */
  public uploadFiles(id: string) {
    let form: FormData = new FormData();

    // first we need to convert the attachments to form data that is understandable by the server
    if ( this.dataName === model.DataTypes.siteList ) {
      keys(this.modelArray).forEach((key: string) => {
        // do not get the key with states since that is not an attachment
        if ( key !== 'states' ) {
          let element: model.attachments = this.modelArray[key];
          let file = this.files[key];

          let indexOfExt: number = String(file['name']).lastIndexOf('.');
          let ext = String(file['name']).substring(indexOfExt + 1);

          form.append(
            'uploads[]',
            this.files[key],
            JSON.stringify([id, element.attachment_type, element.attachment_title, (indexOfExt >= 0 && ext.length > 0 ? ext : ' ')])
          );
        }
      });
    } else if ( this.dataName === model.DataTypes.trList )  {
      let indexOfExt: number = String(this.files['0']['name']).lastIndexOf('.');
      let ext = String(this.files['0']['name']).substring(indexOfExt + 1);

      form.append(
        'uploads[]',
        this.files['0'],
        JSON.stringify([id, 'tr', (this.model as model.transmission_requirements).tr_title, (indexOfExt >= 0 && ext.length > 0 ? ext : ' ')])
      );
    }

    this.remoteApi.uploadFiles(form)
      .subscribe(
        (response: model.ResponsePost) => {
          this.snackBar.open('Successfully uploaded/edited data', 'Understood', {duration: 2000});
          this.submitting = false;

          if ( this.viewType === 'Add' ) {
            this.reset();
          }
        }, (error) => console.log(error)
      );
  }

  /**
   * Check if the view is in readonly mode
   *
   * @returns {boolean} true if in view
   *
   * @memberOf SingleComponent
   */
  public isReadOnly(): boolean {
    return this.viewType === 'View';
  }

  /**
   * Button to return the home list
   *
   *
   * @memberOf SingleComponent
   */
  public goHome() {
    this.router.navigateByUrl(`/home/${ this.dataName }`);
  }

  /**
   * Button to move to edit
   *
   *
   * @memberOf SingleComponent
   */
  public goEdit() {
    this.store.dispatch(new action.SetViewAction('Edit'));
    this.store.dispatch(new action.SetSelectedAction(this.model['site_id'] || this.model['tr_id'] ||
      this.model['order_id'] || this.model['part_id']));
    this.forceReset = true;
  }

  /**
   * Function used by sidebar to check if we are currently on the tr pages
   *
   * @returns {boolean}
   *
   * @memberOf AppComponent
   */
  public isTR(): boolean {
    return this.dataName === model.DataTypes.trList;
  }

  /**
   * Function used by sidebar to check if we are currently on teh site pages
   *
   * @returns {boolean}
   *
   * @memberOf AppComponent
   */
  public isSite(): boolean {
    return this.dataName === model.DataTypes.siteList;
  }

  /**
   * Function used by sidebar to check if we are currently on the order pages
   *
   * @returns {boolean}
   *
   * @memberOf AppComponent
   */
  public isOrder(): boolean {
    return this.dataName === model.DataTypes.orderList;
  }

  /**
   * Function used by sidebar to check if we are currently on the part pages
   *
   * @returns {boolean}
   *
   * @memberOf AppComponent
   */
  public isPart(): boolean {
    return this.dataName === model.DataTypes.partList;
  }

}
