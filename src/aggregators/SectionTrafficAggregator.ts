import { LogQueue } from '@barkbark/parser/LogQueue';
import { formatHitsPerSecond, Log, AggregatorName, AggregatorUnit } from '@barkbark/lib';

import { Aggregator } from './Aggregator';

/** Regular expression used to extract the section from a log request */
const REGEX_PATTERN = /^(?<method>\S*) (?<url>\S*) (?<protocol>\S*)$/g;

export type SectionTrafficMetric = {
  value: number;
  date: number;
};

/**
 * Section traffic aggregator computing the traffic per section for every host.
 */
export class SectionTrafficAggregator extends Aggregator {
  private _sectionTrafficMap: Map<string, Map<string, SectionTrafficMetric>>;

  constructor(logQueue: LogQueue, timeframe: number) {
    super(AggregatorName.SECTIONS, logQueue, timeframe, AggregatorUnit.HIT_PER_SEC);
    this._sectionTrafficMap = new Map();
  }

  /**
   * Compute the traffic per section for every host.
   *
   * @see Aggregator#compute
   */
  compute = (): void => {
    // We get the logs from the queue, over the aggregator timeframe
    const logs = this._logQueue.getLogsInTimeframe(this._timeframe);
    this._sectionTrafficMap = this.computeSectionTrafficMap(logs);
  };

  /**
   * Return a Map mapping every hostname with its traffic per section value as a string.
   *
   * @see Aggregator#getPrintableMetricsMap
   */
  public getPrintableMetricsMap = (): Map<string, string> => {
    const printableMetricsMap: Map<string, string> = new Map();
    for (const hostname of this._sectionTrafficMap.keys()) {
      const hostSectionTrafficMap: Map<string, SectionTrafficMetric> = this._sectionTrafficMap.get(hostname)!;
      const printableMetrics: string[] = [];
      for (const section of hostSectionTrafficMap.keys()) {
        const sectionTraffic: SectionTrafficMetric = hostSectionTrafficMap.get(section)!;
        printableMetrics.push(`/${section}: ${formatHitsPerSecond(sectionTraffic.value)}`);
      }
      printableMetricsMap.set(hostname, printableMetrics.sort().join('  '));
    }
    return printableMetricsMap;
  };

  /**
   * Compute the traffic per section for every host for given logs.
   *
   * @param logs the given logs
   */
  computeSectionTrafficMap = (logs: Log[]): Map<string, Map<string, SectionTrafficMetric>> => {
    const sectionTrafficMap: Map<string, Map<string, SectionTrafficMetric>> = new Map();
    for (const log of logs) {
      // We extract the section from the log
      const section = this._getSectionFromLog(log);
      if (section) {
        // We get the traffic computed so far for the log's hostname and section
        const hostSectionTrafficMap: Map<string, SectionTrafficMetric> = sectionTrafficMap.has(log.remotehost)
          ? sectionTrafficMap.get(log.remotehost)!
          : new Map();
        const hostSectionTraffic: SectionTrafficMetric = hostSectionTrafficMap?.has(section)
          ? hostSectionTrafficMap.get(section)!
          : { value: 0, date: 0 };
        // We update the traffic with the new log
        hostSectionTrafficMap.set(section, {
          value: hostSectionTraffic.value + 1 / this._timeframe,
          date: Math.max(hostSectionTraffic.date, log.date)
        });
        sectionTrafficMap.set(log.remotehost, hostSectionTrafficMap);
      }
    }
    return sectionTrafficMap;
  };

  public getSectionTrafficMap = (): Map<string, Map<string, SectionTrafficMetric>> => this._sectionTrafficMap;

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
