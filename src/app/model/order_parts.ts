/* tslint:disable */

/**
 * The order parts link table
 * 
 * @export
 * @class order_parts
 */
export class order_parts {
  /**
   * Creates an instance of order_parts.
   * @param {string} part_id 
   * @param {string} order_id 
   * @param {number} part_quantity 
   * @param {string} quote_number 
   * 
   * @memberOf order_parts
   */
  constructor(
    public order_id: number,
    public equip_ref_id: number,
    public part_quantity: number,
    public quote_number: string,
    public part_notes: string
  ) {}
}