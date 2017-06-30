# Angular 2+ Slideshow

A high speed image gallery slideshow.

## Demo

ADD DEMO LINK

## Installation

`npm install ng-slideshow --save` or `yarn add ng-slideshow`

## Usage

On the module:

```javascript
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {SlideshowModule} from './slideshow/slideshow.module'; // IMPORT THE SLIDESHOW MODULE

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SlideshowModule, // IMPORT THE SLIDESHOW MODULE
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

```

On the component:

```javascript
import { Component } from '@angular/core';
import * as Immutable from 'immutable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  /**
   * A list of slideshow options
   *
   * @type {Map<string, any>}
   */
  options = Immutable.Map({
    showDots: true,
    height: 450,
    showThumbnails: true,
    thumbnailWidth: 150
  });

  /**
   * A list of images
   *
   * @type {Immutable.List<any>}
   */
  images = Immutable.List([
    {
      url: 'http://placekitten.com/800/500',
      title: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ' +
      'Lorem Ipsum has been the industrs standard dummy text ever since the 1500s, when an unknown printer ' +
      'took a galley of type and scrambled it to make a type specimen book.'
    },
    {url: 'http://placekitten.com/1200/500'},
    {url: 'http://placekitten.com/800/300', title: 'cat'},
    {url: 'http://placekitten.com/300/500', title: 'cat'},
    {url: 'http://placekitten.com/860/500', title: 'cat'},
    {url: 'http://placekitten.com/830/500', title: 'cat'},
    {url: 'http://placekitten.com/660/500', title: 'cat'},
    {url: 'http://placekitten.com/720/500', title: 'cat'},
    {url: 'http://placekitten.com/360/300', title: 'cat'},
    {url: 'http://placekitten.com/860/860', title: 'cat'},
    {url: 'http://placekitten.com/800/900', title: 'cat'},
    {url: 'http://placekitten.com/800/1200', title: 'cat'}
  ]);
}

```

On the template:

```html
<h1>Slideshow Demo</h1>
<section>
  <ng-slideshow [options]="options" [images]="images"></ng-slideshow>
</section>
```

On the stylesheet:

```css
section {
  width: 900px; 
  height: 450px;
}
```


## Development

Feel free to participate in the development of this project, any contribution is more than welcome.

If you take a look at the main root package file, you should see the development tasks needed to get you going.

I've also included, in the source, a demo app component, so you should be able to just run `npm start` to see it live, and see a demo of the slideshow.

## Running unit tests

Run `npm run tests-dev` to execute the unit tests via [Karma](https://karma-runner.github.io), or `npm run tests-ci` to execute the unit tests using a headless Chrome version. 

# License

MIT