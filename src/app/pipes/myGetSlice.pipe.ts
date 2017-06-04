import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myGetSlice',
  pure: false
})
export class GetSlice implements PipeTransform {

  /**
   * Only gets a slice of data from start to stop (exclusive)
   *
   * @param {any[]} data the data to slice
   * @param {number} start the start index of where to retrieve items
   * @param {number} stop where to stop
   * @returns {*} the sliced array
   *
   * @memberOf GetSlice
   */
  public transform( data: any[], start: number, stop: number ): any {
    let output: any[] = [];
    const length = data.length;
    const stopvalid = stop > start;

    for ( let i = start; (stopvalid && i < stop) && i < length; i++ ) {
      output.push(data[i]);
    }

    return output;
  }
}