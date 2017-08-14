import { browser, by, element } from 'protractor';

export class FriendlyNg4Page {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('fp-root h1')).getText();
  }
}
