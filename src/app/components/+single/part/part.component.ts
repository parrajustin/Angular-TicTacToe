import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { map, keys, isUndefined, difference, indexOf } from 'lodash';
import { MdSnackBar } from '@angular/material';
import * as fileSaver from 'file-saver';

import { Storage } from '../single.component';
import * as model from '../../../model';

/**
 * TR component that handles updating and editing sites
 *
 * @export
 * @class TRComponent
 */
@Component({
  selector: 'partAdd',
  styleUrls: [ './part.component.css' ],
  templateUrl: './part.component.html'
})
export class PartComponent implements OnInit {
  /**
   * The contents of this variable represents the view type of the SiteComponent
   * which is either view, edit, add
   * @type {String}
   * @memberOf PartComponent
   */
  @Input() public viewType: String;

  /**
   * This is the output emitter for production to tell the parent to check it's content
   *
   * @type {EventEmitter<boolean>}
   * @memberOf PartComponent
   */
  @Output() public onInit: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Array to hold the files to be uploaded
   *
   * @type {dbStorage}
   * @memberOf PartComponent
   */
  public files: Storage = {};

  /**
   * Contains the model information
   * used only when editing a single part's information
   *
   * @type {Site}
   * @memberOf SiteComponent
   */
  @Input() public model: model.equipment_reference;

  /**
   * Contains db storage version of parts
   * Used only when parts are being inserted in bulk
   *
   * @type {dbStorage}
   * @memberOf PartComponent
   */
  @Input() public modelArray: Storage;

  /**
   * Creates an instance of PartComponent.
   * @param {AppState} appState the state holder
   * @param {MdSnackBar} snackBar reference to the material snackbar
   *
   * @memberOf PartComponent
   */
  constructor(
    public snackBar: MdSnackBar
  ) {}

  /**
   * Angular 2 life cycle hook that runs when creating this view
   *
   *
   * @memberOf PartComponent
   */
  public ngOnInit() {
    this.onInit.emit(true);
  }

  /**
   * Event that happens everytime there is a change to the attachment input tags
   *
   * @param {*} fileInput the file input
   *
   * @memberOf PartComponent
   */
  public fileChange(fileInput: any) {
    if ( !isUndefined(fileInput) && !isUndefined(fileInput.target) && !isUndefined(fileInput.target['files']) ) {
      this.files['0'] = fileInput.target['files'][0];
    }
  }

  /**
   * Download the part template csv file
   *
   *
   * @memberOf PartComponent
   */
  public download() {
    fileSaver.saveAs(
      new Blob(['manufacturer,model,description,type,has_size (0/1),unit,active (0/1)', ''], {type: 'text/plain;charset=utf-8'}),
      'PartTemplate.csv'
    );
  }

  /**
   * Upload the file to the local webpage
   *
   *
   * @memberOf PartComponent
   */
  public upload() {
    this.readFile().then(
      (rows: string[]) => {
        // parse files
        // manufacturer, model, description, type
        let headers: string[];
        const rowLength = rows.length;
        console.log('uploading');
        if ( rowLength === 0 || rowLength === 1 ) {
          this.snackBar.open('EMPTY UPLOAD', 'OKAY', {duration: 3000});
        } else {
          this.modelArray = {};
          console.log(rowLength);

          let rowNum;
          let columns: string[];
          let tempUnit = '';
          console.log(rows);

          for (rowNum = 0; rowNum < rowLength; rowNum++ ) {
            columns = rows[rowNum].split(',');
            console.log(columns);

            if ( columns.length !== 7 ) {
              break;
            }

            if ( rowNum === 0 ) {
              // move a clone of the split row into headers
              headers = map(columns, (input: string) => { return input.toLowerCase().trim(); });

              if ( difference(headers, ['manufacturer', 'model', 'oin', 'description', 'type', 'has_size (0/1)', 'unit', 'active (0/1)'])
                .length > 0 ) {
                break;
              }
            } else if ( rowNum > 0 ) {
              // TODO: Add in oin parsing
              this.modelArray[(rowNum - 1).toString()] = new model.equipment_reference(
                0,
                Number(columns[indexOf(headers, 'type')].trim()),
                columns[indexOf(headers, 'description')].trim(),
                columns[indexOf(headers, 'model')].trim(),
                columns[indexOf(headers, 'manufacturer')].trim(),
                '',
                '',
                '',
                columns[indexOf(headers, 'has_size (0/1)')].trim() === '1',
                columns[indexOf(headers, 'unit')].trim(),
                ''
              );
            }
          }

          console.log(this.modelArray);

          if ( rowNum === 0 ) {
            this.snackBar.open('Incorrect headers, look at example', 'OKAY', {duration: 3000});
          }
        }
      },
      (reason: any) => {
        if ( typeof reason === 'string' ) {
          this.snackBar.open(reason || 'Unknown read file error', 'OKAY', {duration: 3000});
        } else {
          this.snackBar.open(JSON.stringify(reason) || 'Unknown read file error', 'OKAY', {duration: 3000});
        }
      }
    );
  }

  /**
   * Reads the file and returns it in a Promise
   *
   * @returns {Promise<string[]>} the string array of the file's rows
   *
   * @memberOf PartComponent
   */
  public readFile(): Promise<string[]> {
    return new Promise<string[]>((resolve: any, reject: any) => {
      let file = this.files['0'];
      console.log(file);

      if (!isUndefined(file) && String(file['name']).substr(String(file['name']).lastIndexOf('.')) === '.csv') {
        let reader = new FileReader();
        let result: string;
        reader.onload = (input: any) => {
          result = reader.result;
        };
        reader.onerror = (err: any) => {
          reject('FAILED TO READ FILE');
        };
        reader.onloadend = (input: any) => {
          resolve(result.split('\n'));
        };
        reader.readAsText(file);
      } else {
        reject('NO FILE UPLOADED OR INCORRECT FILE TYPE');
      }
    });
  }

  /**
   * Check to see if multiple parts are being inserted
   *
   * @returns {boolean} true if multiple parts are defined
   *
   * @memberOf PartComponent
   */
  public isBulk(): boolean {
    return keys(this.modelArray).length > 0;
  }

  /**
   * Check if component is in readonly mode
   *
   * @returns {boolean} true if component is in view mode
   *
   * @memberOf PartComponent
   */
  public isReadOnly(): boolean {
    return this.viewType === 'View';
  }

  /**
   * Returns the modelArray object as an array
   *
   * @returns {model.parts_list[]} the array of parts_list items
   *
   * @memberOf PartComponent
   */
  public getParts(): model.equipment_reference[] {
    return map(this.modelArray, (input: model.equipment_reference) => { return input; } );
  }
}
