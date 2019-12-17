import { Aggregator } from '@barkbark/aggregators';
import { Alert } from '@barkbark/lib';

/**
 * AlertHandler abstract class.
 *
 * This class is used to raise alerts when a metric is behaving strangely
 */
export abstract class AlertHandler {
  /** The aggregator computing the metric that is watched*/
  protected _aggregator: Aggregator;
  /** The threshold for alert raising */
  protected _threshold: number;

  constructor(aggregator: Aggregator, threshold: number) {
    this._aggregator = aggregator;
    this._threshold = threshold;
  }

  /**
   * Compute an alert if the metric if above the threshold
   * over the logs in the aggregator queue,
   * over the aggregator timeframe.
   *
   * The Alert depends of the class extending AlertHandler abstract class
   */
  public abstract compute(): Alert | null;
}
