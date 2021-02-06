import { Component, Renderer2 } from '@angular/core';

import { SUBTITLE_ENCODINGS } from '../../../subtitles/shared/subtitle-encodings';
import { SubtitleConverter } from '../../../subtitles/shared/subtitle-converter';
import { SubtitleEncoding } from '../../../subtitles/shared/subtitle-encoding.interface';
import { SubtitleService } from '../../../subtitles/shared/subtitle.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  subtitleEncodings: SubtitleEncoding[];
  subtitleEncodingSelected: string;
  subtitleEncodingExportSelected: string;
  removeTextFormatting: boolean;
  file: File;
  errors: string[];

  constructor(
    public subtitleService: SubtitleService,
    private renderer: Renderer2,
  ) {
    this.subtitleEncodings = SUBTITLE_ENCODINGS;
    this.subtitleEncodingSelected = 'UTF-8';
    this.subtitleEncodingExportSelected = 'UTF-8';
    this.removeTextFormatting = false;
  }

  onChangedFiles({ files, errors }: { files: FileList, errors: string[] }): void {
    this.errors = errors;

    if (errors.length === 0 && files.length > 0) {
      this.file = files.item(0);
    } else {
      this.file = null;
    }
  }

  startEdit(): void {
    if (!this.file) {
      return;
    }

    SubtitleConverter.getTextFromFile(this.file, this.subtitleEncodingSelected).subscribe(text => {
      try {
        const subtitles = SubtitleConverter.getSubtitlesFromText(text, this.removeTextFormatting);
        this.subtitleService.setSubtitles(subtitles);
        this.subtitleService.setSubtitlesFilename(this.file.name);
        this.file = null;
        this.errors = null;
      } catch (e) {
        this.errors = [e];
      }
    });
  }

  download(filename: string): void {
    if (!this.subtitleService.isInEditMode()) {
      return;
    }

    if (!filename) {
      return;
    }

    const text = SubtitleConverter.getTextFromSubtitles(this.subtitleService.getSubtitles());

    const element = this.renderer.createElement('a');
    this.renderer.setAttribute(element, 'href', `data:text/plain;charset=${this.subtitleEncodingExportSelected},`
      + encodeURIComponent(text));
    this.renderer.setAttribute(element, 'download', `${filename}.srt`);
    this.renderer.setStyle(element, 'display', 'none');
    this.renderer.appendChild(document.body, element);
    element.click();
    this.renderer.removeChild(document.body, element);
  }
}
