import { Injectable } from '@angular/core';

import { Subtitle } from './subtitle.interface';

@Injectable({
  providedIn: 'root',
})
export class SubtitleService {

  constructor() {
  }

  getSubtitlesFromText(text: string): Subtitle[] {
    const lines = text.trim().split('\n');

    if (!(lines.length > 0)) {
      throw new Error('Invalid text, no lines were found');
    }

    const subtitles: Subtitle[] = [];
    let currentSubtitle: Subtitle = {};

    for (let line of lines) {
      line = line.trim();

      if (line === '') {
        if (currentSubtitle.index !== undefined && currentSubtitle.begin !== undefined
          && currentSubtitle.end !== undefined && currentSubtitle.line1 !== undefined) {
          subtitles.push(currentSubtitle);
        }
        currentSubtitle = {};
        continue;
      }

      if (currentSubtitle.index === undefined) {
        if (isNaN(parseInt(line, 0))) {
          throw new Error('Invalid text, index must be number');
        }
        currentSubtitle.index = line;
        continue;
      }

      if (currentSubtitle.begin === undefined || currentSubtitle.end === undefined) {
        const times = line.split('-->');
        if (times.length !== 2) {
          throw new Error('Invalid text, begin and end times must separated by -->');
        }
        currentSubtitle.begin = times[0].trim();
        currentSubtitle.end = times[1].trim();
        continue;
      }

      if (currentSubtitle.line1 === undefined) {
        currentSubtitle.line1 = line;
        continue;
      }

      if (currentSubtitle.line2 === undefined) {
        currentSubtitle.line2 = line;
      }
    }

    return subtitles;
  }

  getTextFromSubtitles(subtitles: Subtitle[]): string {
    let text = '';

    for (const [i, subtitle] of subtitles.entries()) {
      text += `${i + 1}\n`;
      text += `${subtitle.begin} --> ${subtitle.end}\n`;
      text += `${subtitle.line1}\n`;
      if (subtitle.line2) {
        text += `${subtitle.line2}\n`;
      }
      text += '\n';
    }

    return text;
  }
}
