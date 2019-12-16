import { AlertHandler } from './AlertHandler';
import { SectionsAggregator } from '@barkbark/aggregators';
import { formatUnixTimeToDate } from '@barkbark/lib';
import { SectionTraffic, SectionTrafficAggregator } from '@barkbark/aggregators/SectionTrafficAggregator';
import { hostname } from 'os';

export type SectionTrafficAlert = {
  hostname: string;
  section: string;
  value: number;
  date: number;
};

export class SectionsAlertHandler extends AlertHandler {
  private _sectionTrafficAlertsMap: Map<string, Map<string, SectionTrafficAlert>>;

  constructor(aggregator: SectionsAggregator, threshold: number) {
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
            `High traffic on ${alert.hostname}/${alert.section} generated an alert - hits = ${
              alert.value
            }, triggered at ${formatUnixTimeToDate(alert.date)}`
          );
        } else if (sectionTraffic.value <= this._threshold && this._hasAlertFor(hostname, section)) {
          const alert: SectionTrafficAlert = this._getAlertFor(hostname, section)!;
          this._deleteAlertFor(hostname, section);
          printableAlerts.push(
            `Traffic is back to normal on ${alert.hostname} - hits = ${
              alert.value
            }, recovered at ${formatUnixTimeToDate(alert.date)}`
          );
        }
      }
    }
    return printableAlerts;
  };

  private _hasAlertFor(hostname: string, section: string) {
    return this._sectionTrafficAlertsMap.has(hostname) && this._sectionTrafficAlertsMap.get(hostname)!.has(section);
  }

  private _getAlertFor = (hostname: string, section: string): SectionTrafficAlert | undefined => {
    if (this._sectionTrafficAlertsMap.has(hostname)) {
      const hostSectionTrafficMap: Map<string, SectionTrafficAlert> = this._sectionTrafficAlertsMap.get(hostname)!;
      if (hostSectionTrafficMap.has(section)) {
        return hostSectionTrafficMap.get(section)!;
      }
    }
  };

  private _setAlertFor = (hostname: string, section: string, alert: SectionTrafficAlert): void => {
    if (this._sectionTrafficAlertsMap.has(hostname)) {
      const hostSectionTrafficMap: Map<string, SectionTrafficAlert> = this._sectionTrafficAlertsMap.get(hostname)!;
      hostSectionTrafficMap.set(section, alert);
      this._sectionTrafficAlertsMap.set(hostname, hostSectionTrafficMap);
    }
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
