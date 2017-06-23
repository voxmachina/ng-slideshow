import {Component, ElementRef, Input} from '@angular/core';
import {Store} from '@ngrx/store';
import * as Immutable from 'immutable';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {AppState} from './state.model';
import {READY, SLIDING} from './state.reducer';

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

  slideshowState: AppState;

  constructor(
    private domSanitizer: DomSanitizer,
    private state: Store<AppState>,
    private elementRef: ElementRef
  ) {
    this.state.subscribe((state) => {
      this.slideshowState = state;
      console.log("STATE", this.slideshowState);
    });
  }

  showPrevious(evt) {
    evt.preventDefault();

    const activeElement = this.elementRef.nativeElement.querySelector('li.active');
    const previousElement = activeElement.previousElementSibling;

    if (!previousElement || this.slideshowState.state === SLIDING) {
      return;
    }

    this.state.dispatch({ type: SLIDING});

    activeElement.classList.remove('active');
    activeElement.classList.add('slide-out-right');

    previousElement.classList.add('active', 'slide-in');
  }

  showNext(evt) {
    evt.preventDefault();

    const activeElement = this.elementRef.nativeElement.querySelector('li.active');
    const nextElement = activeElement.nextElementSibling;

    if (!nextElement || this.slideshowState.state === SLIDING) {
      return;
    }

    this.state.dispatch({ type: SLIDING});

    activeElement.classList.remove('active');
    activeElement.classList.add('slide-out-left');

    nextElement.classList.add('active', 'slide-in');
  }

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

  getSafeUrl(imageUrl: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustStyle(`url(${imageUrl})`);
  }
}
