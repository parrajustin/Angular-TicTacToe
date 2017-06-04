import { Pipe, PipeTransform } from '@angular/core';
import { filter, indexOf } from 'lodash';

import * as model from '../model';

@Pipe({
  name: 'myGetSelectedSite',
  pure: false
})
export class GetSelectedSites implements PipeTransform {
  public transform( data: model.site_list[], selected: number[] = []): model.site_list[] {
    let output: model.site_list[] = [];
    let tempDate: model.site_list[] = [];

    output = filter(data, (element: model.site_list) => {
      return indexOf(selected, element.site_id) !== -1;
    });

    return output;
  }
}