import {Component, ElementRef, Input} from '@angular/core';
import {Store} from '@ngrx/store';
import * as Immutable from 'immutable';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {AppState, IndexState} from './state.model';
import {DECREMENT, INCREMENT, READY, SLIDING} from './state.reducer';

@Component({
  selector: 'ng-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.scss']
})
export class SlideshowComponent {

  /**
   * The immutable list of images
   *
   *@type {Immutable.List<any>}
   */
  @Input() images: Immutable.List<any>;

  /**
   * Current slide index
   *
   * @type {IndexState}
   */
  public index: IndexState;

  /**
   * Slideshow application state
   *
   * @type {AppState}
   */
  private slideshowState: AppState;

  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };

  /**
   * @constructor
   * @param domSanitizer
   * @param state
   * @param indexState
   * @param elementRef
   */
  constructor(
    private domSanitizer: DomSanitizer,
    private state: Store<AppState>,
    private indexState: Store<IndexState>,
    private elementRef: ElementRef
  ) {
    this.state.subscribe((appState) => this.slideshowState = appState);
    this.indexState.subscribe((indexUpdate) => this.index = indexUpdate);
  }

  /**
   * Shows the previous element
   *
   * @param evt
   * @returns void
   */
  showPrevious(evt?) {
    if (evt) {
      evt.preventDefault();
    }

    const activeElement = this.elementRef.nativeElement.querySelector('li.active');
    const previousElement = activeElement.previousElementSibling;

    if (!previousElement || this.slideshowState.state === SLIDING) {
      return;
    }

    this.state.dispatch({ type: SLIDING});
    this.indexState.dispatch({ type: DECREMENT});

    activeElement.classList.remove('active');
    activeElement.classList.add('slide-out-right');

    previousElement.classList.add('active', 'slide-in');
  }

  /**
   * Shows the next element
   *
   * @param evt
   * @returns void
   */
  showNext(evt?) {
    if (evt) {
      evt.preventDefault();
    }

    const activeElement = this.elementRef.nativeElement.querySelector('li.active');
    const nextElement = activeElement.nextElementSibling;

    if (!nextElement || this.slideshowState.state === SLIDING) {
      return;
    }

    this.state.dispatch({ type: SLIDING});
    this.indexState.dispatch({ type: INCREMENT});

    activeElement.classList.remove('active');
    activeElement.classList.add('slide-out-left');

    nextElement.classList.add('active', 'slide-in');
  }

  /**
   * On the active element transition end event
   *
   * @param evt
   * @returns void
   */
  onActiveTransitionEnd(evt) {
    const target = evt.currentTarget;

    if (!target.classList.contains('active')) {
      return;
    }

    const activeElement = this.elementRef.nativeElement.querySelector('.active');
    const nextElement = activeElement.nextElementSibling;
    const previousElement = activeElement.previousElementSibling;

    activeElement.classList.remove('slide-in', 'left', 'right');

    if (previousElement) {
      previousElement.classList.add('left');
      previousElement.classList.remove('slide-in', 'right', 'slide-out-left', 'slide-out-right');
    }

    if (nextElement) {
      nextElement.classList.add('right');
      nextElement.classList.remove('slide-in', 'left', 'slide-out-left', 'slide-out-right');
    }

    this.state.dispatch({ type: READY});
  }

  swipe(action = this.SWIPE_ACTION.RIGHT) {
    if (action === this.SWIPE_ACTION.RIGHT) {
      this.showPrevious();
    } else if(action === this.SWIPE_ACTION.LEFT) {
      this.showNext();
    }
  }

  /**
   * Gets a protected safe url to use
   *
   * @param imageUrl
   * @returns {SafeStyle}
   */
  getSafeUrl(imageUrl: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustStyle(`url(${imageUrl})`);
  }
}
