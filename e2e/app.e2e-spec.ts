import { FriendlyNg4Page } from './app.po';

describe('friendly-ng4 App', () => {
  let page: FriendlyNg4Page;

  beforeEach(() => {
    page = new FriendlyNg4Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to fp!');
  });
});
