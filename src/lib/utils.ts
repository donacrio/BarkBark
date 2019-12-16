export const formatUniximeToSec = (time: number): number => {
  return time / 1000;
};

export const formatUnixTimeToDate = (time: number): Date => {
  return new Date(time);
};
