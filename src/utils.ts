export const waitFor = (condition: boolean): Promise<void> => {
  return new Promise(resolve => {
    const checkFlag = (): void => {
      if (condition) {
        resolve();
      } else {
        window.setTimeout(checkFlag, 1000);
      }
    };
    checkFlag();
  });
};
