import { Component, OnChanges, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.scss'],
})
export class InputFileComponent implements OnChanges {
  @Input() files: FileList;
  @Input() multiple: boolean;
  @Input() defaultLabel: string;
  @Input() defaultLabelMultiple: string;
  @Input() size: number;
  @Input() extensions: string[];

  @Output() changedFiles: EventEmitter<{ files: FileList, errors: string[] }>;

  @ViewChild('fileEl', { static: true }) fileEl: ElementRef;

  label: string;

  constructor() {
    this.files = null;
    this.multiple = false;
    this.defaultLabel = 'Choose File';
    this.defaultLabelMultiple = 'Choose Files';
    this.setLabelToDefault();
    this.changedFiles = new EventEmitter<{ files: FileList, errors: string[] }>();
  }

  ngOnChanges() {
    if (!this.files) {
      this.reset();
    }
  }

  onChange(): void {
    const htmlFileInput: HTMLInputElement = this.fileEl.nativeElement;
    this.files = htmlFileInput.files;

    this.setLabelByFileChange();

    const errors = this.getErrorsByFileChange();

    this.changedFiles.emit({ files: this.files, errors });
  }

  private setLabelToDefault(): void {
    this.label = this.multiple ? this.defaultLabelMultiple : this.defaultLabel;
  }

  private reset(): void {
    this.files = null;
    this.setLabelToDefault();
    this.fileEl.nativeElement.value = '';
  }

  private setLabelByFileChange(): void {
    if (this.files && this.files.length > 1) {
      this.label = `${this.files.length} files`;
    } else if (this.files.length === 1) {
      this.label = this.files.item(0).name;
    } else {
      this.label = this.defaultLabel;
    }
  }

  private getErrorsByFileChange() {
    const errors = [];

    if (this.files.length > 1 && !this.multiple) {
      errors.push('You need to choose only one file');
      return errors;
    }

    if (this.size === null && this.extensions === null) {
      return errors;
    }

    if (this.files.length > 0) {
      for (let i = 0; i < this.files.length; i++) {
        const file: File = this.files.item(i);

        if (typeof this.size === 'number') {
          if (file.size > this.size * 1024 ** 2) {
            errors.push(`File ${file.name} size must be less than ${this.size}MB`);
          }
        }

        if (this.extensions.length > 0) {
          const extension = `.${file.name.split('.').pop()}`;
          if (!this.extensions.includes(extension)) {
            errors.push(`File ${file.name} extension must be one of these: ${this.extensions.join(', ')}`);
          }
        }
      }
    }

    return errors;
  }
}
