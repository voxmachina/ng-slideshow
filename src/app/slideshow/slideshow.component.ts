import {Component, ElementRef, Input} from '@angular/core';
import * as Immutable from 'immutable';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

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

  constructor(private domSanitizer: DomSanitizer, private elementRef: ElementRef) {
  }

  showPrevious(evt) {
    evt.preventDefault();
    const activeElement = this.elementRef.nativeElement.querySelector('li.active');
    const previousElement = activeElement.previousSibling;

    activeElement.classList.remove('active');
    activeElement.classList.add('slide-out-right');

    previousElement.classList.add('active');
    previousElement.classList.add('slide-in');
  }

  showNext(evt) {
    evt.preventDefault();
    const activeElement = this.elementRef.nativeElement.querySelector('li.active');
    const nextElement = activeElement.nextSibling;

    activeElement.classList.remove('active');
    activeElement.classList.add('slide-out-left');

    nextElement.classList.add('active');
    nextElement.classList.add('slide-in');
  }

  transitionEnd(evt) {
    evt.preventDefault();
    const activeElement = this.elementRef.nativeElement.querySelector('li.active');
    const nextElement = activeElement.nextSibling;
    const previousElement = activeElement.previousSibling;

    if (previousElement && previousElement.style) {
      previousElement.style.left = '-100%';
    }

    activeElement.classList.remove('slide-in');
    nextElement.classList.remove('slide-in');
    nextElement.classList.remove('slide-out-left');
    nextElement.classList.remove('slide-out-right');
    previousElement.classList.remove('slide-in');
    previousElement.classList.remove('slide-out-left');
    previousElement.classList.remove('slide-out-right');
  }

  getSafeDistance(value: number) {
    return this.domSanitizer.bypassSecurityTrustStyle(`${value}%`);
  }

  getSafeUrl(imageUrl: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustStyle(`url(${imageUrl})`);
  }
}
