import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SlideshowComponent} from './components/slideshow.component';
import {ActionReducer, combineReducers, StoreModule} from '@ngrx/store';
import 'hammerjs';
import {TruncateModule} from 'ng2-truncate/dist';
import {stateReducer} from './reducers/loading-state.reducer';
import {indexReducer} from './reducers/offset-state.reducer';

const reducers = {state: stateReducer, index: indexReducer};

const productionReducer: ActionReducer<any> = combineReducers(reducers);

export function reducer(state: any, action: any) {
  return productionReducer(state, action);
}

@NgModule({
  imports: [
    CommonModule,
    TruncateModule,
    StoreModule.provideStore(reducer)
  ],
  declarations: [SlideshowComponent],
  exports: [SlideshowComponent]
})
export class SlideshowModule {
}
