/* tslint:disable */

/**
 * Defines the attachments object in the entity relationship diagram.
 *
 * @export
 * @class Attachment
 */
export class attachments {
  constructor(
    public attachment_id: number,
    public attachment_type: string,
    public attachment_date: Date,
    public site_id: number,
    public attachment_path: string,
    public attachment_title: string,
    public attachment_active: boolean
  ) {}
}