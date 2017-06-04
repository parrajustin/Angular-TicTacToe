import { createSelector } from 'reselect';
import { find } from 'lodash';

import { order_parts } from '../model';
import * as collection from '../actions/orderParts';

export interface State {
  list: order_parts[];
  loaded: boolean;
  hash: string;
};

export const initialState: State = {
  list: [],
  loaded: false,
  hash: ''
};

export function reducer(state = initialState, action: collection.Actions): State {
  switch (action.type) {

    case collection.LOAD: {
      const payload: order_parts[] = action.payload;

      return {
        list: payload,
        loaded: true,
        hash: state.hash
      };
    }

    case collection.HASH: {
      return {
        list: state.list,
        loaded: state.loaded,
        hash: action.payload
      };
    }

    default: {
      return state;
    }
  }
}

export const getAll = (state: State) => state.list;

export const getHash = (state: State) => state.hash;

export const isLoaded = (state: State) => state.loaded;
