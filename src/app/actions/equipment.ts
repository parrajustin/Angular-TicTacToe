import { Action } from '@ngrx/store';

export const LOAD =   '[equipment] Load';
export const HASH =   '[equipment] Set Hash';

export class LoadAction implements Action {
  public readonly type = LOAD;

  constructor(public payload: any[]) { }
}

export class SetHashAction implements Action {
  public readonly type = HASH;

  constructor(public payload: string) { }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = LoadAction
  | SetHashAction;
