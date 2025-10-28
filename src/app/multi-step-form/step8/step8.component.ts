import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxSubmissionService } from '../../services/tax-submission.service';
import { HttpErrorResponse } from '@angular/common/http';

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

  loading = false;
  errorMessage = '';

  docs: DocItem[] = [
    { label: 'Upload 1099-NEC (Business Income)' },
    { label: 'Upload Retirement Statements' },
    { label: 'Upload Stocks / Crypto Forms' },
  ];

  constructor(private taxService: TaxSubmissionService) {}

  onFileChange(event: Event, doc: DocItem) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    doc.file = file;
    doc.status = 'pending';
    doc.expanded = true;
    doc.preview = undefined;

    const reader = new FileReader();
    reader.onload = () => (doc.preview = reader.result as string);
    reader.readAsDataURL(file);
  }

  reupload(doc: DocItem) {
    doc.file = undefined;
    doc.preview = undefined;
    doc.status = undefined;
    doc.expanded = false;
  }

  remove(doc: DocItem) {
    this.reupload(doc);
  }

  continue() {
    this.errorMessage = '';
    const sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      this.errorMessage = 'Missing session_id — restart from Step 1.';
      return;
    }

    const uploadedDocs = this.docs.filter((d) => d.file);
    if (uploadedDocs.length === 0) {
      this.errorMessage = 'Please upload at least one document to continue.';
      return;
    }

    this.loading = true;

    this.taxService.uploadBusinessDocumentsStep9(sessionId, uploadedDocs).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res?.success) {
          this.next.emit();
        } else {
          this.errorMessage = res?.message || 'Unexpected server response';
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        console.error('Step9 upload error:', err);
        if (err.error?.errors) {
          const errors = err.error.errors;
          this.errorMessage = Object.entries(errors)
            .map(([k, v]) => `${k}: ${(v as string[]).join(', ')}`)
            .join(' • ');
        } else if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Upload failed. Please try again.';
        }
      },
    });
  }
}
