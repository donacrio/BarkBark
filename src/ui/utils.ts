import blessed from 'blessed';
import contrib from 'blessed-contrib';
import { TrafficMetricValue, SectionTrafficMetricValue, Metric } from '@barkbark/lib';

export const isTrafficMetricValue = (
  metricValue: TrafficMetricValue | SectionTrafficMetricValue
): metricValue is TrafficMetricValue => (metricValue as TrafficMetricValue).value != undefined;

export const formatMetricName = (metric: Metric): string => `${metric.metricName.valueOf()}`;
export const formatTrafficMetricValue = (metricValue: TrafficMetricValue): blessed.Widgets.BoxOptions => ({
  content: `${metricValue.value}`
});

export const formatSectionTrafficMetricValue = (
  metricValue: SectionTrafficMetricValue
): contrib.Widgets.TreeOptions => {
  const children: { [key: string]: string } = {};
  for (const section of metricValue.keys()) {
    children[section] = `${metricValue.get(section)!}`;
  }
  return {
    fg: 'white',
    data: { extended: true, children }
  };
};
