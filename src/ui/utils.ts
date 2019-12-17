/**
 * Utils librarie for UI rendering.
 */
import {
  TrafficMetricValue,
  SectionTrafficMetricValue,
  Metric,
  TrafficAlert,
  SectionTrafficAlert,
  ResponseCodeMetricValue,
  MetricName
} from '@barkbark/lib';

/**
 * Format the name if a given metric to a string.
 *
 * @param metric the given metric
 */
export const formatMetricName = (metric: Metric): string =>
  `${metric.metricName.valueOf()} past ${metric.timeframe}s (${metric.unit})`;

/**
 * Format the value of a given metric to a string.
 *
 * @param metric the given metric
 */
export const formatMetricValue = (metric: Metric): string => {
  switch (metric.metricName) {
    case MetricName.TRAFFIC:
      return formatTrafficMetricValue(metric.metricValue as TrafficMetricValue);
    case MetricName.SECTIONS:
      return formatSectionTrafficMetricValue(metric.metricValue as SectionTrafficMetricValue);
    case MetricName.RESPONSE_CODES:
      return formatResponseCodeMetricValue(metric.metricValue as ResponseCodeMetricValue);
    default:
      return '';
  }
};

/**
 * Format the update date of a given metric to a string.
 *
 * @param metric the given metric
 */
export const formatMetricUpdateDate = (metric: Metric): string => {
  switch (metric.metricName) {
    case MetricName.TRAFFIC:
      return formatTrafficMetricUpdateDate(metric.metricValue as TrafficMetricValue);
    case MetricName.SECTIONS:
      return formatSectionTrafficMetricUpdateDate(metric.metricValue as SectionTrafficMetricValue);
    case MetricName.RESPONSE_CODES:
      return formatResponseCodeMetricUpdateDate(metric.metricValue as ResponseCodeMetricValue);
    default:
      return '';
  }
};

/**
 *Returns if a given alert is a TrafficAlert or not.

 * @param alert the given alert
 */
export const isTrafficAlert = (alert: TrafficAlert | SectionTrafficAlert): alert is TrafficAlert =>
  (alert as TrafficAlert).value != undefined;

/**
 * Format a given TrafficAlert into a string message.
 *
 * @param alert the given alert
 * @param section optionnal parameter to log a host section
 */
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

/**
 * Format a given SectionTrafficAlert into a string message.
 *
 * @param alert the given alert
 */
export const formatSectionTrafficAlert = (alert: SectionTrafficAlert): string[] => {
  const sectionAlerts: string[] = [];
  for (const section of alert.keys()) {
    sectionAlerts.push(formatTrafficAlert(alert.get(section)!, section));
  }

  return sectionAlerts;
};

const formatTrafficMetricValue = (metricValue: TrafficMetricValue): string =>
  `${Math.round(metricValue.value * 100) / 100}`;

const formatSectionTrafficMetricValue = (metricValue: SectionTrafficMetricValue): string => {
  const sections: string[] = [];
  for (const section of Array.from(metricValue.keys()).sort()) {
    sections.push(`/${section}: ${formatTrafficMetricValue(metricValue.get(section)!)}`);
  }
  return sections.join(' || ');
};

const formatResponseCodeMetricValue = (metricValue: ResponseCodeMetricValue): string => {
  const responseCoeds: string[] = [];
  for (const responseCode of Array.from(metricValue.keys()).sort()) {
    responseCoeds.push(`${responseCode}: ${metricValue.get(responseCode)!.value}`);
  }
  return responseCoeds.join(' || ');
};

const formatTrafficMetricUpdateDate = (metricValue: TrafficMetricValue): string =>
  `${formatUnixTime(metricValue.date)}`;

const formatSectionTrafficMetricUpdateDate = (metricValue: SectionTrafficMetricValue): string => {
  let maxDate = 0;
  for (const section of metricValue.keys()) {
    maxDate = Math.max(maxDate, metricValue.get(section)!.date);
  }
  return `${formatUnixTime(maxDate)}`;
};

const formatResponseCodeMetricUpdateDate = (metricValue: ResponseCodeMetricValue): string => {
  let maxDate = 0;
  for (const responseCode of metricValue.keys()) {
    maxDate = Math.max(maxDate, metricValue.get(responseCode)!.date);
  }
  return `${formatUnixTime(maxDate)}`;
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
