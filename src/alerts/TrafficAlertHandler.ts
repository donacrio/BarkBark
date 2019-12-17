import { TrafficAggregator } from '@barkbark/aggregators';
import { TrafficMetricValue, TrafficAlert, Metric } from '@barkbark/lib';

import { AlertHandler } from './AlertHandler';

/**
 * Traffic alert handler for watching traffic aggregators
 */
export class TrafficAlertHandler extends AlertHandler {
  /** Status of the alert */
  private _alertIsRaised: boolean;

  constructor(aggregator: TrafficAggregator, threshold: number) {
    super(aggregator, threshold);
    this._alertIsRaised = false;
  }

  /**
   * Computes the new alert.
   *
   * First it compares the aggregator metric value with the threshold:
   * - If above and an alert is not already raised, it raised one.
   * - If under and an alert is already raised, it resolves it.
   * - Otherwise nothing happens.
   * @see AlertHandler#compute
   */
  public compute = (): TrafficAlert | null => {
    const metric: Metric = (<TrafficAggregator>this._aggregator).getMetric();
    const traffic = metric.metricValue as TrafficMetricValue;
    if (traffic.value > this._threshold && !this._alertIsRaised) {
      this._alertIsRaised = true;
      return { value: traffic.value, date: traffic.date, recovered: false };
    } else if (traffic.value <= this._threshold && this._alertIsRaised) {
      this._alertIsRaised = false;
      return { value: traffic.value, date: traffic.date, recovered: true };
    }
    return null;
  };
}
