export * from './state';

import * as attachmentActions from './attachment';
import * as orderActions from './order';
import * as orderPartActions from './orderParts';
import * as equipmentActions from './equipment';
import * as siteActions from './site';
import * as trActions from './tr';
import * as trSiteActions from './trSites';
import * as userActions from './users';

export const attachment = attachmentActions;
export const order = orderActions;
export const orderPart = orderPartActions;
export const equipment = equipmentActions;
export const site = siteActions;
export const tr = trActions;
export const trSite = trSiteActions;
export const user = userActions;
