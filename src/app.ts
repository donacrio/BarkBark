import 'module-alias/register';
import path from 'path';
import { BarkBarkApp } from '@barkbark/BarkBarkApp';

const FILEPATH = path.join(__dirname, '..', 'data', 'sample.csv');
const app: BarkBarkApp = new BarkBarkApp(FILEPATH);
app.run();
