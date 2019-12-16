import LineByLine from 'n-readlines';
import { Log } from '@barkbark/lib';
import { LogQueue } from '@barkbark/LogQueue';

const REGEX_PATTERN = /^"(?<remotehost>\S*)","(?<rfc931>\S*)","(?<authuser>\S*)",(?<date>\d*),"(?<request>.*)",(?<status>\d*),(?<bytes>\d*)$/g;

export class Parser {
  private _liner: LineByLine;
  private _logQueue: LogQueue;
  private _refreshTime: number;

  constructor(filepath: string, logQueue: LogQueue, refreshTime: number) {
    this._liner = new LineByLine(filepath);
    this._logQueue = logQueue;
    this._refreshTime = refreshTime;
  }

  public readLine = (): void => {
    const buffer = this._liner.next();
    if (buffer) {
      const log = this._parseLine(buffer.toString());
      if (log) {
        this._logQueue.enqueue(log);
      }
    }
  };

  public getRefreshTime = (): number => this._refreshTime;

  private _parseLine = (line: string): Log | null => {
    // We need to reset the regex because it is defined locally
    // Otherwise on 2 consecutives exec, the regex will return null on the second run before reseting
    REGEX_PATTERN.lastIndex = 0;
    const match = REGEX_PATTERN.exec(line);
    if (
      match &&
      match.groups &&
      match.groups['remotehost'] &&
      match.groups['rfc931'] &&
      match.groups['authuser'] &&
      match.groups['date'] &&
      match.groups['request'] &&
      match.groups['status'] &&
      match.groups['bytes']
    ) {
      const date = Number.parseInt(match.groups['date']); // We convert seconds into ms
      const status = Number.parseInt(match.groups['status']);
      const bytes = Number.parseInt(match.groups['bytes']);

      return {
        remotehost: match.groups['remotehost'],
        rfc931: match.groups['rfc931'],
        authuser: match.groups['authuser'],
        date,
        request: match.groups['request'],
        status,
        bytes
      };
    }

    return null;
  };
}
