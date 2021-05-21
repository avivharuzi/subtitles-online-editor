import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { SettingsModalComponent } from './shared/components/settings-modal/settings-modal.component';
import { SettingsService } from './shared/shared/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  bsModalRef?: BsModalRef;

  settingsUpdatedSubscription?: Subscription;

  constructor(
    private bsModalService: BsModalService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.settingsUpdatedSubscription = this.settingsService
      .getSettingsUpdatedObservable()
      .subscribe(() => {
        this.bsModalRef?.hide();
      });
  }

  ngOnDestroy(): void {
    if (this.settingsUpdatedSubscription) {
      this.settingsUpdatedSubscription.unsubscribe();
    }
  }

  openSettingsModalComponent(): void {
    this.bsModalRef = this.bsModalService.show(SettingsModalComponent, {
      class: 'modal-lg',
    });
  }
}
