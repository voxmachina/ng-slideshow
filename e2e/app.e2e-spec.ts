import { NgSlideshowPage } from './app.po';

describe('ng-slideshow App', () => {
  let page: NgSlideshowPage;

  beforeEach(() => {
    page = new NgSlideshowPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
