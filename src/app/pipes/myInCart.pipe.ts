import { Pipe, PipeTransform } from '@angular/core';
import * as model from '../model';

import { find, isUndefined } from 'lodash';

@Pipe({
  name: 'myInCart',
  pure: false
})
export class InCart implements PipeTransform {

  public transform( id: string, cart: model.equipment_reference[] ): boolean {
    return !isUndefined(find(cart, ['equip_ref_id', id]));
  }
}
