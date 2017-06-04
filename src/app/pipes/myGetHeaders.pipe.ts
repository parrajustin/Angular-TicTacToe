import { Pipe, PipeTransform } from '@angular/core';
import { map, uniq, sortBy, filter, find, remove, isUndefined } from 'lodash';

import * as model from '../model';
import { DataTypes } from '../model';

@Pipe({
  name: 'myGetHeaders',
  pure: false
})
export class GetDataHeaders implements PipeTransform {
  public transform( data: any, dataName: DataTypes, trSites?: model.tr_sites[], siteList?: model.site_list[] ): string[] {
    if (dataName === DataTypes.siteList) {
      return [
        (data as model.site_list).site_name,
        (data as model.site_list).site_clli,
        (data as model.site_list).site_state
      ];
    } else if (dataName === DataTypes.trList) {
      // get the site -> tr relationships
      let affectedSitesIds: model.tr_sites[] = filter(
        trSites, { tr_id: (data as model.transmission_requirements).tr_id }
      );

      // get the site ids from the site -> tr relationships
      let affectedSitesIdsArry: number[] = map(affectedSitesIds, (element: model.tr_sites) => {
        return element.site_id;
      });
      affectedSitesIds = [];

      let affectedSites: model.site_list[] = [];
      let sites: model.site_list[] = siteList;

      let count = 0;
      const length = sites.length;
      const affectedCount = affectedSitesIdsArry.length;
      for ( let i = 0; i < length && count < affectedCount; i++ ) {
        // checks if this site's id is within the affected site ids array
        if ( affectedSitesIdsArry.indexOf(sites[i].site_id) !== -1 ) {
          affectedSites.push(sites[i]);
          count++;
        }
      }

      // let states = this.appState.get('site_state') || [];
      let stateString: string;

      // site selected isn't a new one
      // map all site states to an array
      stateString = sortBy(uniq(map(affectedSites, (element: model.site_list) => {
        return element.site_state;
      })), (input: any) => { return input; }).join(', ');

      return [
        (data as model.transmission_requirements).tr_number,
        stateString,
        (data as model.transmission_requirements).tr_engineer + ', ' + (data as model.transmission_requirements).tr_engineer2,
        (data as model.transmission_requirements).tr_status,
        new Date((data as model.transmission_requirements).tr_last_updated).getMonth() + '/' +
          new Date((data as model.transmission_requirements).tr_last_updated).getDay() + '/' +
          new Date((data as model.transmission_requirements).tr_last_updated).getFullYear()
      ];
    } else if (dataName === DataTypes.orderList) {
      return [
        String((data as model.orders).order_id),
        String((data as model.orders).tr_id),
        (data as model.orders).order_user,
        (data as model.orders).approver_attuid ? (data as model.orders).approver_attuid : 'N/A',
        (data as model.orders).order_status,
        new Date((data as model.orders).order_status_time).getMonth() + '/' +
          new Date((data as model.orders).order_status_time).getDay() + '/' +
          new Date((data as model.orders).order_status_time).getFullYear()
      ];
    } else if (dataName === DataTypes.partList) {
      let type = '';
      switch((data as model.equipment_reference).equipment_type) {
        default:
        case model.equipmentType.ANTENNA:
          type = 'ANTENNA';
          break;
        case model.equipmentType.BATTERY:
          type = 'BATTERY';
          break;
        case model.equipmentType.CONVERTER:
          type = 'CONVERTER';
          break;
        case model.equipmentType.CONVERTER_PLANT:
          type = 'CONVERTER_PLANT';
          break;
        case model.equipmentType.DEHYDRATOR:
          type = 'DEHYDRATOR';
          break;
        case model.equipmentType.INVERTER:
          type = 'INVERTER';
          break;
        case model.equipmentType.MICROWAVE:
          type = 'MICROWAVE';
          break;
        case model.equipmentType.MICROWAVE_SWITCH:
          type = 'MICROWAVE_SWITCH';
          break;
        case model.equipmentType.POWER_PLANT:
          type = 'POWER_PLANT';
          break;
        case model.equipmentType.RECTIFIER:
          type = 'RECTIFIER';
          break;
        case model.equipmentType.REPEATER:
          type = 'REPEATER';
          break;
        case model.equipmentType.RINGING:
          type = 'RINGING';
          break;
        case model.equipmentType.TMRS:
          type = 'TMRS';
          break;
        case model.equipmentType.WAVEGUIDE:
          type = 'WAVEGUIDE';
          break;
      }

      return [
        String((data as model.equipment_reference).equip_ref_id),
        (data as model.equipment_reference).equipment_mfr,
        (data as model.equipment_reference).equipment_oin,
        (data as model.equipment_reference).equipment_model_id,
        type
      ];
    }
  }
}
