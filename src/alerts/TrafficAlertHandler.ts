import { TrafficAggregator } from '@barkbark/aggregators';
import { TrafficMetricValue, TrafficAlert, Metric } from '@barkbark/lib';

import { AlertHandler } from './AlertHandler';

export class TrafficAlertHandler extends AlertHandler {
  private _alertIsRaised: boolean;

  constructor(aggregator: TrafficAggregator, threshold: number) {
    super(aggregator, threshold);
    this._alertIsRaised = false;
  }

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
