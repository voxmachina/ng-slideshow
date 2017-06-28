import {ChangeDetectionStrategy, Component, ElementRef, Input, ViewEncapsulation} from '@angular/core';
import {Store} from '@ngrx/store';
import * as Immutable from 'immutable';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {AppState} from '../models/state.model';
import {DECREMENT, INCREMENT, READY, RESET, SLIDING} from '../reducers/state.reducer';
import {SWIPE_ACTION} from '../models/swipe-action.enum';

@Component({
  selector: 'ng-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
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
  @Input() options: Immutable.Map<any, any> = Immutable.Map();

  private offsetStateSubscription;
  private loadingStateSubscription;

  private offsetStatus;
  private loadingStatus;
  private thumbnailOffset = 0;

  /**
   * @constructor
   * @param domSanitizer
   * @param store
   * @param elementRef
   */
  constructor(
    private domSanitizer: DomSanitizer,
    private store: Store<AppState>,
    private elementRef: ElementRef
  ) {
    this.offsetStateSubscription = this.store.select('index');
    this.loadingStateSubscription = this.store.select('state');
    this.loadingStateSubscription.subscribe((appState) => this.loadingStatus = appState);
    this.offsetStateSubscription.subscribe((appState) => this.offsetStatus = appState);
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

    if (!previousElement || this.loadingStatus === SLIDING) {
      return;
    }

    this.loadingStateSubscription.dispatch({type: SLIDING});
    this.offsetStateSubscription.dispatch({type: DECREMENT});

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

    if (!nextElement || this.loadingStatus === SLIDING) {
      return;
    }

    this.loadingStateSubscription.dispatch({type: SLIDING});
    this.offsetStateSubscription.dispatch({type: INCREMENT});

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

    this.loadingStateSubscription.dispatch({type: READY});
  }

  /**
   * On swipe events
   *
   * @param action
   * @returns void
   */
  swipe(action = SWIPE_ACTION.RIGHT): void {
    if (action === SWIPE_ACTION.RIGHT) {
      this.showPrevious();
    } else if (action === SWIPE_ACTION.LEFT) {
      this.showNext();
    }
  }

  /**
   * Show an element given its index
   *
   * @param index
   * @returns void
   */
  showByIndex(index): void {
    const list = this.elementRef.nativeElement.querySelectorAll('li');
    const currentIndex: number = this.offsetStatus;

    for (let i = 0; i < index; i++) {
      list[i].classList.remove('right', 'active');
      list[i].classList.add('left');
    }

    for (let i = index + 1; i < list.length; i++) {
      list[i].classList.remove('left', 'active');
      list[i].classList.add('right');
    }

    if (index > currentIndex) {
      this.offsetStateSubscription.dispatch({type: RESET});
      for (let i = 0; i < index; i++) {
        this.offsetStateSubscription.dispatch({type: INCREMENT});
      }

      list[currentIndex].classList.add('active');
      list[index].classList.add('active', 'slide-in');
      list[currentIndex].classList.remove('active');
      list[currentIndex].classList.add('slide-out-left');
    } else {
      for (let i = currentIndex; i > index; i--) {
        this.offsetStateSubscription.dispatch({type: DECREMENT});
      }

      list[currentIndex].classList.add('active');
      list[index].classList.add('active', 'slide-in');
      list[currentIndex].classList.remove('active');
      list[currentIndex].classList.add('slide-out-right');
    }
  }

  moveThumbnailsRight(container: HTMLElement) {
    const parent = this.elementRef.nativeElement.querySelector('.thumbnails');
    const containerWidth =  container.offsetWidth;
    const children = container.querySelectorAll('li');
    const numElements = Math.ceil(containerWidth / this.options.get('thumbnailWidth'));
    const distance = (this.thumbnailOffset + 1) * numElements * this.options.get('thumbnailWidth');

    const curLeft = parseInt(container.getAttribute('data-left'), 10);
    const newLeft = (curLeft - distance) + 'px';
    const page = parseInt(container.getAttribute('data-page'), 10);
    const newPage = page + 1;
    const totalPages = Math.round(children.length / numElements);

    container.style.left = newLeft;
    container.setAttribute('data-left', newLeft);
    container.setAttribute('data-page', newPage + '');

    if (page > totalPages) {
      parent.classList.add('no-scroll-right');
    } else {
      parent.classList.remove('no-scroll-right');
    }

    if (newPage === 1) {
      parent.classList.add('no-scroll-left');
    } else {
      parent.classList.remove('no-scroll-left');
    }
  }

  moveThumbnailsLeft(container: HTMLElement) {
    const parent = this.elementRef.nativeElement.querySelector('.thumbnails');
    const containerWidth =  container.offsetWidth;
    const children = container.querySelectorAll('li');
    const numElements = Math.ceil(containerWidth / this.options.get('thumbnailWidth'));
    const distance = (this.thumbnailOffset + 1) * numElements * this.options.get('thumbnailWidth');

    const curLeft = parseInt(container.getAttribute('data-left'), 10);
    const newLeft = (curLeft + distance) + 'px';
    const page = parseInt(container.getAttribute('data-page'), 10);
    const newPage = page - 1;
    const totalPages = Math.round(children.length / numElements);

    container.style.left = newLeft;
    container.setAttribute('data-left', newLeft);
    container.setAttribute('data-page', newPage + '');

    if (newPage > totalPages) {
      parent.classList.add('no-scroll-right');
    } else {
      parent.classList.remove('no-scroll-right');
    }

    if (newPage === 1) {
      parent.classList.add('no-scroll-left');
    } else {
      parent.classList.remove('no-scroll-left');
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
