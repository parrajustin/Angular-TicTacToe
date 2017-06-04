import { createSelector } from 'reselect';
import { ActionReducer } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';
import { filter, find } from 'lodash';

import * as model from '../model';
// import { environment } from '../../environments/environment';

/**
 * The compose function is one of our most handy tools. In basic terms, you give
 * it any number of functions and it returns a function. This new function
 * takes a value and chains it through every composed function, returning
 * the output.
 *
 * More: https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch5.html
 */
// import { compose } from '@ngrx/core/compose';

/**
 * storeFreeze prevents state from being mutated. When mutation occurs, an
 * exception will be thrown. This is useful during development mode to
 * ensure that none of the reducers accidentally mutates the state.
 */
// import { storeFreeze } from 'ngrx-store-freeze';

/**
 * combineReducers is another useful metareducer that takes a map of reducer
 * functions and creates a new reducer that gathers the values
 * of each reducer and stores them using the reducer's key. Think of it
 * almost like a database, where every reducer is a table in the db.
 *
 * More: https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch
 */
import { combineReducers } from '@ngrx/store';

/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */
import * as fromAttachments from './attachments';
import * as fromOrder from './order';
import * as fromOrderParts from './orderParts';
import * as fromEquipment from './equipment';
import * as fromSite from './site';
import * as fromState from './state';
import * as fromTR from './tr';
import * as fromTRSites from './trSites';
import * as fromUsers from './users';

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
  attachments: fromAttachments.State;
  order: fromOrder.State;
  orderParts: fromOrderParts.State;
  equipment: fromEquipment.State;
  site: fromSite.State;
  state: fromState.State;
  tr: fromTR.State;
  trSites: fromTRSites.State;
  users: fromUsers.State;
  router: fromRouter.RouterState;
}

/**
 * Because metareducers take a reducer function and return a new reducer,
 * we can use our compose helper to chain them together. Here we are
 * using combineReducers to make our top level reducer, and then
 * wrapping that in storeLogger. Remember that compose applies
 * the result from right to left.
 */
const reducers = {
  attachments: fromAttachments.reducer,
  order: fromOrder.reducer,
  orderParts: fromOrderParts.reducer,
  equipment: fromEquipment.reducer,
  site: fromSite.reducer,
  state: fromState.reducer,
  tr: fromTR.reducer,
  trSites: fromTRSites.reducer,
  users: fromUsers.reducer,
  router: fromRouter.routerReducer,
};

// const developmentReducer: ActionReducer<State> = compose(storeFreeze, combineReducers)(reducers);
const productionReducer: ActionReducer<State> = combineReducers(reducers);

export function reducer(state: any, action: any) {
  // if (environment.production) {
  return productionReducer(state, action);
  // } else {
  //   return developmentReducer(state, action);
  // }
}

/**
 * A selector function is a map function factory. We pass it parameters and it
 * returns a function that maps from the larger state tree into a smaller
 * piece of state. This selector simply selects the `books` state.
 *
 * Selectors are used with the `select` operator.
 *
 * ```ts
 * class MyComponent {
 * 	constructor(state$: Observable<State>) {
 * 	  this.booksState$ = state$.select(getBooksState);
 * 	}
 * }
 * ```
 */
export const getAttachmentState = (state: State) => state.attachments;

/**
 * Every reducer module exports selector functions, however child reducers
 * have no knowledge of the overall state tree. To make them useable, we
 * need to make new selectors that wrap them.
 *
 * The createSelector function from the reselect library creates
 * very efficient selectors that are memoized and only recompute when arguments change.
 * The created selectors can also be composed together to select different
 * pieces of state.
 */
export const areAttachmentsLoaded = createSelector(getAttachmentState, fromAttachments.isLoaded);
export const getAllAttachments = createSelector(getAttachmentState, fromAttachments.getAll);
export const getAttachmentsHash = createSelector(getAttachmentState, fromAttachments.getHash);

/**
 * Just like with the books selectors, we also have to compose the search
 * reducer's and collection reducer's selectors.
 */
export const getOrderState = (state: State) => state.order;
export const areOrdersLoaded = createSelector(getOrderState, fromOrder.isLoaded);
export const getAllOrders = createSelector(getOrderState, fromOrder.getAll);
export const getOrdersHash = createSelector(getOrderState, fromOrder.getHash);

export const getOrderPartState = (state: State) => state.orderParts;
export const areOrderPartsLoaded = createSelector(getOrderPartState, fromOrderParts.isLoaded);
export const getAllOrderParts = createSelector(getOrderPartState, fromOrderParts.getAll);
export const getOrderPartsHash = createSelector(getOrderPartState, fromOrderParts.getHash);

export const getEquipmentState = (state: State) => state.equipment;
export const areEquipmentsLoaded = createSelector(getEquipmentState, fromEquipment.isLoaded);
export const getAllEquipment = createSelector(getEquipmentState, fromEquipment.getAll);
export const getEquipmentHash = createSelector(getEquipmentState, fromEquipment.getHash);

export const getSiteState = (state: State) => state.site;
export const areSitesLoaded = createSelector(getSiteState, fromSite.isLoaded);
export const getAllSites = createSelector(getSiteState, fromSite.getAll);
export const getSiteHash = createSelector(getSiteState, fromSite.getHash);

export const getTRState = (state: State) => state.tr;
export const areTRsLoaded = createSelector(getTRState, fromTR.isLoaded);
export const getAllTRs = createSelector(getTRState, fromTR.getAll);
export const getTRHash = createSelector(getTRState, fromTR.getHash);

