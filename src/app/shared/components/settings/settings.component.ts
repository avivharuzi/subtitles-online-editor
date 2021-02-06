import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { SettingsService } from '../../shared/settings.service';
import { SUBTITLE_ENCODINGS } from '../../../subtitles/shared/subtitle-encodings';
import { SubtitleEncoding } from '../../../subtitles/shared/subtitle-encoding.interface';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  subtitleEncodings: SubtitleEncoding[];
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private settingsService: SettingsService,
  ) {
    this.subtitleEncodings = SUBTITLE_ENCODINGS;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      subtitleEncodingSelected: [this.settingsService.getSubtitleEncoding()],
      subtitleEncodingExportSelected: [this.settingsService.getSubtitleEncodingExport()],
      removeTextFormatting: [this.settingsService.getRemoveTextFormatting()],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.settingsService.setSubtitleEncoding(this.form.value.subtitleEncodingSelected);
    this.settingsService.setSubtitleEncodingExport(this.form.value.subtitleEncodingExportSelected);
    this.settingsService.setRemoveTextFormatting(this.form.value.removeTextFormatting);

    this.settingsService.emitSettingsUpdated();
  }
}
