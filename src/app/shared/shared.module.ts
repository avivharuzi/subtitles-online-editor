import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputFileComponent } from './components/input-file/input-file.component';
import { SettingsModalComponent } from './components/settings-modal/settings-modal.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [InputFileComponent, SettingsModalComponent, SettingsComponent],
  imports: [CommonModule, ReactiveFormsModule],
  entryComponents: [SettingsModalComponent],
  exports: [InputFileComponent, SettingsModalComponent],
})
export class SharedModule {}
