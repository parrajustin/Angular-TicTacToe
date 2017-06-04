/* tslint:disable */

/**
 * Defines the part_list object in the entity relationship diagram
 *
 * @export
 * @class Part
 */
export class equipment_reference {
  constructor(
    public equip_ref_id: number,
    public equipment_type: equipmentType,
    public equipment_description: string,
    public equipment_model_id: string,
    public equipment_mfr: string,
    public equipment_mfr_part_number: string,
    public equipment_oin: string,
    public equipment_heci: string,
    public equipment_has_size: boolean,
    public equipment_unit: string,
    public equipment_notes: string
  ) {}
}


export const enum equipmentType {
  ANTENNA, 
  BATTERY, 
  CONVERTER, 
  CONVERTER_PLANT, 
  DEHYDRATOR, 
  INVERTER, 
  MICROWAVE, 
  MICROWAVE_SWITCH, 
  POWER_PLANT, 
  RECTIFIER, 
  REPEATER, 
  RINGING, 
  TMRS, 
  WAVEGUIDE
}