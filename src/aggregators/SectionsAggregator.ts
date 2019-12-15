import { Log } from '@barkbark/types';
import { LogQueue } from '@barkbark/LogQueue';

import { Aggregator } from './Aggregator';
import { AggregatorName } from './types';

const REGEX_PATTERN = /^(?<method>\S*) (?<url>\S*) (?<protocol>\S*)$/g;

export class SectionsAggregator extends Aggregator {
  constructor(logQueue: LogQueue, timeframe: number) {
    super(AggregatorName.TRAFFIC, logQueue, timeframe);
  }

  compute = (): void => {
    const logs = this._logQueue.getLogsInTimeframe(this._timeframe);
    console.log(this.computeSectionsMap(logs));
  };

  computeSectionsMap = (logs: Log[]): Map<string, Map<string, number>> => {
    const sectionsMap: Map<string, Map<string, number>> = new Map();
    for (const log of logs) {
      const section = this._getSectionFromLog(log);
      if (section) {
        const hostSectionsMap = sectionsMap.has(log.remotehost) ? sectionsMap.get(log.remotehost)! : new Map();
        const trafficForHostSection = hostSectionsMap?.has(section) ? hostSectionsMap.get(section)! : 0;
        hostSectionsMap.set(section, trafficForHostSection + 1000 / this._timeframe);
        sectionsMap.set(log.remotehost, hostSectionsMap);
      }
    }
    return sectionsMap;
  };

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
