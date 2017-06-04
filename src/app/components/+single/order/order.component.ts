import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import * as fileSaver from 'file-saver';
import { Subscription } from 'rxjs/Rx';
import { isUndefined, values } from 'lodash';
import { Store } from '@ngrx/store';

import { Storage } from '../single.component';
import * as model from '../../../model';
import * as fromRoot from '../../../reducers';
import * as actions from '../../../actions';
import { ApiController } from '../../../services';

/**
 * TR component that handles updating and editing sites
 *
 * @export
 * @class TRComponent
 */
@Component({
  selector: 'orderAdd',
  styleUrls: [ './order.component.css' ],
  templateUrl: './order.component.html'
})
export class OrderComponent implements OnInit, OnDestroy {

  @ViewChild('controlButtons') public control: ElementRef;

  public listCardHeight: number = 0;

  public numElements: number = 0;

  /**
   * The contents of this variable represents the view type of the SiteComponent
   * which is either view, edit, add
   * @type {String}
   * @memberOf OrderComponent
   */
  @Input() public viewType: String;

  /**
   * This is the output emitter for production to tell the parent to check it's content
   *
   * @type {EventEmitter<boolean>}
   * @memberOf OrderComponent
   */
  @Output() public onInit: EventEmitter<boolean> = new EventEmitter<boolean>();

  public parts: model.equipment_reference[];

  /**
   * Array to hold the files to be uploaded
   *
   * @type {dbStorage}
   * @memberOf PartComponent
   */
  public files: Storage = {};

  public orderList: model.order_parts[];

  public orderUploaded: boolean = false;

  /**
   * The distance from the view to the top of the container
   *
   * @private
   * @type {number}
   * @memberOf OrderComponent
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

  public listSet: boolean = false;

  public states: string[] = [
    'Good',
    'Bad'
  ];

  /**
   * Contains the model information
   *
   * @type {Site}
   * @memberOf SiteComponent
   */
  @Input() public model: model.DataTypes.orderList;

  /**
   * Contains array of order to part relationships
   *
   * @type {dbStorage}
   * @memberOf PartComponent
   */
  @Input() public modelArray: Storage;

  private partSubscription: Subscription;

  private heightSubscription: Subscription;

  private scrollSubscription: Subscription;

  private controlCardHeight: number = 0;

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
    private store: Store<fromRoot.State>,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Angular 2 life cycle hook that runs when creating this view
   *
   *
   * @memberOf OrderComponent
   */
  public ngOnInit() {
    // reset scroll variables
    this.scrollBottom = 0;
    this.scrollBottomDivHeight = 0;
    this.scrollTop = 0;
    this.scrollTopDivHeight = 0;
    this.scrollStartIndex = 0;
    this.scrollStopIndex = 0;

    // inform parent to reload
    this.onInit.emit(true);

    this.controlCardHeight = 220;

    this.partSubscription = this.store.select(fromRoot.getAllEquipment).subscribe(
      (value: model.equipment_reference[]) => {
        this.parts = value;
      }
    );

    this.heightSubscription = this.store.select(fromRoot.getHeight).subscribe(
      (value: number) => {
        this.listCardHeight = value - this.controlCardHeight;
      }
    );

    this.scrollSubscription = this.store.select(fromRoot.getEmitter).skip(1).subscribe(
      (value: any[]) => {
        this.scrollStartIndex = !isUndefined(value[0]) ? value[0] : 0;
        this.scrollStopIndex = !isUndefined(value[1]) ? value[1] : 0;
        this.cdr.detach();
        this.cdr.detectChanges();
        this.cdr.reattach();
      }
    );

    this.listSet = true;
    console.log(this.modelArray);
    console.log(values(this.modelArray));
    this.orderList = values(this.modelArray);
    this.numElements = this.orderList.length;
  }

