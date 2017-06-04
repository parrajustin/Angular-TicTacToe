/* tslint:disable */

/**
 * Defines the orders object in the entity relationship diagram
 *
 * @export
 * @class Order
 */
export class orders {
  /**
   * Creates an instance of orders.
   * @param {string} order_id
   * @param {string} order_user
   * @param {string} order_status
   * @param {Date} order_status_time
   * @param {string} tr_id
   * @param {string} approver_attuid
   * @param {boolean} order_active
   *
   * @memberOf orders
   */
  constructor(
    public order_id: number,
    public order_user: string,
    public order_status: string,
    public order_status_time: Date,
    public tr_id: string,
    public approver_attuid: string,
    public order_active: boolean
  ) {}
}