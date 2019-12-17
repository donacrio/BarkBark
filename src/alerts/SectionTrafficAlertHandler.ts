import { SectionTrafficAggregator } from '@barkbark/aggregators';
import { SectionTrafficAlert, Metric, SectionTrafficMetricValue, TrafficMetricValue } from '@barkbark/lib';

import { AlertHandler } from './AlertHandler';

/**
 * Section traffic aggregator alert handler for watching the traffic per section
 */
export class SectionTrafficAlertHandler extends AlertHandler {
  /** Status of the alert */
  private _raisedAlertsForSections: Map<string, boolean>;

  constructor(aggregator: SectionTrafficAggregator, threshold: number) {
    super(aggregator, threshold);
    this._raisedAlertsForSections = new Map();
  }

  /**
   * Computes the new alert.
   *
   * First it compares the aggregator metric value for every section
   * with the threshold:
   * - If above and an alert is not already raised, it raised one.
   * - If under and an alert is already raised, it resolves it.
   * - Otherwise nothing happens.
   * @see AlertHandler#compute
   */
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
