import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SlideshowComponent} from './components/slideshow.component';
import {StoreModule} from '@ngrx/store';
import {indexReducer, stateReducer} from './reducers/state.reducer';
import 'hammerjs';
import {TruncateModule} from 'ng2-truncate';

@NgModule({
  imports: [
    CommonModule,
    TruncateModule,
    StoreModule.provideStore({state: stateReducer, index: indexReducer})
  ],
  declarations: [SlideshowComponent],
  exports: [SlideshowComponent]
})
export class SlideshowModule {
}
