import 'module-alias/register';

import { BarkBarkApp } from '@barkbark/BarkBarkApp';
import { basicConfig } from '@barkbark/config';

const app: BarkBarkApp = new BarkBarkApp(basicConfig);
app.run();
