import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DocItem {
  label: string;
  file?: File;
  preview?: string;
  status?: 'pending' | 'verified';
  expanded?: boolean;
}

@Component({
  selector: 'app-step8',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step8.component.html',
})
export class Step8Component {
  @Output() back = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  docs: DocItem[] = [
    { label: 'Upload 1099-NEC (Business Income)' },
    { label: 'Upload Retirement Statements' },
    { label: 'Upload Stocks / Crypto Forms' },
  ];

  onFileChange(event: any, doc: DocItem) {
    const file = event.target.files[0];
    if (!file) return;

    doc.file = file;
    doc.status = 'pending';
    doc.expanded = true;

    const reader = new FileReader();
    reader.onload = () => (doc.preview = reader.result as string);
    reader.readAsDataURL(file);

    setTimeout(() => (doc.status = 'verified'), 1000);
  }

  reupload(doc: DocItem) {
    doc.file = undefined;
    doc.preview = undefined;
    doc.status = undefined;
    doc.expanded = false;
  }

  remove(doc: DocItem) {
    doc.file = undefined;
    doc.preview = undefined;
    doc.status = undefined;
    doc.expanded = false;
  }

  continue() {
    this.next.emit();
  }
}
