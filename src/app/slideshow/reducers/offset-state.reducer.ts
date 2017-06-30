import {Action} from '@ngrx/store';

/**
 * Slideshow index state
 *
 * @type {string}
 */
export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const RESET = 'RESET';

/**
 * State reducer
 *
 * @param state
 * @param action
 * @returns {string}
 */
export function indexReducer(state: number = 0, action: Action) {
  switch (action.type) {
    case INCREMENT:
      return state + 1;
    case DECREMENT:
      return state - 1;
    case RESET:
      return 0;
    default:
      return state;
  }
}
