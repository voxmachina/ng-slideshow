import {SlideshowComponent} from './slideshow.component';
import {ComponentFixture, getTestBed, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {TruncateModule} from 'ng2-truncate';
import {StoreModule} from '@ngrx/store';
import {READY, SLIDING, stateReducer} from '../reducers/loading-state.reducer';
import {INCREMENT, indexReducer, RESET} from '../reducers/offset-state.reducer';
import * as Immutable from 'immutable';
import 'hammerjs';
import {NgZone} from '@angular/core';
import {SLIDE_DIRECTION} from '../enums/slide-direction.enum';
import {EVENT} from '../enums/slideshow-event.enum';
import {DOM_CLASSES} from '../enums/dom-classes.enum';
import {SWIPE_ACTION} from '../enums/swipe-action.enum';

const getDebugSlideList = function(howMany = 3, activeIndex = 0) {
  const debugList = document.createDocumentFragment();
  const list = document.createElement('ul');
  let li: HTMLElement;

  for (let i = 0; i < howMany; i++) {
    li = document.createElement('li');

    if (i === activeIndex) {
      li.className = 'active';
      li.id = 'slide-' + i;
    }

    list.appendChild(li);
  }

  debugList.appendChild(list);

  return debugList;
};

const getThumbnailList = function(howMany = 3, activeIndex = 0, left = 0, page = 1) {
  const debugList = document.createDocumentFragment();
  const container = document.createElement('div');
  container.className = 'thumbnails';
  const list = document.createElement('ul');
  let li: HTMLElement;
  const maskElement = document.createElement('div');
  maskElement.classList.add('gradient-mask');

  for (let i = 0; i < howMany; i++) {
    li = document.createElement('li');

    if (i === activeIndex) {
      li.className = 'active';
      li.id = 'thumbnail-' + i;
    }

    list.appendChild(li);
  }

  list.setAttribute('data-left', '' + left);
  list.setAttribute('data-page', '' + page);

  container.appendChild(list);
  container.appendChild(maskElement);
  debugList.appendChild(container);

  return debugList;
};

describe('SlideshowComponent', () => {

  let component: SlideshowComponent;
  let fixture: ComponentFixture<SlideshowComponent>;
  let zone: NgZone;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TruncateModule,
        StoreModule.provideStore({state: stateReducer, index: indexReducer})
      ],
      declarations: [SlideshowComponent]
    });

    fixture = TestBed.createComponent(SlideshowComponent);
    component = fixture.componentInstance;
    zone = getTestBed().get(NgZone);
  });

  describe('Component', () => {

    it('it should implement AfterViewChecked', () => {
      const spy = spyOn(component, 'ngAfterViewChecked').and.returnValue('');
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });

  });

  describe('Inputs', () => {

    it('it should accept an immutable list as the source for the images', () => {
      component.images = Immutable.List([]);
      expect(component.images.count()).toBe(0);
    });

    it('it should accept an immutable map as the options for the slideshow', () => {
      component.options = Immutable.Map({dummy: 0});
      expect(component.options.get('dummy')).toBe(0);
    });

  });

  describe('Methods', () => {

    describe('ngAfterViewChecked', () => {

      it('it should initialize the thumbnail container if that option is active', () => {
        const spy = spyOn(component, 'initializeThumbnailContainer').and.returnValue('');
        component.options = Immutable.Map({
          'showThumbnails': true
        });
        fixture.detectChanges();
        expect(spy).toHaveBeenCalled();
      });

      it('it should not initialize the thumbnail container if that option is not active', () => {
        const spy = spyOn(component, 'initializeThumbnailContainer').and.returnValue('');
        component.options = Immutable.Map({
          'showThumbnails': false
        });
        fixture.detectChanges();
        expect(spy).not.toHaveBeenCalled();
      });

    });

    describe('moveSlide', () => {

      it('it should prevent default action in case event is available', () => {
        const spyZone = spyOn(zone, 'runOutsideAngular').and.returnValue('');
        const event = new Event('click');
        const spyEvent = spyOn(event, 'preventDefault').and.returnValue('');
        component.moveSlide('', event);
        expect(spyEvent).toHaveBeenCalled();
      });

      it('it should perform the slide action outside of the angular zone', () => {
        const spyZone = spyOn(zone, 'runOutsideAngular').and.returnValue('');
        component.moveSlide('');
        expect(spyZone).toHaveBeenCalled();
      });

      it('it should not change status if current status is sliding', () => {
        const spyState = spyOn(component.loadingStateSubscription, 'dispatch').and.returnValue('');
        fixture.debugElement.nativeElement.appendChild(getDebugSlideList());
        component.loadingStatus = SLIDING;
        component.moveSlide('');

        expect(spyState).not.toHaveBeenCalled();
      });

      it('it should throw an error when there is not an active element', () => {
        fixture.debugElement.nativeElement.appendChild(getDebugSlideList(3, -1));
        expect(() => component.moveSlide('')).toThrowError();
      });

      it('it should not slide if current status is on sliding', () => {
        fixture.debugElement.nativeElement.appendChild(getDebugSlideList(3, 2));
        component.loadingStatus = SLIDING;
        const activeElement = fixture.debugElement.nativeElement.querySelector('li.active');

        component.moveSlide('');

        const newActiveElement = fixture.debugElement.nativeElement.querySelector('li.active');
        expect(activeElement.id).toBe(newActiveElement.id);
      });

      it('it should not slide if active element does not have any siblings', () => {
        fixture.debugElement.nativeElement.appendChild(getDebugSlideList(3, 2));
        component.loadingStatus = SLIDING;
        const activeElement = fixture.debugElement.nativeElement.querySelector('li.active');

        component.moveSlide('');

        const newActiveElement = fixture.debugElement.nativeElement.querySelector('li.active');
        expect(activeElement.id).toBe(newActiveElement.id);
      });

      it('it should slide to next slide when direction is set to be next', () => {
        fixture.debugElement.nativeElement.appendChild(getDebugSlideList(3, 0));
        const activeElement = fixture.debugElement.nativeElement.querySelector('li.active');
        const nextElement = activeElement.nextElementSibling;

        component.moveSlide(SLIDE_DIRECTION.NEXT);

        expect(activeElement.id).not.toBe(nextElement.id);
      });

      it('it should slide to previous slide when direction is set to be previous', () => {
        fixture.debugElement.nativeElement.appendChild(getDebugSlideList(3, 2));
        const activeElement = fixture.debugElement.nativeElement.querySelector('li.active');
        const previousElement = activeElement.previousElementSibling;

        component.moveSlide(SLIDE_DIRECTION.PREVIOUS);

        expect(activeElement.id).not.toBe(previousElement.id);
      });

      it('it should set slideshow status to SLIDING', () => {
        fixture.debugElement.nativeElement.appendChild(getDebugSlideList(3, 2));
        component.moveSlide(SLIDE_DIRECTION.PREVIOUS);

        expect(component.loadingStatus).toBe(SLIDING);
      });

      it('it should increment offset when direction is set to be next', () => {
        fixture.debugElement.nativeElement.appendChild(getDebugSlideList(3, 0));
        const currentOffset = component.offsetStatus;
        component.moveSlide(SLIDE_DIRECTION.NEXT);

        expect(component.offsetStatus).toBe(currentOffset + 1);
      });

      it('it should decrement offset when direction is set to be previous', () => {
        fixture.debugElement.nativeElement.appendChild(getDebugSlideList(3, 2));
        const currentOffset = component.offsetStatus;
        component.moveSlide(SLIDE_DIRECTION.PREVIOUS);

        expect(component.offsetStatus).toBe(currentOffset - 1);
      });

      it('it should emit a next status event when direction is set to be next', () => {
        const spy = spyOn(component.eventDispatcher, 'emit').and.returnValue('');
        fixture.debugElement.nativeElement.appendChild(getDebugSlideList(3, 0));

        component.moveSlide(SLIDE_DIRECTION.NEXT);

        const res = spy.calls.allArgs().filter((args) => args[0] && args[0].label && args[0].label === EVENT.SLIDE_NEXT);

        expect(res.length).toBeGreaterThan(0);
      });

      it('it should emit a previous status event when direction is set to be previous', () => {
        const spy = spyOn(component.eventDispatcher, 'emit').and.returnValue('');
        fixture.debugElement.nativeElement.appendChild(getDebugSlideList(3, 2));
        component.moveSlide(SLIDE_DIRECTION.PREVIOUS);

        const res = spy.calls.allArgs().filter((args) => args[0] && args[0].label && args[0].label === EVENT.SLIDE_PREVIOUS);

        expect(res.length).toBeGreaterThan(0);
      });

    });

    describe('onActiveTransitionEnd', () => {

      it('it should clear active element outside of the angular zone', () => {
        fixture.debugElement.nativeElement.appendChild(getDebugSlideList(3, 0));
        const activeElement = fixture.debugElement.nativeElement.querySelector('li.' + DOM_CLASSES.ACTIVE);
        activeElement.classList.add(DOM_CLASSES.LEFT);
        const spyZone = spyOn(zone, 'runOutsideAngular').and.callThrough();
        const event = new Event('click');

        component.onActiveTransitionEnd(event);

        expect(spyZone).toHaveBeenCalled();
        expect(activeElement.classList.contains(DOM_CLASSES.LEFT)).toBeFalsy();
      });

      it('it should clear next element if exists one', () => {
        fixture.debugElement.nativeElement.appendChild(getDebugSlideList(3, 0));
        const activeElement = fixture.debugElement.nativeElement.querySelector('li.' + DOM_CLASSES.ACTIVE).nextElementSibling;
        activeElement.classList.add(DOM_CLASSES.LEFT);
        const spyZone = spyOn(zone, 'runOutsideAngular').and.callThrough();
        const event = new Event('click');

        component.onActiveTransitionEnd(event);

        expect(spyZone).toHaveBeenCalled();
        expect(activeElement.classList.contains(DOM_CLASSES.LEFT)).toBeFalsy();
      });

      it('it should clear previous element if exists one', () => {
        fixture.debugElement.nativeElement.appendChild(getDebugSlideList(3, 2));
        const activeElement = fixture.debugElement.nativeElement.querySelector('li.' + DOM_CLASSES.ACTIVE).previousElementSibling;
        activeElement.classList.add(DOM_CLASSES.RIGHT);
        const spyZone = spyOn(zone, 'runOutsideAngular').and.callThrough();
        const event = new Event('click');

        component.onActiveTransitionEnd(event);

        expect(spyZone).toHaveBeenCalled();
        expect(activeElement.classList.contains(DOM_CLASSES.RIGHT)).toBeFalsy();
      });

      it('it should emit a transition complete event on complete', () => {
        const spy = spyOn(component.eventDispatcher, 'emit').and.returnValue('');
        fixture.debugElement.nativeElement.appendChild(getDebugSlideList(3, 2));
        const event = new Event('click');

        component.onActiveTransitionEnd(event);

        const res = spy.calls.allArgs().filter((args) => args[0] && args[0].label && args[0].label === EVENT.ACTIVE_TRANSITION_COMPLETE);

        expect(res.length).toBeGreaterThan(0);
      });

      it('it should set loading state to ready on complete', () => {
        fixture.debugElement.nativeElement.appendChild(getDebugSlideList(3, 2));
        const event = new Event('click');
        component.onActiveTransitionEnd(event);
        expect(component.loadingStatus).toBe(READY);
      });

      it('it should throw an error when there is not an active element', () => {
        fixture.debugElement.nativeElement.appendChild(getDebugSlideList(3, -1));
        const event = new Event('click');
        expect(() => component.onActiveTransitionEnd(event)).toThrowError();
      });

    });

    describe('swipe', () => {

      it('it should move to previous slide when swipe is to right', () => {
        const spy = spyOn(component, 'moveSlide').and.returnValue('');
        component.swipe(SWIPE_ACTION.RIGHT);
        const res = spy.calls.allArgs().filter((args) => args[0] && args[0] === SLIDE_DIRECTION.PREVIOUS);
        expect(res.length).toBeGreaterThan(0);
      });

      it('it should move to next slide when swipe is to left', () => {
        const spy = spyOn(component, 'moveSlide').and.returnValue('');
        component.swipe(SWIPE_ACTION.LEFT);
        const res = spy.calls.allArgs().filter((args) => args[0] && args[0] === SLIDE_DIRECTION.NEXT);
        expect(res.length).toBeGreaterThan(0);
      });

      it('it should emit a swipe next event when swipe is to left', () => {
        const spy = spyOn(component.eventDispatcher, 'emit').and.returnValue('');
        fixture.debugElement.nativeElement.appendChild(getDebugSlideList(3, 2));
        component.swipe(SWIPE_ACTION.LEFT);

        const res = spy.calls.allArgs().filter((args) => args[0] && args[0].label && args[0].label === EVENT.SWIPE_NEXT);

        expect(res.length).toBeGreaterThan(0);
      });

      it('it should emit a swipe previous event when swipe is to right', () => {
        const spy = spyOn(component.eventDispatcher, 'emit').and.returnValue('');
        fixture.debugElement.nativeElement.appendChild(getDebugSlideList(3, 2));
        component.swipe(SWIPE_ACTION.RIGHT);

        const res = spy.calls.allArgs().filter((args) => args[0] && args[0].label && args[0].label === EVENT.SWIPE_PREVIOUS);

        expect(res.length).toBeGreaterThan(0);
      });

    });

    describe('getDomElement', () => {

      it('it should search for a cached version of the element', () => {
        const spy = spyOn(component.domElements, 'filter').and.returnValue('');
        component.getDomElement('.active');
        expect(spy).toHaveBeenCalled();
      });

      it('it should return the element when its on the cache', () => {
        fixture.debugElement.nativeElement.appendChild(getDebugSlideList(3, 2));
        const spy = spyOn(component.domElements, 'push').and.callThrough();
        component.getDomElement('.active');
        component.getDomElement('.active');
        expect(spy.calls.count()).toBe(1);
      });

    });

    describe('showByIndex', () => {

      it('it should show an element given its index outside of the angular zone', () => {
        fixture.debugElement.nativeElement.appendChild(getDebugSlideList(3, 0));
        const list =  fixture.debugElement.nativeElement.querySelectorAll('li');
        const spyZone = spyOn(zone, 'runOutsideAngular').and.callThrough();

        component.showByIndex(2);

        expect(spyZone).toHaveBeenCalled();
        expect(list[2].classList.contains(DOM_CLASSES.ACTIVE)).toBeTruthy();
      });

      it('it should move all elements previous to the active-to-be to the left', () => {
        fixture.debugElement.nativeElement.appendChild(getDebugSlideList(3, 0));
        const list =  fixture.debugElement.nativeElement.querySelectorAll('li');

        component.showByIndex(2);

        expect(list[0].classList.contains(DOM_CLASSES.LEFT)).toBeTruthy();
        expect(list[1].classList.contains(DOM_CLASSES.LEFT)).toBeTruthy();
        expect(list[2].classList.contains(DOM_CLASSES.LEFT)).toBeFalsy();
      });

      it('it should move all elements next to the active-to-be to the right', () => {
        fixture.debugElement.nativeElement.appendChild(getDebugSlideList(3, 2));
        const list =  fixture.debugElement.nativeElement.querySelectorAll('li');

        component.showByIndex(0);

        expect(list[0].classList.contains(DOM_CLASSES.RIGHT)).toBeFalsy();
        expect(list[1].classList.contains(DOM_CLASSES.RIGHT)).toBeTruthy();
        expect(list[2].classList.contains(DOM_CLASSES.RIGHT)).toBeTruthy();
      });

      it('it should reset offset state when index is bigger than current index', () => {
        const spy = spyOn(component.offsetStateSubscription, 'dispatch').and.returnValue('');
        fixture.debugElement.nativeElement.appendChild(getDebugSlideList(3, 0));

        component.showByIndex(1);

        const res = spy.calls.allArgs().filter((args) => args[0] && args[0].type && args[0].type === RESET);
        expect(res.length).toBeGreaterThan(0);
      });

      it('it should increment offset state as many as many left elements occur', () => {
        fixture.debugElement.nativeElement.appendChild(getDebugSlideList(6, 1));
        component.showByIndex(4);
        expect(component.offsetStatus).toBe(4);
      });

      it('it should decrement offset state as many as many right elements occur', () => {
        fixture.debugElement.nativeElement.appendChild(getDebugSlideList(6, 5));
        component.showByIndex(3);
        expect(component.offsetStatus).toBe(3);
      });

      it('it should replace active element', () => {
        fixture.debugElement.nativeElement.appendChild(getDebugSlideList(6, 3));
        const list =  fixture.debugElement.nativeElement.querySelectorAll('li');

        component.showByIndex(4);

        expect(list[2].classList.contains(DOM_CLASSES.ACTIVE)).toBeFalsy();
        expect(list[4].classList.contains(DOM_CLASSES.ACTIVE)).toBeTruthy();

        component.showByIndex(1);

        expect(list[4].classList.contains(DOM_CLASSES.ACTIVE)).toBeFalsy();
        expect(list[2].classList.contains(DOM_CLASSES.ACTIVE)).toBeFalsy();
        expect(list[1].classList.contains(DOM_CLASSES.ACTIVE)).toBeTruthy();
      });

      it('it should emit a slide in by index event', () => {
        fixture.debugElement.nativeElement.appendChild(getDebugSlideList(6, 3));
        const spy = spyOn(component.eventDispatcher, 'emit').and.returnValue('');

        component.showByIndex(4);

        const res = spy.calls.allArgs().filter((args) => args[0] && args[0].label && args[0].label === EVENT.SLIDE_IN_BY_INDEX);

        expect(res.length).toBeGreaterThan(0);
      });

    });

    describe('initializeThumbnailContainer', () => {

      it('it should throw an error when thumbnailWidth is not defined or is not a number', () => {
        expect(() => component.initializeThumbnailContainer()).toThrowError();
      });

      it('it should allow right scrolling when there more elements that fit the container', () => {
        fixture.debugElement.nativeElement.appendChild(getThumbnailList(6, 3));
        component.options = Immutable.Map({
          'showThumbnails': true,
          'thumbnailWidth': 2000000
        });
        component.images = Immutable.List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        const parent = fixture.debugElement.nativeElement.querySelector('.thumbnails');

        component.initializeThumbnailContainer();

        expect(parent.classList.contains(DOM_CLASSES.NO_SCROLL_RIGHT)).toBeFalsy();
      });

      it('it should not allow right scrolling when there equal or less elements that fit the container', () => {
        fixture.debugElement.nativeElement.appendChild(getThumbnailList(1, 3));
        component.options = Immutable.Map({
          'showThumbnails': true,
          'thumbnailWidth': 1
        });
        component.images = Immutable.List([]);
        const parent = fixture.debugElement.nativeElement.querySelector('.thumbnails');

        component.initializeThumbnailContainer();

        expect(parent.classList.contains(DOM_CLASSES.NO_SCROLL_RIGHT)).toBeTruthy();
      });

    });


    describe('moveThumbnailsRight', () => {

      it('it should move thumbnails outside of the Angular zone', () => {
        const spyZone = spyOn(zone, 'runOutsideAngular').and.callThrough();
        fixture.debugElement.nativeElement.appendChild(getThumbnailList(15, 3));
        component.options = Immutable.Map({
          'showThumbnails': true,
          'thumbnailWidth': 20000000000
        });
        component.images = Immutable.List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        const container = fixture.debugElement.nativeElement.querySelector('.thumbnails ul');
        container.style.left = '-100px';

        component.moveThumbnailsRight(container);

        expect(spyZone).toHaveBeenCalled();
        expect(parseInt(container.style.left, 10) > -100).toBeTruthy();
      });

      it('it should increase page number', () => {
        fixture.debugElement.nativeElement.appendChild(getThumbnailList(15, 3));
        component.options = Immutable.Map({
          'showThumbnails': true,
          'thumbnailWidth': 20000000000
        });
        component.images = Immutable.List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        const container = fixture.debugElement.nativeElement.querySelector('.thumbnails ul');
        container.style.left = '-100px';

        component.moveThumbnailsRight(container);

        expect(parseInt(container.getAttribute('data-page'), 10)).toBe(2);
      });

    });

    describe('moveThumbnailsLeft', () => {

      it('it should move thumbnails outside of the Angular zone', () => {
        const spyZone = spyOn(zone, 'runOutsideAngular').and.callThrough();
        fixture.debugElement.nativeElement.appendChild(getThumbnailList(15, 3, -100, 3));
        component.options = Immutable.Map({
          'showThumbnails': true,
          'thumbnailWidth': 20000000000
        });
        component.images = Immutable.List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        const container = fixture.debugElement.nativeElement.querySelector('.thumbnails ul');
        container.style.left = '0';

        component.moveThumbnailsLeft(container);

        expect(spyZone).toHaveBeenCalled();
        expect(parseInt(container.style.left, 10) < 0).toBeTruthy();
      });

      it('it should decrease page number', () => {
        fixture.debugElement.nativeElement.appendChild(getThumbnailList(15, 3, -100, 4));
        component.options = Immutable.Map({
          'showThumbnails': true,
          'thumbnailWidth': 20000000000
        });
        component.images = Immutable.List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        const container = fixture.debugElement.nativeElement.querySelector('.thumbnails ul');
        container.style.left = '0';

        component.moveThumbnailsLeft(container);

        expect(parseInt(container.getAttribute('data-page'), 10)).toBe(3);
      });

    });


  });

});
