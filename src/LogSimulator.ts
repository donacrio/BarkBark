import fs from 'fs';
import { Log } from '@barkbark/lib';

export class LogSimulator {
  private _requestMethods = ['GET', 'PUT', 'POST', 'HEAD', 'OPTIONS'];
  private _requestSections = ['/', '/api', '/report', '/admin'];
  private _outputFile: string;
  private _refreshTime: number;

  constructor(outputFile: string, refreshTime: number) {
    this._outputFile = outputFile;
    this._refreshTime = refreshTime;
    fs.writeFileSync(this._outputFile, '');
    this.writeLogLine(this._outputFile, '"remotehost","rfc931","authuser","date","request","status","bytes"');
  }
  public write = (): void => {
    const numberOfLogs = Math.round(Math.random());
    const date = this._generateDateInSec();
    for (let i = 0; i < numberOfLogs; i++) {
      this.writeLogLine(this._outputFile, this.generateLogLine(date));
    }
  };

  public generateLogLine = (date: number): string =>
    `"localhost","-","apache",${date},"${this._generateRequest()}",${this._generateStatusCode()},${this.generateBytesSize()}`;

  public writeLogLine = (outputFile: string, line: string): void => {
    fs.appendFileSync(outputFile, `${line}\n`);
  };

  public createAlertingLogicTestSimulation = (outputFile: string): void => {
    fs.writeFileSync(outputFile, '');
    this.writeLogLine(outputFile, '"remotehost","rfc931","authuser","date","request","status","bytes"');
    let date = Math.round(Date.now() / 1000);
    for (let i = 0; i < 1000; i++) {
      date += 1;
      this.writeLogLine(
        outputFile,
        `"localhost","-","apache",${Math.floor(
          date
        )},"${this._generateRequest()}",${this._generateStatusCode()},${this.generateBytesSize()}`
      );
    }
    for (let i = 0; i < 2000; i++) {
      date += 0.05;
      this.writeLogLine(
        outputFile,
        `"localhost","-","apache",${Math.floor(
          date
        )},"${this._generateRequest()}",${this._generateStatusCode()},${this.generateBytesSize()}`
      );
    }
    for (let i = 0; i < 5000; i++) {
      date += 1;
      this.writeLogLine(
        outputFile,
        `"localhost","-","apache",${Math.floor(
          date
        )},"${this._generateRequest()}",${this._generateStatusCode()},${this.generateBytesSize()}`
      );
    }
  };

  public getRefreshTime = (): number => this._refreshTime;

  private _generateDateInSec = (): number => Math.floor(Date.now() / 1000);

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
