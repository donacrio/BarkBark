import 'module-alias/register';

import { BarkBarkApp } from '@barkbark/BarkBarkApp';
import { requestedConfig, testAlertingLogicConfig, noSimulationConfig } from '@barkbark/config';

const app: BarkBarkApp = new BarkBarkApp(requestedConfig);
app.run();
