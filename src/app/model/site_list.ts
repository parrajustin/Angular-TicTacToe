/* tslint:disable */
/**
 * Defines the site_List in the entity relationship diagram.
 *
 * @export
 * @class Site
 */
export class site_list {
  constructor(
    public site_id: number,
    public site_name: string,
    public site_callSign: string,
    public site_clli: string,
    public site_address: string,
    public site_state: string,
    public site_tower_asr: number,
    public site_tower_model: string,
    public site_tower_location: string,
    public site_geo: string,
    public site_par: string,
    public site_latitude: number,
    public site_longitude: number,
    public site_elevation: string,
    public site_active: boolean
  ) {}
}