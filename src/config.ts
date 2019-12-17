import path from 'path';
import { BarkBarkConfig, MetricName, SimulationType } from '@barkbark/lib';

/**
 * Configuration described in the requirements of the project.
 *
 * Note that if you want to run the simulation forever, the refreshTime of the simulation
 * needs to be lower than the refreshTime of the parser.
 */
export const requestedConfig: BarkBarkConfig = {
  simulation: {
    type: SimulationType.RUNNING,
    refreshTime: 50,
    running: true,
    logfile: path.join(__dirname, '..', 'data', 'logs.csv')
  },
  parser: {
    refreshTime: 100,
    queueSize: 10000,
    logfile: path.join(__dirname, '..', 'data', 'sample.csv')
  },
  aggregatorManager: {
    refreshTime: 500,
    aggregators: [
      { metricName: MetricName.TRAFFIC, timeframe: 10 },
      { metricName: MetricName.SECTIONS, timeframe: 10 }
    ]
  },
  alertsManager: {
    refreshTime: 500,
    alerts: [{ aggregator: { metricName: MetricName.TRAFFIC, timeframe: 120 }, threshold: 10 }]
  },
  ui: {
    refreshTime: 1000
  }
};

/**
 * Configuration that will test the alerting logic,
 */
export const testAlertingLogicConfig: BarkBarkConfig = {
  simulation: {
    type: SimulationType.TEST,
    refreshTime: 10,
    running: true,
    logfile: path.join(__dirname, '..', 'data', 'test_alerting.csv')
  },
  parser: {
    refreshTime: 10,
    queueSize: 10000,
    logfile: path.join(__dirname, '..', 'data', 'test_alerting.csv')
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

/**
 * Configuration to run on a file that is not appended.
 *
 * The file is the one provided in the requirements.
 */
export const noSimulationConfig: BarkBarkConfig = {
  simulation: {
    type: SimulationType.STATIC,
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
