import { Pipe, PipeTransform } from '@angular/core';
import * as model from '../model';
import { filter } from 'lodash';

@Pipe({
  name: 'myGetParts',
  pure: false
})
export class GetParts implements PipeTransform {
  public transform( data: model.order_parts[], parts: model.equipment_reference[] = []): model.equipment_reference[] {
    let output: model.equipment_reference[] = [];

    const length = parts.length;
    output = filter(parts, (part: model.equipment_reference) => {
      return filter(data, (order: model.order_parts) => { return order.equip_ref_id === part.equip_ref_id; }) !== [];
    });

    return output;
  }
}
