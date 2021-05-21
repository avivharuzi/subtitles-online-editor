import { Observable } from 'rxjs';

import { Subtitle } from './subtitle.interface';

export class SubtitleConverter {
  private static readonly srtTagsRegExp: RegExp =
    /<b>|<\/b>|{b}|{\/b}|<i>|<\/i>|{i}|{\/i}|<u>|<\/u>|{u}|{\/u}|<font color=".*">|<font color='.*'>|<\/font>|{\\a.*}/gi;

  private static readonly dashRegExp: RegExp = /^-+|-+$/gm;

  private static readonly spaceBetweenRegExp: RegExp = /\s+/g;

  static getTextFromFile(file: File, encoding: string): Observable<string> {
    return new Observable<string>(subscriber => {
      const fileReader = new FileReader();
      fileReader.onload = (fileLoadedEvent: any) => {
        subscriber.next(fileLoadedEvent.target.result);
        subscriber.complete();
      };
      fileReader.readAsText(file, encoding);
    });
  }

  static getSubtitlesFromText(
    text: string,
    removeTextFormatting: boolean = false
  ): Subtitle[] {
    const lines = text.trim().split('\n');

    if (!(lines.length > 0)) {
      throw new Error('Invalid text, no lines were found');
    }

    // Fix last line because in the loop we always looking for empty line in order to push the subtitle.
    lines.push('');

    const subtitles: Subtitle[] = [];
    let currentSubtitle: Subtitle = {};

    for (const line of lines) {
      const currentLine: string = line.trim();

      if (currentLine === '') {
        if (
          currentSubtitle.index !== undefined &&
          currentSubtitle.begin !== undefined &&
          currentSubtitle.end !== undefined &&
          currentSubtitle.line1 !== undefined
        ) {
          currentSubtitle.isEditable = false;
          subtitles.push(currentSubtitle);
        }
        currentSubtitle = {};
        continue;
      }

      if (currentSubtitle.index === undefined) {
        if (isNaN(parseInt(currentLine, 0))) {
          throw new Error('Invalid text, index must be number');
        }
        currentSubtitle.index = currentLine;
        continue;
      }

      if (
        currentSubtitle.begin === undefined ||
        currentSubtitle.end === undefined
      ) {
        const times = currentLine.split('-->');
        if (times.length !== 2) {
          throw new Error(
            'Invalid text, begin and end times must separated by -->'
          );
        }
        currentSubtitle.begin = times[0].trim();
        currentSubtitle.end = times[1].trim();
        continue;
      }

      if (currentSubtitle.line1 === undefined) {
        currentSubtitle.line1 = this.modifyLine(
          currentLine,
          removeTextFormatting
        );
        continue;
      }

      if (currentSubtitle.line2 === undefined) {
        currentSubtitle.line2 = this.modifyLine(
          currentLine,
          removeTextFormatting
        );
      }
    }

    return subtitles;
  }

  static getTextFromSubtitles(subtitles: Subtitle[]): string {
    let text = '';

    for (const [i, subtitle] of subtitles.entries()) {
      const lineNumber = i + 1;
      text += `${lineNumber}\n`;
      text += `${subtitle.begin} --> ${subtitle.end}\n`;
      text += `${subtitle.line1}\n`;
      if (subtitle.line2) {
        text += `${subtitle.line2}\n`;
      }
      if (subtitles.length !== lineNumber) {
        text += '\n';
      }
    }

    return text;
  }

  private static modifyLine(
    line: string,
    removeTextFormatting: boolean = false
  ): string {
    let modifiedLine = line;

    if (removeTextFormatting) {
      modifiedLine = modifiedLine.replace(this.srtTagsRegExp, '');
      modifiedLine = modifiedLine.trim();
      modifiedLine = modifiedLine.replace(this.dashRegExp, '');
      modifiedLine = modifiedLine.trim();
      modifiedLine = modifiedLine.replace(this.spaceBetweenRegExp, ' ');
    }

    return modifiedLine.trim();
  }
}
