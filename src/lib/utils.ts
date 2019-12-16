import { Aggregator } from '@barkbark/aggregators';

export const formatUniximeToSec = (time: number): number => {
  return time / 1000;
};

export const formatUnixTimeInSecToPrintableDate = (timeInSec: number): string => {
  const unixTime = new Date(timeInSec * 1000).toLocaleString('en-US', { timeZone: 'America/New_York' });
  const datetime = new Date(unixTime);
  const year = datetime.getFullYear();
  const month = datetime.getMonth();
  const date = datetime.getDate();
  const hour = datetime.getHours();
  const min = datetime.getMinutes();
  const sec = datetime.getSeconds();
  return `${year}-${month}-${date}:${hour}:${min}:${sec}`;
};

export const formatHitsPerSecond = (hits: number): string => {
  return `${Math.round(hits * 100) / 100} hits/second`;
};

export const formatAggregator = (aggregator: Aggregator): string => {
  return `${aggregator.getName().valueOf()} (${aggregator.getTimeframe()}s)`;
};
