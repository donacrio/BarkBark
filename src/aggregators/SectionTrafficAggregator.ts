import { LogQueue } from '@barkbark/parser/LogQueue';
import { Log, SectionTrafficMetricValue, TrafficMetricValue, Metric, MetricName, MetricUnit } from '@barkbark/lib';

import { Aggregator } from './Aggregator';

/** Regular expression used to extract the section from a log request */
const REGEX_PATTERN = /^(?<method>\S*) (?<url>\S*) (?<protocol>\S*)$/g;

/**
 * Section traffic aggregator computing the traffic per section
 */
export class SectionTrafficAggregator extends Aggregator {
  /** Map mapping a section name with its traffic */
  private _metricValue: SectionTrafficMetricValue;

  constructor(logQueue: LogQueue, timeframe: number) {
    super(MetricName.SECTIONS, logQueue, timeframe, MetricUnit.HIT_PER_SEC);
    this._metricValue = new Map();
  }

  /**
   * Compute the traffic per section for every section
   *
   * @see Aggregator#compute
   */
  compute = (): void => {
    // We get the logs from the queue, over the aggregator timeframe
    const logs = this._logQueue.getLogsInTimeframe(this._timeframe);
    this._metricValue = this.computeMetricValue(logs);
  };

  /**
   * Compute the traffic per section for every host for given logs.
   *
   * @param logs the given logs
   */
  computeMetricValue = (logs: Log[]): SectionTrafficMetricValue => {
    const metricValue: SectionTrafficMetricValue = new Map();
    for (const log of logs) {
      // We extract the section from the log
      const section = this._getSectionFromLog(log);
      if (section) {
        // We get the traffic computed so far for the log's section
        const trafficForSection: TrafficMetricValue = metricValue.has(section)
          ? metricValue.get(section)!
          : { value: 0, date: 0 };
        // We update the traffic with the new log
        metricValue.set(section, {
          value: trafficForSection.value + 1 / this._timeframe,
          date: Math.max(trafficForSection.date, log.date)
        });
      }
    }
    return metricValue;
  };

  public getMetric = (): Metric => ({
    metricName: MetricName.SECTIONS,
    timeframe: this._timeframe,
    unit: this._unit,
    metricValue: this._metricValue
  });

  /**
   * Extract the section from a given log request formatted like:
   * "{METHOD} {url} {protocol}"
   * 
   * @param log the given log
   * @returns the section | null if the extraction fails
   
   */
  private _getSectionFromLog = (log: Log): string | null => {
    // We need to reset the regex because it is defined locally
    // Otherwise on 2 consecutives exec, the regex will return null on the second run before reseting
    REGEX_PATTERN.lastIndex = 0;
    const match = REGEX_PATTERN.exec(log.request);
    if (match && match.groups && match.groups['url']) {
      const sections = match.groups['url'].split('/');
      if (sections.length > 1) {
        return sections[1];
      }
    }
    return null;
  };
}
