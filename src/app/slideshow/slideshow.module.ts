import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SlideshowComponent} from './slideshow.component';
import {StoreModule} from '@ngrx/store';
import {indexReducer, stateReducer} from './state.reducer';
import 'hammerjs';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.provideStore({state: stateReducer, index: indexReducer})
  ],
  declarations: [SlideshowComponent],
  exports: [SlideshowComponent]
})
export class SlideshowModule {
}
