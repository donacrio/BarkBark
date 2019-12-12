import { Log } from '@barkbark/types';
import { Queue } from '@barkbark/Queue';
import LineByLine from 'n-readlines';

const REGEX_PATTERN = /^"(?<remotehost>\S*)","(?<rfc931>\S*)","(?<authuser>\S*)",(?<date>\d*),"(?<request>.*)",(?<status>\d*),(?<bytes>\d*)$/g;
export class Parser {
  private liner: LineByLine;
  private queue: Queue<Log>;

  constructor(filepath: string, queue: Queue<Log>) {
    this.liner = new LineByLine(filepath);
    this.queue = queue;
  }

  public readLine = (): void => {
    const buffer = this.liner.next();
    if (buffer) {
      const log = this.parseLine(buffer.toString());
      if (log) {
        this.queue.enqueue(log);
      }
    }
  };

  private parseLine = (line: string): Log | null => {
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
      return {
        remotehost: match.groups['remotehost'],
        rfc931: match.groups['rfc931'],
        authuser: match.groups['authuser'],
        date: Number.parseInt(match.groups['date']),
        request: match.groups['request'],
        status: Number.parseInt(match.groups['status']),
        bytes: Number.parseInt(match.groups['bytes'])
      };
    }
    return null;
  };
}
