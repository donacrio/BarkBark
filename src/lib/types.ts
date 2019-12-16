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