export const getTRSitesState = (state: State) => state.trSites;
export const areTRSitesLoaded = createSelector(getTRSitesState, fromTRSites.isLoaded);
export const getAllTRSites = createSelector(getTRSitesState, fromTRSites.getAll);
export const getTRSitesHash = createSelector(getTRSitesState, fromTRSites.getHash);

export const getUserState = (state: State) => state.users;
export const areUsersLoaded = createSelector(getUserState, fromUsers.isLoaded);
export const getAllUsers = createSelector(getUserState, fromUsers.getAll);
export const getUserHash = createSelector(getUserState, fromUsers.getHash);

export const getState = (state: State) => state.state;
export const getWidth = createSelector(getState, fromState.getWidth);
export const getHeight = createSelector(getState, fromState.getHeight);
export const getView = createSelector(getState, fromState.getView);
export const getUserId = createSelector(getState, fromState.getUserId);
export const getDataType = createSelector(getState, fromState.getDataType);
export const getEmitter = createSelector(getState, fromState.getEmitter);
export const getSelectedId = createSelector(getState, fromState.getSelectedId);
export const getButtonEmitter = createSelector(getState, fromState.getButtonEmitter);
export const getCart = createSelector(getState, fromState.getCart);

// /**
//  * Some selector functions create joins across parts of state. This selector
//  * composes the search result IDs to return an array of books in the store.
//  */
export const getSiteAttachments = createSelector(getAllAttachments, getSelectedId, (attachments, siteId) => {
  return filter(attachments, (element: model.attachments) => { return element.site_id === siteId; });
});

export const getTRSites = createSelector(getAllTRSites, getSelectedId, (trSites, trId) => {
  return filter(trSites, (element: model.tr_sites) => { return element.tr_id === trId; });
});

export const getAffectedSites = createSelector(getAllSites, getAllTRSites, (sites, trSites) => {
  return filter(sites, (element: model.site_list) => {
    return find(trSites, ['site_id', element.site_id]) !== undefined;
  });
});

export const getDataList = createSelector(getDataType, getAllTRs, getAllSites, getAllOrders, getAllEquipment,
  (d: model.DataTypes, t: model.transmission_requirements[], s: model.site_list[], o: model.orders[], p: model.equipment_reference[]) => {
    switch (d) {
      default: {
        return t;
      }

      case model.DataTypes.trList: {
        return t;
      }

      case model.DataTypes.siteList: {
        return s;
      }

      case model.DataTypes.orderList: {
        return o;
      }

      case model.DataTypes.partList: {
        return p;
      }
    }
  }
);

export const getSelected = createSelector(getAllTRs, getAllSites, getAllOrders, getAllEquipment, getSelectedId, getDataType,
  (t: model.transmission_requirements[], s: model.site_list[], o: model.orders[], p: model.equipment_reference[], id: number, d: model.DataTypes) => {
    if ( id <= -1 ) {
      return undefined;
    }

    switch (d) {
      default:
      case model.DataTypes.trList: {
        return find(t, (element: model.transmission_requirements) => { return element.tr_id === id; });
      }

      case model.DataTypes.siteList: {
        return find(s, (element: model.site_list) => { return element.site_id === id; });
      }

      case model.DataTypes.orderList: {
        return find(o, (element: model.orders) => { return element.order_id === id; });
      }

      case model.DataTypes.partList: {
        return find(p, (element: model.equipment_reference) => { return element.equip_ref_id === id; });
      }
    }
  }
);

export const getLoaded = createSelector(areTRsLoaded, areSitesLoaded, areOrdersLoaded, areEquipmentsLoaded, getDataType,
  (t: boolean, s: boolean, o: boolean, p: boolean, d: model.DataTypes) => {
    switch (d) {
      default:
      case model.DataTypes.trList: {
        return t;
      }

      case model.DataTypes.siteList: {
        return s;
      }

      case model.DataTypes.orderList: {
        return o;
      }

      case model.DataTypes.partList: {
        return p;
      }
    }
  }
);

export const getAssignedTrs = createSelector(getAllTRs, getUserId, (t: model.transmission_requirements[], uId: string) => {
  return filter(t, (element: model.transmission_requirements) => {
    return element.tr_engineer === uId || element.tr_engineer2 === uId;
  });
});

export const getAssignedOrders = createSelector(getAllOrders, getUserId, (o: model.orders[], uId: string) => {
  return filter(o, (element: model.orders) => {
    return element.order_user === uId;
  });
});

// export const getCollectionState = (state: State) => state.collection;

// export const getCollectionLoaded = createSelector(getCollectionState, fromCollection.getLoaded);
// export const getCollectionLoading = createSelector(getCollectionState, fromCollection.getLoading);
// export const getCollectionBookIds = createSelector(getCollectionState, fromCollection.getIds);

// export const getBookCollection = createSelector(getBookEntities, getCollectionBookIds, (entities, ids) => {
//   return ids.map(id => entities[id]);
// });

// export const isSelectedBookInCollection = createSelector(getCollectionBookIds, getSelectedBookId, (ids, selected) => {
//   return ids.indexOf(selected) > -1;
// });

// /**
//  * Layout Reducers
//  */
// export const getLayoutState = (state: State) => state.layout;

// export const getShowSidenav = createSelector(getLayoutState, fromLayout.getShowSidenav);
