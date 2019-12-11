export class BarkBarkApp {
  private static counter: number = 0;

  run() {
    setInterval(() => console.log(`Counter is ${BarkBarkApp.counter++}\r`), 1000);
  }
}
