import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SlideshowComponent} from './slideshow.component';
import {StoreModule} from '@ngrx/store';
import {stateReducer} from './state.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.provideStore({state: stateReducer})
  ],
  declarations: [SlideshowComponent],
  exports: [SlideshowComponent]
})
export class SlideshowModule {
}
