import {Component, ElementRef, Input} from '@angular/core';
import {Store} from '@ngrx/store';
import * as Immutable from 'immutable';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {AppState, IndexState} from './state.model';
import {DECREMENT, INCREMENT, READY, RESET, SLIDING} from './state.reducer';

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
   * Configurable options for the slideshow
   *
   * @type {Immutable.List<any>}
   */
  @Input() options:  Immutable.Map<any, any> = Immutable.Map();

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

    activeElement.classList.remove('slide-in', 'left', 'right', 'slide-out-left', 'slide-out-right');

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

  /**
   * On swipe events
   *
   * @param action
   * @returns void
   */
  swipe(action = this.SWIPE_ACTION.RIGHT): void {
    if (action === this.SWIPE_ACTION.RIGHT) {
      this.showPrevious();
    } else if (action === this.SWIPE_ACTION.LEFT) {
      this.showNext();
    }
  }

  showByIndex(index) {
    const list = this.elementRef.nativeElement.querySelectorAll('li');
    const currentIndex: number = this.index['index'];

    for (let i = 0; i < index; i++) {
      console.log(list[i]);
      list[i].classList.remove('right', 'active');
      list[i].classList.add('left');
    }

    for (let i = index + 1; i < list.length; i++) {
      list[i].classList.remove('left', 'active');
      list[i].classList.add('right');
    }

    if (index > currentIndex) {
      this.indexState.dispatch({ type: RESET});
      for (let i = 0; i < index; i++) {
        this.indexState.dispatch({type: INCREMENT});
      }

      list[currentIndex].classList.add('active');
      list[index].classList.add('active', 'slide-in');
      list[currentIndex].classList.remove('active');
      list[currentIndex].classList.add('slide-out-left');
    } else {
      for (let i = currentIndex; i > index; i--) {
        this.indexState.dispatch({type: DECREMENT});
      }

      list[currentIndex].classList.add('active');
      list[index].classList.add('active', 'slide-in');
      list[currentIndex].classList.remove('active');
      list[currentIndex].classList.add('slide-out-right');
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
