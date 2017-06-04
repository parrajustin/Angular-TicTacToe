import { Pipe, PipeTransform } from '@angular/core';
import { isUndefined, uniqueId } from 'lodash';

/**
 * myGetData pipe that orders data
 *
 * @export
 * @class GetDataPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'myGetData',
  pure: false
})
export class GetDataPipe implements PipeTransform {

  /**
   * Trans forms the data array to an array orderd by the order array where each number refers to the index in the data array
   *
   * @param {any[]} data the data to transform
   * @param {number} start the start index to return
   * @param {number} stop the exclusive stop index
   * @param {number[]} [order=undefined] the order in which to render the data
   * @returns {*} the array in a specified order from [start, stop]
   *
   * @memberof GetDataPipe
   */
  public transform( data: any[], start: number, stop: number, order: number[] = undefined): any {
    let output: any[] = [];
    const length = order.length || data.length || 0;
    const orderCheck = !isUndefined(order);
    start = Math.max(0, start);
    // clamp the value within where stop is less than data.length
    stop = Math.min(data.length, Math.max(stop, start));

    for (let i = start; i < length && i < stop; i++ ) {
      let temp = data[ orderCheck ? order[i] : i]; // order the data based on the order array or the index if there is no order array

      if ( isUndefined(temp['id']) ) {
        temp['id'] = temp['site_id'] || temp['tr_id'] || temp['order_id'] || temp['equip_ref_id'] || String(-1);
      }

      output.push(temp);
    }
    return output;
  }
}