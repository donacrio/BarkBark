import { TrafficAggregator, Traffic } from '@barkbark/aggregators';
import { formatUnixTimeInSecToPrintableDate, formatHitsPerSecond } from '@barkbark/lib';

import { AlertHandler } from './AlertHandler';

export type TrafficAlert = {
  hostname: string;
  value: number;
  date: number;
};

export class TrafficAlertHandler extends AlertHandler {
  private _trafficAlertsMap: Map<string, TrafficAlert>;

  constructor(aggregator: TrafficAggregator, threshold: number) {
    super(aggregator, threshold);
    this._trafficAlertsMap = new Map();
  }

  public compute = (): string[] => {
    const printableAlerts: string[] = [];
    const trafficMap: Map<string, Traffic> = (<TrafficAggregator>this._aggregator).getTrafficMap();
    for (const hostname of trafficMap.keys()) {
      const traffic: Traffic = trafficMap.get(hostname)!;

      if (traffic.value > this._threshold && !this._hasAlertFor(hostname)) {
        const alert: TrafficAlert = { hostname, value: traffic.value, date: traffic.date };
        this._setAlertFor(hostname, alert);
        printableAlerts.push(
          `High traffic on ${alert.hostname} generated an alert - hits = ${formatHitsPerSecond(
            alert.value
          )}, triggered at ${formatUnixTimeInSecToPrintableDate(alert.date)}`
        );
      } else if (traffic.value <= this._threshold && this._hasAlertFor(hostname)) {
        this._deleteAlertFor(hostname);
        printableAlerts.push(
          `Traffic is back to normal on ${hostname} - hits = ${formatHitsPerSecond(
            traffic.value
          )}, recovered at ${formatUnixTimeInSecToPrintableDate(traffic.date)}`
        );
      }
    }
    return printableAlerts;
  };

  private _hasAlertFor = (hostname: string): boolean => this._trafficAlertsMap.has(hostname);

  private _setAlertFor = (hostname: string, alert: TrafficAlert): void => {
    this._trafficAlertsMap.set(hostname, alert);
  };

  private _deleteAlertFor = (hostname: string): void => {
    if (this._trafficAlertsMap.has(hostname)) {
      this._trafficAlertsMap.delete(hostname);
    }
  };
}