  public ngOnDestroy() {
    if ( !isUndefined(this.partSubscription) ) {
      this.partSubscription.unsubscribe();
    }

    if (!isUndefined(this.heightSubscription)) {
      this.heightSubscription.unsubscribe();
    }

    if (!isUndefined(this.scrollSubscription)) {
      this.scrollSubscription.unsubscribe();
    }
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
      this.files['0'] = fileInput.target['files'][0];
    }
  }

  /**
   * Upload the file to the local webpage
   *
   *
   * @memberOf PartComponent
   */
  public upload() {
    this.listSet = true;

    // this.orderList = [
    //   new model.order_parts(
    //     'abcdefg',
    //     '',
    //     0,
    //     ''
    //   ),
    //   new model.order_parts(
    //     'abcdeff',
    //     '',
    //     0,
    //     ''
    //   )
    // ];

    // this.readFile().then(
    //   (rows: string[]) => {
    //     // parse files
    //     // manufacturer, model, description, type
    //     let headers: string[];
    //     if ( rows.length === 0 ) {
    //       this.snackBar.open('FILE INCORRECT FORMAT', 'OKAY', {duration: 2000});
    //     } else {
    //       this.model = { 0: new Part('', 0, '', '', '', '') } as dbStorage;

    //       let rowNum;
    //       let columns: string[];
    //       console.log(rows.length);

    //       for (rowNum = 0; rowNum < rows.length; rowNum++ ) {

    //         columns = rows[rowNum].split(',');
    //         if ( columns.length !== 4 ) {
    //           break;
    //         }

    //         if ( rowNum === 0 ) {
    //           // move a clone of the split row into headers
    //           headers = _.map(columns, (input: string) => { return input.toLowerCase(); });

    //           // check if headers has all the correct headers
    //           if ( _.difference(headers, ['manufacturer', 'model', 'description', 'type']).length > 0 ) {
    //             break;
    //           }
    //         } else if ( rowNum > 0 ) {
    //           this.model[(rowNum - 1).toString()] = new Part(
    //             '',
    //             (rowNum - 1),
    //             columns[_.indexOf(headers, 'manufacturer')],
    //             columns[_.indexOf(headers, 'model')],
    //             columns[_.indexOf(headers, 'description')],
    //             columns[_.indexOf(headers, 'type')]
    //           );
    //         }
    //       }

    //       if ( rowNum === 0 ) {
    //         this.snackBar.open('Incorrect headers, look at example', 'OKAY', {duration: 2000});
    //       } else {
    //         this.bulkBridge.emit(this.model);
    //       }
    //     }
    //   },
    //   (reason: any) => {
    //     this.snackBar.open(JSON.stringify(reason) || 'Failed to read file', 'OKAY', {duration: 2000});
    //   }
    // );
  }

  /**
   * Reads the file and returns it in a Promise
   *
   * @returns {Promise<string[]>}
   *
   * @memberOf OrderComponent
   */
  public readFile(): Promise<string[]> {
    return new Promise<string[]>((resolve: any, reject: any) => {
      let fileName = this.files['0'];
      if (!isUndefined(fileName)) {
        let reader = new FileReader();
        let result: string;
        reader.onload = (file: any) => {
          result = reader.result;
        };
        reader.onerror = (err: any) => {
          reject('FAILED TO READ FILE');
        };
        reader.onloadend = (input: any) => {
          resolve(result.split('\n'));
        };
        reader.readAsText(fileName);
      } else {
        reject('NO FILE UPLOADED');
      }
    });
  }

  /**
   * Checks if mulitple parts are being inserted
   *
   * @returns {boolean}
   *
   * @memberOf OrderComponent
   */
  public isBulk(): boolean {
    return !isUndefined(this.model);
  }

  /**
   * Check to see if this add is in readonly mode
   *
   * @returns {boolean} view === 'View'
   *
   * @memberOf OrderComponent
   */
  public isReadOnly(): boolean {
    return this.viewType === 'View';
  }

  /**
   * Download the order template csv file
   *
   *
   * @memberOf OrderComponent
   */
  public download() {
    fileSaver.saveAs(
      new Blob(['part #, notes, quantity,', ''], {type: 'text/plain;charset=utf-8'}),
      'OrderTemplate.csv'
    );
  }

  public removePart(partId: string) {
    // remove
  }
}
