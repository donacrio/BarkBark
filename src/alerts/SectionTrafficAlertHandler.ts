import { SectionTrafficAggregator } from '@barkbark/aggregators';
import { SectionTrafficAlert, Metric, SectionTrafficMetricValue, TrafficMetricValue } from '@barkbark/lib';

import { AlertHandler } from './AlertHandler';

export class SectionTrafficAlertHandler extends AlertHandler {
  private _raisedAlertsForSections: Map<string, boolean>;

  constructor(aggregator: SectionTrafficAggregator, threshold: number) {
    super(aggregator, threshold);
    this._raisedAlertsForSections = new Map();
  }

  public compute = (): SectionTrafficAlert | null => {
    const sectionTrafficAlert: SectionTrafficAlert = new Map();
    const metric: Metric = (<SectionTrafficAggregator>this._aggregator).getMetric();
    const sectionTraffic = metric.metricValue as SectionTrafficMetricValue;
    for (const section of sectionTraffic.keys()) {
      const trafficForSection: TrafficMetricValue = sectionTraffic.get(section)!;
      if (trafficForSection.value > this._threshold && !this._hasAlertFor(section)) {
        this._raisedAlertsForSections.set(section, true);
        sectionTrafficAlert.set(section, {
          value: trafficForSection.value,
          date: trafficForSection.date,
          recovered: false
        });
      } else if (trafficForSection.value <= this._threshold && this._hasAlertFor(section)) {
        this._raisedAlertsForSections.set(section, false);
        sectionTrafficAlert.set(section, {
          value: trafficForSection.value,
          date: trafficForSection.date,
          recovered: true
        });
      }
    }
    return Array.from(sectionTrafficAlert.keys()).length > 0 ? sectionTrafficAlert : null;
  };

  private _hasAlertFor = (section: string): boolean => {
    return this._raisedAlertsForSections.has(section) && this._raisedAlertsForSections.get(section)!;
  };
}
