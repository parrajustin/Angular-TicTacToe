/* tslint:disable */
                                                                                                                                                      

/**
 * Used to represent how the server responds to post api calls
 *
 * @class ResponsePost
 */
export class ResponsePost {
  constructor(
    public status: string,
    public response: any,
    public id: string,
  ) {}
};

/**
 * Used to represent how the server responds to get api calls
 *
 * @class ResponseGet
 */
export class ResponseGet {
  constructor(
    public status: string,
    public response: any,
    public list: any[]
  ) {}
}

/* tslint:enable */

//
//                                                                     dddddddd
//  hhhhhhh                                                            d::::::d
//  h:::::h                                                            d::::::d
//  h:::::h                                                            d::::::d
//  h:::::h                                                            d:::::d
//   h::::h hhhhh           eeeeeeeeeeee    aaaaaaaaaaaaa      ddddddddd:::::d     eeeeeeeeeeee    rrrrr   rrrrrrrrr
//   h::::hh:::::hhh      ee::::::::::::ee  a::::::::::::a   dd::::::::::::::d   ee::::::::::::ee  r::::rrr:::::::::r
//   h::::::::::::::hh   e::::::eeeee:::::eeaaaaaaaaa:::::a d::::::::::::::::d  e::::::eeeee:::::eer:::::::::::::::::r
//   h:::::::hhh::::::h e::::::e     e:::::e         a::::ad:::::::ddddd:::::d e::::::e     e:::::err::::::rrrrr::::::r
//   h::::::h   h::::::he:::::::eeeee::::::e  aaaaaaa:::::ad::::::d    d:::::d e:::::::eeeee::::::e r:::::r     r:::::r
//   h:::::h     h:::::he:::::::::::::::::e aa::::::::::::ad:::::d     d:::::d e:::::::::::::::::e  r:::::r     rrrrrrr
//   h:::::h     h:::::he::::::eeeeeeeeeee a::::aaaa::::::ad:::::d     d:::::d e::::::eeeeeeeeeee   r:::::r
//   h:::::h     h:::::he:::::::e         a::::a    a:::::ad:::::d     d:::::d e:::::::e            r:::::r
//   h:::::h     h:::::he::::::::e        a::::a    a:::::ad::::::ddddd::::::dde::::::::e           r:::::r
//   h:::::h     h:::::h e::::::::eeeeeeeea:::::aaaa::::::a d:::::::::::::::::d e::::::::eeeeeeee   r:::::r
//   h:::::h     h:::::h  ee:::::::::::::e a::::::::::aa:::a d:::::::::ddd::::d  ee:::::::::::::e   r:::::r
//   hhhhhhh     hhhhhhh    eeeeeeeeeeeeee  aaaaaaaaaa  aaaa  ddddddddd   ddddd    eeeeeeeeeeeeee   rrrrrrr
//
//
//
//
//
//
//

/**
 * The strcuture of the header titles
 * Very necessary for sorting data since header displayed can be different than what the header repreesents in the data model
 *
 * @class HeaderStruct
 */
export class HeaderStruct {
  /**
   * Creates an instance of HeaderStruct.
   * @param {string} value
   * @param {string} type
   *
   * @memberOf HeaderStruct
   */
  constructor (
    public value: string,
    public type: string,
  ) {}
}

/**
 * Used to define the headers that are displayed on the home page
 * @param dataType
 */
export function getHeaders(dataType: DataTypes): HeaderStruct[] {
  if (dataType === DataTypes.siteList) {
    return [
      new HeaderStruct('Site Name', 'site_name'),
      new HeaderStruct('CLLI', 'site_clli'),
      new HeaderStruct('States', 'STATES')
    ];
  } else if (dataType === DataTypes.trList) {
    return [
      new HeaderStruct('TR #', 'tr_number'),
      new HeaderStruct('States', 'STATES'),
      new HeaderStruct('Engineer', 'tr_engineer'),
      new HeaderStruct('Status', 'tr_status'),
      new HeaderStruct('Updated', 'tr_last_updated')
    ];
  } else if (dataType === DataTypes.partList) {
    return [
      new HeaderStruct('Part Number', 'equipment_number'),
      new HeaderStruct('Manufacturer', 'equipment_manufacturer'),
      new HeaderStruct('OIN', 'equipment_oin'),
      new HeaderStruct('Model', 'equipment_model'),
      new HeaderStruct('Type', 'equipment_type')
    ];
  } else if (dataType === DataTypes.orderList) {
    return [
      new HeaderStruct('Order', 'order_id'),
      new HeaderStruct('TR #', 'tr_id'),
      new HeaderStruct('User', 'order_user'),
      new HeaderStruct('Approver', 'approver_attuid'),
      new HeaderStruct('Status', 'order_status'),
      new HeaderStruct('Date', 'order_status_time')
    ];
  }
}

export const enum DataTypes {
  trList,
  siteList,
  orderList,
  partList,
  orderPartList,
  attachments,
  trSites,
  callSign,
  users,
  uid,
  dataName,
  view,
  selected
}
