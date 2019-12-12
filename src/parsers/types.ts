import { PathLike } from 'fs';

export enum ParserType {
  CLI = 'cli',
  FILE = 'file'
}

export type ParserOptions = {
  filepath?: PathLike;
};
