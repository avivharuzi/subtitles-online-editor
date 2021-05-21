import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InputFileComponent } from './components/input-file/input-file.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SettingsModalComponent } from './components/settings-modal/settings-modal.component';

@NgModule({
  declarations: [InputFileComponent, SettingsComponent, SettingsModalComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  entryComponents: [SettingsModalComponent],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputFileComponent,
    SettingsModalComponent,
  ],
})
export class SharedModule {}
