import { Aggregator, TrafficAggregator, SectionTrafficAggregator } from '@barkbark/aggregators';
import { Alert, MetricName } from '@barkbark/lib';

import { AlertHandler } from './AlertHandler';
import { TrafficAlertHandler } from './TrafficAlertHandler';
import { SectionTrafficAlertHandler } from './SectionTrafficAlertHandler';

/**
 * Main class containing the logic for alert raising.
 *
 * It uses an observer pattern with an array of AlertHandler instances to raise alerts.
 * The alert handlers are created using a Factory pattern to ensure encapsulation of the logic.
 * @see Aggregator
 */
export class AlerManager {
  private _alertHandlers: AlertHandler[];
  private _alerts: Alert[];
  private _refreshTime: number;

  constructor(refreshTime: number) {
    this._alertHandlers = [];
    this._alerts = [];
    this._refreshTime = refreshTime;
  }

  /**
   * Call the compute method of every alert handler to raise alerts.
   */
  public compute = (): void => {
    for (const alertHandler of this._alertHandlers) {
      const alert = alertHandler.compute();
      // If an alert is raised, it's added to the alerts array
      if (alert) {
        this._alerts.push(alert);
      }
    }
  };

  public addAlertHandlerForAggregator(aggregator: Aggregator, threshold: number) {
    try {
      const alertHandler: AlertHandler = this._getAlertHandler(aggregator, threshold);
      this._alertHandlers.push(alertHandler);
    } catch (e) {
      console.log(`Could not add AlertHandler for aggregator ${aggregator.getName()}:\n${e.message}`);
    }
  }

  public clearAlerts = (): void => {
    this._alerts = [];
  };

  public getAlerts = (): Alert[] => this._alerts;

  public getRefreshTime = (): number => this._refreshTime;

  /**
   * Return a new AlertHandler with a given aggregator to watch and a given threshold
   *
   * @param aggregator the givem aggregator
   * @param threshold the given threshold
   */
  private _getAlertHandler(aggregator: Aggregator, threshold: number) {
    switch (aggregator.getName()) {
      case MetricName.TRAFFIC:
        return new TrafficAlertHandler(<TrafficAggregator>aggregator, threshold);
      case MetricName.SECTIONS:
        return new SectionTrafficAlertHandler(<SectionTrafficAggregator>aggregator, threshold);
      default:
        throw new Error(`AlertHandler for aggregator ${aggregator.getName()} not yet implemented`);
    }
  }
}
