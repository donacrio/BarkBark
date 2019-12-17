export type Log = {
  rfc931: string;
  authuser: string;
  date: number;
  request: string;
  status: number;
  bytes: number;
};

export enum MetricName {
  SECTIONS = 'sections traffic',
  TRAFFIC = 'traffic'
}

export enum MetricUnit {
  HIT_PER_SEC = 'hit/s'
}

export type Metric = {
  metricName: MetricName;
  timeframe: number;
  unit: MetricUnit;
  metricValue: TrafficMetricValue | SectionTrafficMetricValue;
};

export type TrafficMetricValue = {
  value: number;
  date: number;
};

export type SectionTrafficMetricValue = Map<string, TrafficMetricValue>;

export type Alert = TrafficAlert | SectionTrafficAlert;

export type TrafficAlert = {
  value: number;
  date: number;
  recovered: boolean;
};

export type SectionTrafficAlert = Map<string, TrafficAlert>;

export type BarkBarkConfig = {
  simulation: {
    running: boolean;
    output: string;
  };
  parser: {
    refreshTime: number;
    queueSize: number;
    logfile: string;
  };
  ui: {
    refreshTime: number;
  };
  aggregatorManager: {
    refreshTime: number;
    aggregators: {
      metricName: MetricName;
      timeframe: number;
    }[];
  };
  alertsManager: {
    refreshTime: number;
    alerts: {
      aggregator: {
        metricName: MetricName;
        timeframe: number;
      };
      threshold: number;
    }[];
  };
};
