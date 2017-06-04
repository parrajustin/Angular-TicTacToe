import { createSelector } from 'reselect';
import { indexOf, map, zipObject, values, isNull, concat, filter, find, isUndefined } from 'lodash';
import { EventEmitter } from '@angular/core';

import * as model from '../model';
import * as stateActions from '../actions/state';
// import * as collection from '../actions/collection';

export interface State {
  width: number;
  height: number;
  view: string;
  dataType: model.DataTypes;
  userId: string;
  scrollEmitter: any[];
  selectedId: number;
  button: EventEmitter<string>;
  cart: model.equipment_reference[];
};

export const initialState: State = {
  width: 0,
  height: 0,
  view: 'Welcome',
  dataType: 100,
  userId: '',
  scrollEmitter: [],
  selectedId: 0,
  button: new EventEmitter<string>(),
  cart: []
};

export function reducer(state = initialState, action: stateActions.Actions): State {
  switch (action.type) {

    case stateActions.SETWIDTH: {
      const payload = (isNull(action.payload) ? state.width : action.payload);

      return {
        width: payload,
        height: state.height,
        view: state.view,
        dataType: state.dataType,
        userId: state.userId,
        scrollEmitter: state.scrollEmitter,
        selectedId: state.selectedId,
        button: state.button,
        cart: state.cart
      };
    }

    case stateActions.SETHEIGHT: {
      const payload = (isNull(action.payload) ? state.height : action.payload);

      return {
        width: state.width,
        height: payload,
        view: state.view,
        dataType: state.dataType,
        userId: state.userId,
        scrollEmitter: state.scrollEmitter,
        selectedId: state.selectedId,
        button: state.button,
        cart: state.cart
      };
    }

    case stateActions.SETDATATYPE: {
      const payload = (isNull(action.payload) ? state.dataType : action.payload);

      return {
        width: state.width,
        height: state.height,
        view: state.view,
        dataType: payload,
        userId: state.userId,
        scrollEmitter: state.scrollEmitter,
        selectedId: state.selectedId,
        button: state.button,
        cart: state.cart
      };
    }

    case stateActions.SETUSERID: {
      const payload = (isNull(action.payload) ? state.userId : action.payload);

      return {
        width: state.width,
        height: state.height,
        view: state.view,
        dataType: state.dataType,
        userId: payload,
        scrollEmitter: state.scrollEmitter,
        selectedId: state.selectedId,
        button: state.button,
        cart: state.cart
      };
    }

    case stateActions.SETVIEW: {
      const payload = (isNull(action.payload) ? state.view : action.payload);

      return {
        width: state.width,
        height: state.height,
        view: payload,
        dataType: state.dataType,
        userId: state.userId,
        scrollEmitter: state.scrollEmitter,
        selectedId: state.selectedId,
        button: state.button,
        cart: state.cart
      };
    }

    case stateActions.SETEMITTER: {
      const payload = (isNull(action.payload) ? state.scrollEmitter : action.payload);

      return {
        width: state.width,
        height: state.height,
        view: state.view,
        dataType: state.dataType,
        userId: state.userId,
        scrollEmitter: payload,
        selectedId: state.selectedId,
        button: state.button,
        cart: state.cart
      };
    }

    case stateActions.SETSELECTEDID: {
      const payload = (isNull(action.payload) ? state.selectedId : action.payload);

      return {
        width: state.width,
        height: state.height,
        view: state.view,
        dataType: state.dataType,
        userId: state.userId,
        scrollEmitter: state.scrollEmitter,
        selectedId: payload,
        button: state.button,
        cart: state.cart
      };
    }

    case stateActions.SETBUTTONEVENT: {
      if ( !isNull(action.payload) ) {
        state.button.emit(action.payload);
      }

      return {
        width: state.width,
        height: state.height,
        view: state.view,
        dataType: state.dataType,
        userId: state.userId,
        scrollEmitter: state.scrollEmitter,
        selectedId: state.selectedId,
        button: state.button,
        cart: state.cart
      };
    }

    case stateActions.ADDTOCART: {
      if ( isUndefined(find(state.cart, ['part_id', action.payload.equip_ref_id])) ) {
        return {
          width: state.width,
          height: state.height,
          view: state.view,
          dataType: state.dataType,
          userId: state.userId,
          scrollEmitter: state.scrollEmitter,
          selectedId: state.selectedId,
          button: state.button,
          cart: concat(state.cart, action.payload)
        };
      } else {
        return {
          width: state.width,
          height: state.height,
          view: state.view,
          dataType: state.dataType,
          userId: state.userId,
          scrollEmitter: state.scrollEmitter,
          selectedId: state.selectedId,
          button: state.button,
          cart: state.cart
        };
      }
    }

    case stateActions.CLEARCART: {
      return {
        width: state.width,
        height: state.height,
        view: state.view,
        dataType: state.dataType,
        userId: state.userId,
        scrollEmitter: state.scrollEmitter,
        selectedId: state.selectedId,
        button: state.button,
        cart: []
      };
    }

    case stateActions.REMOVEFROMCART: {
      return {
        width: state.width,
        height: state.height,
        view: state.view,
        dataType: state.dataType,
        userId: state.userId,
        scrollEmitter: state.scrollEmitter,
        selectedId: state.selectedId,
        button: state.button,
        cart: filter(state.cart, (element: model.equipment_reference) => { return element.equip_ref_id !== action.payload; })
      };
    }

    default: {
      return state;
    }
  }
}

/**
 * Because the data structure is defined within the reducer it is optimal to
 * locate our selector functions at this level. If store is to be thought of
 * as a database, and reducers the tables, selectors can be considered the
 * queries into said database. Remember to keep your selectors small and
 * focused so they can be combined and composed to fit each particular
 * use-case.
 */

export const getWidth = (state: State) => state.width;

export const getHeight = (state: State) => state.height;

export const getView = (state: State) => state.view;

export const getDataType = (state: State) => state.dataType;

export const getUserId = (state: State) => state.userId;

export const getEmitter = (state: State) => state.scrollEmitter;

export const getSelectedId = (state: State) => state.selectedId;

export const getButtonEmitter = (state: State) => state.button;

export const getCart = (state: State) => state.cart;
