import { Action } from '@ngrx/store';
import { DataTypes } from '../model';
import * as model from '../model';

export const SETHEIGHT =      '[state] set height';
export const SETWIDTH =       '[state] set width';
export const SETEMITTER =     '[state] set scroll emitter';
export const SETVIEW =        '[state] set view';
export const SETDATATYPE =    '[state] set type';
export const SETUSERID =      '[state] set user id';
export const SETSELECTEDID =  '[state] set selected id';
export const SETBUTTONEVENT = '[state] set button event';
export const ADDTOCART =      '[state] add to cart';
export const CLEARCART =      '[state] clear cart';
export const REMOVEFROMCART = '[state] remove from cart';

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class SetWidthAction implements Action {
  public readonly type = SETWIDTH;

  constructor(public payload: number) {}
}

export class SetHeightAction implements Action {
  public readonly type = SETHEIGHT;

  constructor(public payload: number) { }
}

export class SetTypeAction implements Action {
  public readonly type = SETDATATYPE;

  constructor(public payload: DataTypes) { }
}
export class SetUserIdAction implements Action {
  public readonly type = SETUSERID;

  constructor(public payload: string) { }
}
export class SetViewAction implements Action {
  public readonly type = SETVIEW;

  constructor(public payload: string) { }
}

export class SetEmitterAction implements Action {
  public readonly type = SETEMITTER;

  constructor(public payload: any[]) { }
}

export class SetSelectedAction implements Action {
  public readonly type = SETSELECTEDID;

  constructor(public payload: number) { }
}

export class SetButtonAction implements Action {
  public readonly type = SETBUTTONEVENT;

  constructor(public payload: string) { }
}

export class AddToCart implements Action {
  public readonly type = ADDTOCART;

  constructor(public payload: model.equipment_reference) { }
}

export class ClearClart implements Action {
  public readonly type = CLEARCART;

  constructor(public payload?: any) { }
}

export class RemoveFromCart implements Action {
  public readonly type = REMOVEFROMCART;

  constructor(public payload: number) { }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = SetViewAction
  | SetUserIdAction
  | SetTypeAction
  | SetHeightAction
  | SetWidthAction
  | SetEmitterAction
  | SetSelectedAction
  | SetButtonAction
  | AddToCart
  | ClearClart
  | RemoveFromCart;
