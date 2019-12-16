import { LogQueue } from '@barkbark/parser/LogQueue';
import { formatAggregator } from '@barkbark/lib';

import { Aggregator } from './Aggregator';
import { TrafficAggregator } from './TrafficAggregator';
import { SectionTrafficAggregator } from './SectionTrafficAggregator';

import { AggregatorName } from '../lib/types';

/**
 * Main class containing the logic for metric computing.
 *
 * It uses an observer pattern with an array of Aggregator instances to compute metrics.
 * The metrics are computed over a LogQueue instance containing the logs.
 * The aggregators are created using a Factory pattern to ensure encapsulation of the logic.
 * @see Aggregator
 */
export class AggregatorManager {
  private _logQueue: LogQueue;
  private _aggregators: Aggregator[];
  private _refreshTime: number;

  constructor(logQueue: LogQueue, refreshTime: number) {
    this._logQueue = logQueue;
    this._aggregators = [];
    this._refreshTime = refreshTime;
  }

  public compute = (): void => {
    this._aggregators.forEach(aggregator => aggregator.compute());
  };

  public addAggregator = (aggregator: Aggregator): void => {
    this._aggregators.push(aggregator);
  };

  /**
   * Return a new Aggregator with a given name and a given timeframe.
   *
   * @param aggregatorName the given name (=instance name)
   * @param timeframe the given timeframe
   * @returns the newly created aggregator instance AS a Aggregator object
   */
  public getAggregator = (aggregatorName: AggregatorName, timeframe: number): Aggregator => {
    switch (aggregatorName) {
      case AggregatorName.SECTIONS:
        return new SectionTrafficAggregator(this._logQueue, timeframe);
      case AggregatorName.TRAFFIC:
        return new TrafficAggregator(this._logQueue, timeframe);
      default:
        throw new Error(`Aggregator ${aggregatorName} not yet implemented`);
    }
  };

  /**
   * Return displayable metric data for the UI.
   *
   * It creates a table with the first line as headers.
   * There is one line per hostname and every hostname has his metrics displayed
   */
  public getPrintableMetrics = (): string[][] => {
    const headers: string[] = ['hostname', ...this._aggregators.map(aggregator => formatAggregator(aggregator))];
    const printableMetrics: string[][] = [headers];
    const printableMetricsMap = this._getPrintableMetricsMap();
    for (const hostname of Array.from(printableMetricsMap.keys()).sort()) {
      printableMetrics.push([hostname, ...printableMetricsMap.get(hostname)!]);
    }
    return printableMetrics;
  };

  public getRefreshTime = (): number => this._refreshTime;

  /**
   * Return a Map mapping every hostname with its metrics values.
   *
   * Every metric value is formated as a string to be printable and displayable in the UI.
   * @returns a Map<hostname, printableMetric[]>
   */
  private _getPrintableMetricsMap = (): Map<string, string[]> => {
    const printableMetricsMap = new Map<string, string[]>();
    // We get the printable metrics map for every aggregator
    const aggregatorsPrintableMetricsMap: Map<string, string>[] = this._aggregators.map(aggregator =>
      aggregator.getPrintableMetricsMap()
    );
    // We go through every printable metric map to convert them into a unique map
    for (const aggregatorPrintableMetricsMap of aggregatorsPrintableMetricsMap) {
      for (const hostname of aggregatorPrintableMetricsMap.keys()) {
        const printableMetricsForHost = printableMetricsMap.has(hostname) ? printableMetricsMap.get(hostname)! : [];
        printableMetricsForHost.push(aggregatorPrintableMetricsMap.get(hostname)!);
        printableMetricsMap.set(hostname, printableMetricsForHost);
      }
    }
    return printableMetricsMap;
  };
}
