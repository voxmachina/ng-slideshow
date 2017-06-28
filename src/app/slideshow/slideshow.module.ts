import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SlideshowComponent} from './components/slideshow.component';
import {StoreModule} from '@ngrx/store';
import 'hammerjs';
import {TruncateModule} from 'ng2-truncate/dist';
import {stateReducer} from './reducers/loading-state.reducer';
import {indexReducer} from './reducers/offset-state.reducer';

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
