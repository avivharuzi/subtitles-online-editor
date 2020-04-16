import { Injectable } from '@angular/core';

import { Subtitle } from './subtitle.interface';
import { SubtitleTime } from './subtitle-time';

@Injectable({
  providedIn: 'root',
})
export class SubtitleService {
  private subtitlesFilename: string;
  private subtitles: Subtitle[];
  private originalSubtitles: Subtitle[];

  getSubtitles(): Subtitle[] {
    return this.subtitles;
  }

  setSubtitles(subtitles: Subtitle[]): void {
    // Deep clone, because of reference problems.
    this.subtitles = JSON.parse(JSON.stringify(subtitles));
    this.originalSubtitles = JSON.parse(JSON.stringify(subtitles));
  }

  getSubtitlesFilename(): string {
    return this.subtitlesFilename.replace('.srt', '');
  }

  setSubtitlesFilename(subtitlesFilename: string): void {
    this.subtitlesFilename = subtitlesFilename;
  }

  isInEditMode(): boolean {
    return (this.subtitles && this.subtitles.length > 1) && (this.originalSubtitles && this.originalSubtitles.length > 1);
  }

  toggleSubtitleIsEditable(i: number): void {
    if (!this.isInEditMode()) {
      return;
    }

    this.subtitles[i].isEditable = !this.subtitles[i].isEditable;
  }

  deleteSubtitle(i: number): void {
    if (!this.isInEditMode()) {
      return;
    }

    this.subtitles.splice(i, 1);
  }

  updateSubtitle(i: number, begin: string, end: string, line1: string, line2: string): void {
    if (!this.isInEditMode()) {
      return;
    }

    this.subtitles[i] = {
      begin,
      end,
      line1,
      line2,
      isEditable: false,
    };
  }

  addSubtitleBelow(i, subtitle: Subtitle): void {
    if (!this.isInEditMode()) {
      return;
    }

    const begin = SubtitleTime.getTimePlus(subtitle.end, 1);
    const subtitleBelow = this.subtitles[i + 1];
    let end;

    if (subtitleBelow) {
      end = SubtitleTime.getTimeMinus(subtitleBelow.begin, 1);
    } else {
      end = SubtitleTime.getTimePlus(begin, 1);
    }

    this.subtitles.splice(i + 1, 0, { begin, end, isEditable: true });
  }

  resync(ms: number): void {
    if (!this.isInEditMode()) {
      return;
    }

    if (isNaN(ms) || ms === 0) {
      return;
    }

    this.subtitles = this.subtitles.map((subtitle: Subtitle) => {
      if (ms > 0) {
        subtitle.begin = SubtitleTime.getTimePlus(subtitle.begin, ms);
        subtitle.end = SubtitleTime.getTimePlus(subtitle.end, ms);
      } else {
        subtitle.begin = SubtitleTime.getTimeMinus(subtitle.begin, Math.abs(ms));
        subtitle.end = SubtitleTime.getTimeMinus(subtitle.end, Math.abs(ms));
      }

      return subtitle;
    });
  }

  getSubtitleTimePlus(t: string, n: number): string {
    return SubtitleTime.getTimePlus(t, n);
  }

  getSubtitleTimeMinus(t: string, n: number): string {
    return SubtitleTime.getTimeMinus(t, n);
  }

  openAllSubtitlesEdit(): void {
    this.updateAllSubtitlesEdit(true);
  }

  closeAllSubtitlesEdit(): void {
    this.updateAllSubtitlesEdit(false);
  }

  resetEdits(): void {
    if (!this.isInEditMode()) {
      return;
    }

    // Deep clone, because of reference problems.
    this.subtitles = JSON.parse(JSON.stringify(this.originalSubtitles));
  }

  resetSubtitles(): void {
    this.subtitles = null;
    this.originalSubtitles = null;
    this.subtitlesFilename = null;
  }

  private updateAllSubtitlesEdit(isEditable: boolean): void {
    if (!this.isInEditMode()) {
      return;
    }

    this.subtitles = this.subtitles.map((subtitle: Subtitle) => {
      subtitle.isEditable = isEditable;
      return subtitle;
    });
  }
}