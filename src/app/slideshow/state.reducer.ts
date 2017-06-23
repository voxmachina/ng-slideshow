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
