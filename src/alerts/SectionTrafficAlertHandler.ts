import { SectionTrafficAggregator, SectionTraffic } from '@barkbark/aggregators';
import {
  formatUnixTimeInSecToPrintableDate,
  formatHitsPerSecond,
  colorTextInRed,
  colorTextInGreen
} from '@barkbark/lib';

import { AlertHandler } from './AlertHandler';

export type SectionTrafficAlert = {
  hostname: string;
  section: string;
  value: number;
  date: number;
};

export class SectionTrafficAlertHandler extends AlertHandler {
  private _sectionTrafficAlertsMap: Map<string, Map<string, SectionTrafficAlert>>;

  constructor(aggregator: SectionTrafficAggregator, threshold: number) {
    super(aggregator, threshold);
    this._sectionTrafficAlertsMap = new Map();
  }

  public compute = (): string[] => {
    const printableAlerts: string[] = [];
    const sectionTrafficMap: Map<string, Map<string, SectionTraffic>> = (<SectionTrafficAggregator>(
      this._aggregator
    )).getSectionTrafficMap();
    for (const hostname of sectionTrafficMap.keys()) {
      const hostSectionTrafficMap: Map<string, SectionTraffic> = sectionTrafficMap.get(hostname)!;
      for (const section of hostSectionTrafficMap.keys()) {
        const sectionTraffic: SectionTraffic = hostSectionTrafficMap.get(section)!;
        if (sectionTraffic.value > this._threshold && !this._hasAlertFor(hostname, section)) {
          const alert: SectionTrafficAlert = {
            hostname,
            section,
            value: sectionTraffic.value,
            date: sectionTraffic.date
          };
          this._setAlertFor(hostname, section, alert);
          printableAlerts.push(
            colorTextInRed(
              `High traffic on ${alert.hostname}/${alert.section} generated an alert - hits = ${formatHitsPerSecond(
                alert.value
              )}, triggered at ${formatUnixTimeInSecToPrintableDate(alert.date)}`
            )
          );
        } else if (sectionTraffic.value <= this._threshold && this._hasAlertFor(hostname, section)) {
          this._deleteAlertFor(hostname, section);
          printableAlerts.push(
            colorTextInRed(
              `Traffic is back to normal on ${hostname} /${section} - hits = ${formatHitsPerSecond(
                sectionTraffic.value
              )}, recovered at ${formatUnixTimeInSecToPrintableDate(sectionTraffic.date)}`
            )
          );
        }
      }
    }

    return printableAlerts;
  };

  private _hasAlertFor(hostname: string, section: string) {
    return this._sectionTrafficAlertsMap.has(hostname) && this._sectionTrafficAlertsMap.get(hostname)!.has(section);
  }

  private _setAlertFor = (hostname: string, section: string, alert: SectionTrafficAlert): void => {
    const hostSectionTrafficMap: Map<string, SectionTrafficAlert> = this._sectionTrafficAlertsMap.has(hostname)
      ? this._sectionTrafficAlertsMap.get(hostname)!
      : new Map();
    hostSectionTrafficMap.set(section, alert);
    this._sectionTrafficAlertsMap.set(hostname, hostSectionTrafficMap);
  };

  private _deleteAlertFor(hostname: string, section: string) {
    if (this._sectionTrafficAlertsMap.has(hostname)) {
      const hostSectionTrafficMap: Map<string, SectionTrafficAlert> = this._sectionTrafficAlertsMap.get(hostname)!;
      if (hostSectionTrafficMap.has(section)) {
        hostSectionTrafficMap.delete(section);
        this._sectionTrafficAlertsMap.set(hostname, hostSectionTrafficMap);
      }
    }
  }
}
