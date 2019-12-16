import { Aggregator } from '@barkbark/aggregators';

export const formatUniximeToSec = (time: number): number => {
  return time / 1000;
};

export const formatUnixTimeInSecToPrintableDate = (timeInSec: number): string => {
  return new Date(timeInSec * 1000).toString();
};

export const formatHitsPerSecond = (hits: number): string => {
  return `${Math.round(hits * 100) / 100}`;
};

export const formatAggregator = (aggregator: Aggregator): string => {
  return `${aggregator
    .getName()
    .valueOf()} (${aggregator.getUnit().valueOf()}) for the past ${aggregator.getTimeframe()}s`;
};

export const colorTextInRed = (text: string) => {
  return `{red-fg}${text}{/red-fg}`;
};

export const colorTextInGreen = (text: string) => {
  return `{green-fg}${text}{/green-fg}`;
};
