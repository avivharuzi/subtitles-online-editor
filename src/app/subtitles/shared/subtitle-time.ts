export class SubtitleTime {
  private static readonly charsToRemove = /:|,/g;

  static getTimePlus(time: string, n: number): string {
    return this.getTime(+time.replace(this.charsToRemove, '') + n);
  }

  static getTimeMinus(time: string, n: number): string {
    return this.getTime(+time.replace(this.charsToRemove, '') - n);
  }

  private static getTime(n: number): string {
    let s = n.toString();
    if (s.length !== 9) {
      s = '0'.repeat(9 - s.length) + s;
    }
    return `${s[0]}${s[1]}:${s[2]}${s[3]}:${s[4]}${s[5]},${s[6]}${s[7]}${s[8]}`;
  }
}
