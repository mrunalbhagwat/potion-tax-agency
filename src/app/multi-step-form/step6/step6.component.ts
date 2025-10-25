import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DocItem {
  label: string;
  file?: File;
  preview?: string;
  status?: 'pending' | 'verified' | 'rejected';
  error?: string;
  expanded?: boolean;
}

@Component({
  selector: 'app-step6',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step6.component.html',
})
export class Step6Component {
  @Output() back = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  docs: DocItem[] = [
    { label: 'Upload W-2 Form' },
    { label: 'Upload 1099-INT (Interest)' },
    { label: 'Upload 1099-DIV (Dividends)' },
  ];

  onFileChange(event: any, doc: DocItem) {
    const file = event.target.files[0];
    if (!file) return;

    doc.file = file;
    doc.status = 'pending';
    doc.error = '';
    doc.expanded = true;

    const reader = new FileReader();
    reader.onload = () => (doc.preview = reader.result as string);
    reader.readAsDataURL(file);

    // fake verification
    setTimeout(() => {
      const fail = Math.random() < 0.3;
      doc.status = fail ? 'rejected' : 'verified';
      if (fail) doc.error = 'Unreadable document. Please re-upload.';
    }, 1200);
  }

  reupload(doc: DocItem) {
    doc.file = undefined;
    doc.preview = undefined;
    doc.status = undefined;
    doc.error = '';
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
