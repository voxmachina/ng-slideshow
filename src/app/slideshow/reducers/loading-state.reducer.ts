import {Action} from '@ngrx/store';

/**
 * Slideshow states
 *
 * @type {string}
 */
export const LOADING = 'LOADING';
export const SLIDING = 'SLIDING';
export const READY = 'READY';

/**
 * State reducer
 *
 * @param state
 * @param action
 * @returns {string}
 */
export function stateReducer(state: string = 'LOADING', action: Action) {
  switch (action.type) {
    case LOADING:
      return LOADING;
    case SLIDING:
      return SLIDING;
    case READY:
      return READY;
    default:
      return state;
  }
}
