import path from 'path';
import { BarkBarkConfig, MetricName } from '@barkbark/lib';

export const requestedConfig: BarkBarkConfig = {
  simulation: {
    refreshTime: 99,
    running: true,
    logfile: path.join(__dirname, '..', 'data', 'logs.csv')
  },
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

export const noSimulationConfig: BarkBarkConfig = {
  simulation: {
    refreshTime: 10,
    running: false,
    logfile: path.join(__dirname, '..', 'data', 'logs.csv')
  },
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
