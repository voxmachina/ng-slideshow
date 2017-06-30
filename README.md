# Angular 2+ Slideshow

A high speed, fluid and consistent image gallery slideshow target for both desktop and mobile.

!['Screenshot'](https://raw.githubusercontent.com/voxmachina/ng-slideshow/master/docs/images/screenshot.jpg)

There are a lot of slideshow components available on the web, although none of them matched completely my needs and requirements; so I've decided to create one. I needed a fast slideshow that doesn't block anything else occurring in the page, that uses Immutable objects as inputs and only relies on native browser support for animations and that allows for swiping on mobile.

On top of that, I wanted a slideshow that takes its size from the parent container, so I can easily manipulate it to have a real proper slideshow for different viewports.

**Features**:

- Uses [Immutable](https://facebook.github.io/immutable-js/) objects as inputs thus optimizing Angular change detection mechanism
- All animations are purely CSS based
- Supports swipe events for touch devices
- All animations and slide events occur outside of the Angular zone, thus increasing FPS values
- All functionality is covered with unit tests
- Uses images as background images, meaning that the viewport is always the same size for all images
- By using images as background images it allows the slideshow to grown dynamically according to its parent container
- Only needs to have a defined height, width can be automatically calculated from the parent container
- Optionally, a list of thumbnails can be displayed below the main slide for extended navigation
- Optionally, a dot navigation style is also provided

## Demo

http://ng-slideshow.igeni.us/

## Docs

https://voxmachina.github.io/ng-slideshow/

## Requirements

[Angular 2+](https://angular.io/)

[NPM](https://www.npmjs.com/get-npm)

[NodeJS](https://nodejs.org)

## Installation

`npm install ng-slideshow --save`

## Usage

Import `SlideshowModule` on your app module:

```javascript
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {SlideshowModule} from 'ng-slideshow'; // IMPORT THE SLIDESHOW MODULE

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

On the component specify a list of options and a list of images to display:

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
    showDots: true,         // Shows a dot navigation component
    height: 450,            // The initial slideshow height
    showThumbnails: true,   // Optionally include thumbnails a navigation option
    thumbnailWidth: 150     // Thumbnail individual width for the thumbnail navigation component
  });

  /**
   * A list of images, title is optional, it will be displayed when it's available
   *
   * All images should have a url and a title parameter, if you don't
   * receive the content like this from the server you can always work out something like:
   *
   * datasetFromServer.map((imageData) => {
   *   imageData.url = imageData.serverUrl;
   *   imageData.title = imageData.serverTitle;
   * });
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

On the template include the component:

```html
<h1>Slideshow Demo</h1>
<section>
  <ng-slideshow [options]="options" [images]="images"></ng-slideshow>
</section>
```

On the stylesheet you'll need to define at least the height of your container, width is optional and when not defined it will take 100% and scale accordingly:

```css
section {
  width: 900px; 
  height: 450px;
}
```

## Slideshow Options

- `height`: The slideshow needs a defined initial height to be displayed

- `showThumbnails`: Either or not to display the thumbnail navigation
- `thumbnailWidth`: When using the thumbnail navigation, the thumbnail width must be defined
- `showDots`: Either or not to show the dots navigation component

## Development

Feel free to participate in the development of this project, any contribution is more than welcome.

If you take a look at the main root package file, you should see the development tasks needed to get you going.

I've also included, in the source, a demo app component, so you should be able to just run `npm start` to see it live, and see a demo of the slideshow.

## Running unit tests

Run `npm run tests-dev` to execute the unit tests via [Karma](https://karma-runner.github.io), or `npm run tests-ci` to execute the unit tests using a headless Chrome version. 

# License

MIT
