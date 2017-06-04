/* tslint:disable */

/**
 * Defines the transmission requirements object in the entity relationship diagram.
 *
 * @export
 * @class TR
 */
export class transmission_requirements {
  constructor(
    public tr_id: number,
    public tr_number: string,
    public tr_path: string,
    public tr_date: Date,
    public tr_status: string,
    public tr_last_updated: Date,
    public tr_assigned_date: Date,
    public tr_comment: string,
    public tr_engineer: string,
    public tr_engineer2: string,
    public tr_modifications: string,
    public tr_title: string,
    public tr_active: boolean
  ) {}
}
