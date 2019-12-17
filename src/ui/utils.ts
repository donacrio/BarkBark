import {
  TrafficMetricValue,
  SectionTrafficMetricValue,
  Metric,
  TrafficAlert,
  SectionTrafficAlert
} from '@barkbark/lib';

export const isTrafficMetricValue = (
  metricValue: TrafficMetricValue | SectionTrafficMetricValue
): metricValue is TrafficMetricValue => (metricValue as TrafficMetricValue).value != undefined;

export const formatMetricName = (metric: Metric): string =>
  `${metric.metricName.valueOf()} past ${metric.timeframe}s (${metric.unit})`;

export const formatTrafficMetricValue = (metricValue: TrafficMetricValue): string =>
  `${Math.round(metricValue.value * 100) / 100}`;

export const formatSectionTrafficMetricValue = (metricValue: SectionTrafficMetricValue): string => {
  const sections: string[] = [];
  for (const section of Array.from(metricValue.keys()).sort()) {
    sections.push(`/${section}: ${formatTrafficMetricValue(metricValue.get(section)!)}`);
  }
  return sections.join(' || ');
};

export const formatTrafficMetricUpdateDate = (metricValue: TrafficMetricValue): string =>
  `${formatUnixTime(metricValue.date)}`;

export const formatSectionTrafficMetricUpdateDate = (metricValue: SectionTrafficMetricValue): string => {
  let maxDate = 0;
  for (const section of metricValue.keys()) {
    maxDate = Math.max(maxDate, metricValue.get(section)!.date);
  }
  return `${formatUnixTime(maxDate)}`;
};
export const isTrafficAlert = (alert: TrafficAlert | SectionTrafficAlert): alert is TrafficAlert =>
  (alert as TrafficAlert).value != undefined;

export const formatTrafficAlert = (alert: TrafficAlert, section?: string): string => {
  if (alert.recovered) {
    return `{green-bg}Traffic is back to normal${
      section ? ` on /${section}` : ''
    }{/green-bg} - {bold}hits = ${formatHitsPerSecond(alert.value)}{/bold}, trigered at ${formatUnixTime(alert.date)}`;
  }
  return `{red-bg}High traffic generated an alert${
    section ? ` on /${section}` : ''
  }{/red-bg} - {bold}hits = ${formatHitsPerSecond(alert.value)}{/bold}, trigered at ${formatUnixTime(alert.date)}`;
};

export const formatSectionTrafficAlert = (alert: SectionTrafficAlert): string[] => {
  const sectionAlerts: string[] = [];
  for (const section of alert.keys()) {
    sectionAlerts.push(formatTrafficAlert(alert.get(section)!, section));
  }

  return sectionAlerts;
};

const formatHitsPerSecond = (hits: number): string => `${Math.round(hits * 100) / 100}`;

const formatUnixTime = (time: number): string => {
  const datetime = new Date(time * 1000);
  const year = datetime.getFullYear();
  const month = datetime.getMonth();
  const date = datetime.getDate();
  const hour = datetime.getHours();
  const min = datetime.getMinutes();
  const sec = datetime.getSeconds();
  return `${year}-${month}-${date}:${hour}:${min}:${sec} (CET)`;
};
