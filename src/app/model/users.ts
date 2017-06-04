/* tslint:disable */

/**
 * The users table type
 * 
 * @export
 * @class users
 */
export class users {
  /**
   * Creates an instance of users.
   * @param {string} user_attuid 
   * @param {string} display_name 
   * @param {number} user_role 
   * 
   * @memberOf users
   */
  constructor(
    public user_attuid: string,
    public display_name: string,
    public user_role: number
  ) {}
}

