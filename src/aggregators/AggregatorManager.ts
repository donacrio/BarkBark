import { LogQueue } from '@barkbark/LogQueue';
import { formatAggregator } from '@barkbark/lib';

import { Aggregator } from './Aggregator';
import { TrafficAggregator } from './TrafficAggregator';
import { SectionTrafficAggregator } from './SectionTrafficAggregator';

import { AggregatorName } from '../lib/types';

export class AggregatorManager {
  private _logQueue: LogQueue;
  private _aggregators: Aggregator[];

  constructor(logQueue: LogQueue) {
    this._logQueue = logQueue;
    this._aggregators = [];
  }

  public compute = (): void => {
    this._aggregators.forEach(aggregator => aggregator.compute());
  };

  public addAggregator = (aggregator: Aggregator): void => {
    this._aggregators.push(aggregator);
  };

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

  public getPrintableMetrics = (): string[][] => {
    const headers: string[] = ['hostname', ...this._aggregators.map(aggregator => formatAggregator(aggregator))];
    const printableMetrics: string[][] = [headers];
    const printableMetricsMap = this._getPrintableMetricsMap();
    for (const hostname of Array.from(printableMetricsMap.keys()).sort()) {
      printableMetrics.push([hostname, ...printableMetricsMap.get(hostname)!]);
    }
    return printableMetrics;
  };

  private _getPrintableMetricsMap = (): Map<string, string[]> => {
    const printableMetricsMap = new Map<string, string[]>();
    const aggregatorsPrintableMetrics: Map<string, string>[] = this._aggregators.map(aggregator =>
      aggregator.getPrintableMetricsMap()
    );
    for (const aggregatorPrintableMetrics of aggregatorsPrintableMetrics) {
      for (const hostname of aggregatorPrintableMetrics.keys()) {
        const printableMetricsForHost = printableMetricsMap.has(hostname) ? printableMetricsMap.get(hostname)! : [];
        printableMetricsForHost.push(aggregatorPrintableMetrics.get(hostname)!);
        printableMetricsMap.set(hostname, printableMetricsForHost);
      }
    }
    return printableMetricsMap;
  };
}
