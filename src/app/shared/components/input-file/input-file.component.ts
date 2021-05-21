import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'app-input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.scss'],
})
export class InputFileComponent {
  @Input() multiple: boolean;
  @Input() defaultLabel: string;
  @Input() defaultLabelMultiple: string;
  // @ts-ignore
  @Input() size: number;
  // @ts-ignore
  @Input() extensions: string[];

  @Output() changedFiles: EventEmitter<{ files: FileList; errors: string[] }>;

  // @ts-ignore
  @ViewChild('fileEl', { static: true }) fileEl: ElementRef;

  files: FileList;
  // @ts-ignore
  label: string;

  constructor() {
    // @ts-ignore
    this.files = null;
    this.multiple = false;
    this.defaultLabel = 'Choose file';
    this.defaultLabelMultiple = 'Choose files';
    this.setLabelToDefault();
    this.changedFiles = new EventEmitter<{
      files: FileList;
      errors: string[];
    }>();
  }

  onChange(): void {
    const htmlFileInput: HTMLInputElement = this.fileEl.nativeElement;
    // @ts-ignore
    this.files = htmlFileInput.files;

    this.setLabelByFileChange();

    const errors = this.getErrorsByFileChange();

    this.changedFiles.emit({ files: this.files, errors });
  }

  private setLabelToDefault(): void {
    this.label = this.multiple ? this.defaultLabelMultiple : this.defaultLabel;
  }

  private setLabelByFileChange(): void {
    if (this.files && this.files.length > 1) {
      this.label = `${this.files.length} files`;
    } else if (this.files.length === 1) {
      // @ts-ignore
      this.label = this.files.item(0).name;
    } else {
      this.label = this.defaultLabel;
    }
  }

  private getErrorsByFileChange(): string[] {
    // @ts-ignore
    const errors = [];

    if (this.files.length > 1 && !this.multiple) {
      errors.push('You need to choose only one file');
      return errors;
    }

    if (this.size === null && this.extensions === null) {
      // @ts-ignore
      return errors;
    }

    if (this.files.length > 0) {
      for (let i = 0; i < this.files.length; i++) {
        // @ts-ignore
        const file: File = this.files.item(i);

        if (typeof this.size === 'number') {
          if (file.size > this.size * 1024 ** 2) {
            errors.push(
              `File ${file.name} size must be less than ${this.size}MB`
            );
          }
        }

        if (this.extensions.length > 0) {
          const extension = `.${file.name.split('.').pop()}`;
          if (!this.extensions.includes(extension)) {
            errors.push(
              `File ${
                file.name
              } extension must be one of these: ${this.extensions.join(', ')}`
            );
          }
        }
      }
    }

    return errors;
  }
}
