import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { SettingsModalComponent } from './shared/components/settings-modal/settings-modal.component';
import { SettingsService } from './shared/shared/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  bsModalRef: BsModalRef;

  constructor(private bsModalService: BsModalService, private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.settingsService.getSettingsUpdatedObservable().subscribe(() => {
      this.bsModalRef.hide();
    });
  }

  openSettingsModalComponent(): void {
    this.bsModalRef = this.bsModalService.show(SettingsModalComponent, { class: 'modal-lg' });
  }
}
