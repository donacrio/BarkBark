import { BarkBarkApp } from '@barkbark/BarkBarkApp';
import { basicConfig } from '@barkbark/config';

describe('Test BarkBark.ts', () => {
  let app: BarkBarkApp;
  beforeEach(() => {
    app = new BarkBarkApp(basicConfig);
  });

  it('should run for a few seconds without error', () => {
    app.run();
    setTimeout(() => {
      app.stop();
    }, 5000);
  });
});
