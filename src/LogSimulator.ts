import fs from 'fs';
import { Log } from '@barkbark/lib';

export class LogSimulator {
  private _requestMethods = ['GET', 'PUT', 'POST', 'HEAD', 'OPTIONS'];
  private _requestSections = ['/', '/api', '/report', '/admin'];
  private _outputFile: string;

  constructor(outputFile: string) {
    this._outputFile = outputFile;
    fs.writeFileSync(this._outputFile, '');
    this.writeLogLine('"remotehost","rfc931","authuser","date","request","status","bytes"');
  }
  public write = (): void => this.writeLogLine(this.generateLogLine());

  public generateLogLine = (): string =>
    `"localhost","-","apache",${this._generateDate()},"${this._generateRequest()}",${this._generateStatusCode()},${this.generateBytesSize()}`;

  public writeLogLine = (line: string): void => {
    fs.appendFileSync(this._outputFile, `${line}\n`);
  };

  private _generateDate = (): number => Date.now();

  private _generateRequest = () => {
    const requestMethod = this._requestMethods[Math.floor(Math.random() * this._requestMethods.length)];
    const requestUrl = this._generateUrl();
    return `${requestMethod} ${requestUrl} HTTP/1.0`;
  };

  private _generateStatusCode = (): number => {
    const random = Math.random();
    if (random < 0.1) {
      return 500;
    }
    if (random > 0.9) {
      return 404;
    }
    return 200;
  };

  private generateBytesSize = () => Math.floor(Math.random() * 1500);

  private _generateUrl = (): string => {
    const sections = [this._requestSections[Math.floor(Math.random() * this._requestSections.length)]];
    if (sections[0] != '/') {
      sections.push(this._generateSubUrl());
    }

    return sections.join('/');
  };

  private _generateSubUrl = (): string => {
    const depth = Math.floor(Math.random() * 3);
    if (depth == 0) {
      return '';
    }
    const urls: string[] = [];
    for (let i = 0; i < depth; i++) {
      urls.push(this._generateString(5));
    }
    return urls.join('/');
  };

  private _generateString = (length: number): string =>
    [...Array(length)].map(_i => (~~(Math.random() * 36)).toString(36)).join('');
}
