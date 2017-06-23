import { Component } from '@angular/core';
import * as Immutable from 'immutable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  images = Immutable.List([
    {url: 'http://placekitten.com/800/500', title: 'cat'},
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
