import path from 'path';
import { BarkBarkConfig, MetricName } from '@barkbark/lib';

export const basicConfig: BarkBarkConfig = {
  parser: {
    refreshTime: 10,
    queueSize: 10000,
    logfile: path.join(__dirname, '..', 'data', 'sample.csv')
  },
  aggregatorManager: {
    refreshTime: 100,
    aggregators: [
      { metricName: MetricName.TRAFFIC, timeframe: 10 },
      { metricName: MetricName.SECTIONS, timeframe: 10 }
    ]
  },
  alertsManager: {
    refreshTime: 100,
    alerts: [
      { aggregator: { metricName: MetricName.TRAFFIC, timeframe: 30 }, threshold: 7 },
      { aggregator: { metricName: MetricName.SECTIONS, timeframe: 30 }, threshold: 5 }
    ]
  },
  ui: {
    refreshTime: 1000
  }
};

export const requestedConfig: BarkBarkConfig = {
  parser: {
    refreshTime: 10,
    queueSize: 10000,
    logfile: path.join(__dirname, '..', 'data', 'sample.csv')
  },
  aggregatorManager: {
    refreshTime: 100,
    aggregators: [
      { metricName: MetricName.TRAFFIC, timeframe: 10 },
      { metricName: MetricName.SECTIONS, timeframe: 10 }
    ]
  },
  alertsManager: {
    refreshTime: 100,
    alerts: [{ aggregator: { metricName: MetricName.TRAFFIC, timeframe: 120 }, threshold: 10 }]
  },
  ui: {
    refreshTime: 1000
  }
};

export const testConfig: BarkBarkConfig = {
  parser: {
    refreshTime: 1,
    queueSize: 1000,
    logfile: path.join(__dirname, '..', 'data', 'sample.csv')
  },
  aggregatorManager: {
    refreshTime: 10,
    aggregators: [
      { metricName: MetricName.TRAFFIC, timeframe: 1 },
      { metricName: MetricName.SECTIONS, timeframe: 1 }
    ]
  },
  alertsManager: {
    refreshTime: 10,
    alerts: [{ aggregator: { metricName: MetricName.TRAFFIC, timeframe: 12 }, threshold: 8 }]
  },
  ui: {
    refreshTime: 100
  }
};
