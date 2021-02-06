export class SubtitleTime {
  private static readonly charsToRemove = /[:,]/g;

  static getTimePlus(time: string, n: number): string {
    return this.isTimeValid(time) ? this.getTime(this.getMs(time) + n) : time;
  }

  static getTimeMinus(time: string, n: number): string {
    return this.isTimeValid(time) ? this.getTime(this.getMs(time) - n) : time;
  }

  private static isTimeValid(time: string): boolean {
    return time.length === 12;
  }

  private static getMs(time: string): number {
    const times = time.split(this.charsToRemove);
    const hh = +times[0];
    const mm = +times[1];
    const ss = +times[2];
    const ms = +times[3];

    return ms + (ss * 1000) + (mm * 60 * 1000) + (hh * 60 * 60 * 1000);
  }

  private static getTime(n: number): string {
    if (n < 0) {
      n = 0;
    }

    const ms = n % 1000;
    n = (n - ms) / 1000;
    const seconds = n % 60;
    n = (n - seconds) / 60;
    const minutes = n % 60;
    const hours = (n - minutes) / 60;

    return this.pad(hours) + ':' + this.pad(minutes) + ':' + this.pad(seconds) + ',' + this.pad(ms, 3);
  }

  private static pad(n: number, z?: number): string {
    z = z || 2;

    return ('00' + n).slice(-z);
  }
}
