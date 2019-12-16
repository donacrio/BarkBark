import path from 'path';
import { BarkBarkConfig, AggregatorName } from '@barkbark/lib';

export const basicConfig: BarkBarkConfig = {
  parser: {
    refreshTime: 10,
    queueSize: 10000,
    logfile: path.join(__dirname, '..', 'data', 'sample.csv')
  },
  aggregatorManager: {
    refreshTime: 100,
    aggregators: [
      { name: AggregatorName.TRAFFIC, timeframe: 10 },
      { name: AggregatorName.SECTIONS, timeframe: 10 }
    ]
  },
  alertsManager: {
    refreshTime: 100,
    alerts: [{ aggregator: { name: AggregatorName.TRAFFIC, timeframe: 120 }, threshold: 8 }]
  },
  ui: {
    refreshTime: 1000
  }
};
