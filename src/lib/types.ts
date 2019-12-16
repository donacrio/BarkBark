export type Log = {
  remotehost: string;
  rfc931: string;
  authuser: string;
  date: number;
  request: string;
  status: number;
  bytes: number;
};

export enum AggregatorName {
  SECTIONS = 'sections traffic',
  TRAFFIC = 'traffic'
}

export enum AggregatorUnit {
  HIT_PER_SEC = 'hit/s'
}

export type BarkBarkConfig = {
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
      name: AggregatorName;
      timeframe: number;
    }[];
  };
  alertsManager: {
    refreshTime: number;
    alerts: {
      aggregator: {
        name: AggregatorName;
        timeframe: number;
      };
      threshold: number;
    }[];
  };
};
