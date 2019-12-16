import { LogQueue } from '@barkbark/LogQueue';
import { formatHitsPerSecond, Log, AggregatorName } from '@barkbark/lib';

import { Aggregator } from './Aggregator';

const REGEX_PATTERN = /^(?<method>\S*) (?<url>\S*) (?<protocol>\S*)$/g;

export type SectionTraffic = {
  value: number;
  date: number;
};

export class SectionTrafficAggregator extends Aggregator {
  private _sectionTrafficMap: Map<string, Map<string, SectionTraffic>>;

  constructor(logQueue: LogQueue, timeframe: number) {
    super(AggregatorName.SECTIONS, logQueue, timeframe);
    this._sectionTrafficMap = new Map();
  }

  compute = (): void => {
    const logs = this._logQueue.getLogsInTimeframe(this._timeframe);
    this._sectionTrafficMap = this.computeSectionTrafficMap(logs);
  };

  public getPrintableMetricsMap = (): Map<string, string> => {
    const printableMetricsMap: Map<string, string> = new Map();
    for (const hostname of this._sectionTrafficMap.keys()) {
      const sectionTrafficMap: Map<string, SectionTraffic> = this._sectionTrafficMap.get(hostname)!;
      const printableMetrics: string[] = [];
      for (const section of sectionTrafficMap.keys()) {
        const sectionTraffic: SectionTraffic = sectionTrafficMap.get(section)!;
        printableMetrics.push(`/${section}: ${formatHitsPerSecond(sectionTraffic.value)}`);
      }
      printableMetricsMap.set(hostname, printableMetrics.join(' || '));
    }
    return printableMetricsMap;
  };

  computeSectionTrafficMap = (logs: Log[]): Map<string, Map<string, SectionTraffic>> => {
    const sectionTrafficMap: Map<string, Map<string, SectionTraffic>> = new Map();
    for (const log of logs) {
      const section = this._getSectionFromLog(log);
      if (section) {
        const hostSectionTrafficMap: Map<string, SectionTraffic> = sectionTrafficMap.has(log.remotehost)
          ? sectionTrafficMap.get(log.remotehost)!
          : new Map();
        const hostSectionTraffic: SectionTraffic = hostSectionTrafficMap?.has(section)
          ? hostSectionTrafficMap.get(section)!
          : { value: 0, date: 0 };
        hostSectionTrafficMap.set(section, {
          value: hostSectionTraffic.value + 1 / this._timeframe,
          date: Math.max(hostSectionTraffic.date, log.date)
        });
        sectionTrafficMap.set(log.remotehost, hostSectionTrafficMap);
      }
    }
    return sectionTrafficMap;
  };

  public getSectionTrafficMap = (): Map<string, Map<string, SectionTraffic>> => this._sectionTrafficMap;

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
