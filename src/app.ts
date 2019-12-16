import 'module-alias/register';

import path from 'path';
import { BarkBarkApp } from '@barkbark/BarkBarkApp';
import { basicConfig } from '@barkbark/config';

const app: BarkBarkApp = new BarkBarkApp(basicConfig);
app.run();
