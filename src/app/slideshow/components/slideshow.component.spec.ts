import {SlideshowComponent} from './slideshow.component';
import {ComponentFixture, getTestBed, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {TruncateModule} from 'ng2-truncate';
import {StoreModule} from '@ngrx/store';
import {SLIDING, stateReducer} from '../reducers/loading-state.reducer';
import {indexReducer} from '../reducers/offset-state.reducer';
import * as Immutable from 'immutable';
import 'hammerjs';
import {NgZone} from '@angular/core';

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

    });


  });

});
