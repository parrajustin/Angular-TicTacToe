/* tslint:disable */

/**
 * Defines the tr-site object in the entity relationship diagram.
 *
 * @export
 * @class tr_sites
 */
export class tr_sites {
  /**
   * Creates an instance of tr_sites.
   * @param {number} trId 
   * @param {number} siteId 
   * 
   * @memberOf tr_sites
   */
  constructor(
    public tr_id: number,
    public site_id: number
  ) {}
}
