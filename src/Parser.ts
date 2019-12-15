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
      const date = Number.parseInt(match.groups['date']);
      const status = Number.parseInt(match.groups['date']);
      const bytes = Number.parseInt(match.groups['bytes']);

      if (date != NaN && status != NaN && bytes != NaN) {
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
    }

    return null;
  };
}
