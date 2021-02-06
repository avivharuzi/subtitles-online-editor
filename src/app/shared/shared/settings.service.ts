import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { SubtitleService } from '../../subtitles/shared/subtitle.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly ITEM_SUBTITLE_ENCODING_SETTING: string = 'SUBTITLE_ENCODING_SETTING';
  private readonly ITEM_SUBTITLE_ENCODING_EXPORT_SETTING: string = 'SUBTITLE_ENCODING_EXPORT_SETTING';
  private readonly ITEM_REMOVE_TEXT_FORMATTING_SETTING: string = 'REMOVE_TEXT_FORMATTING_SETTING';

  private readonly DEFAULT_ENCODING: string = 'UTF-8';

  private subtitleEncoding: string;
  private subtitleEncodingExport: string;
  private removeTextFormatting: boolean;

  private settingsUpdated: Subject<void>;

  constructor(
    private subtitleService: SubtitleService,
  ) {
    this.setSubtitleEncoding(localStorage.getItem(this.ITEM_SUBTITLE_ENCODING_SETTING));
    this.setSubtitleEncodingExport(localStorage.getItem(this.ITEM_SUBTITLE_ENCODING_EXPORT_SETTING));
    let removeTextFormatting;
    try {
      removeTextFormatting = localStorage.getItem(this.ITEM_REMOVE_TEXT_FORMATTING_SETTING)
        ? !!JSON.parse(localStorage.getItem(this.ITEM_REMOVE_TEXT_FORMATTING_SETTING)) : null;
    } catch (e) {
      removeTextFormatting = null;
    }
    this.setRemoveTextFormatting(removeTextFormatting);
    this.settingsUpdated = new Subject<void>();
  }

  getSubtitleEncoding(): string {
    return this.subtitleEncoding;
  }

  setSubtitleEncoding(subtitleEncoding: string): void {
    if (subtitleEncoding === null || !this.subtitleService.isEncodingValid(subtitleEncoding)) {
      subtitleEncoding = this.DEFAULT_ENCODING;
    }
    this.subtitleEncoding = subtitleEncoding;
    localStorage.setItem(this.ITEM_SUBTITLE_ENCODING_SETTING, this.subtitleEncoding);
  }

  getSubtitleEncodingExport(): string {
    return this.subtitleEncodingExport;
  }

  setSubtitleEncodingExport(subtitleEncodingExport: string): void {
    if (subtitleEncodingExport === null || !this.subtitleService.isEncodingValid(subtitleEncodingExport)) {
      subtitleEncodingExport = this.DEFAULT_ENCODING;
    }
    this.subtitleEncodingExport = subtitleEncodingExport;
    localStorage.setItem(this.ITEM_SUBTITLE_ENCODING_EXPORT_SETTING, this.subtitleEncodingExport);
  }

  getRemoveTextFormatting(): boolean {
    return this.removeTextFormatting;
  }

  setRemoveTextFormatting(removeTextFormatting: boolean): void {
    if (removeTextFormatting === null) {
      removeTextFormatting = false;
    }
    this.removeTextFormatting = removeTextFormatting;
    localStorage.setItem(this.ITEM_REMOVE_TEXT_FORMATTING_SETTING, `${this.removeTextFormatting}`);
  }

  getSettingsUpdatedObservable(): Observable<void> {
    return this.settingsUpdated.asObservable();
  }

  emitSettingsUpdated(): void {
    this.settingsUpdated.next();
  }
}
