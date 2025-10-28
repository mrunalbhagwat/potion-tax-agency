import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { TaxSubmissionService } from '../../services/tax-submission.service';

interface DocumentItem {
  label: string;
  key: string; // document_type for API
  file?: File;
  preview?: string;
  status?: 'pending' | 'verified' | 'rejected';
  error?: string;
  expanded?: boolean;
}

@Component({
  selector: 'app-step10',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step10.component.html',
})
export class Step10Component {
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  loading = false;
  errorMessage = '';

  docs: DocumentItem[] = [
    { label: 'Upload Form 1098-T (Attended College Education in 2024?)', key: '1098_t' },
    { label: 'Upload Receipts Or Documentation of Qualified Purchases (Solar Panels, Windows, Heat Pumps)', key: 'qualified_purchase_receipts' },
    { label: 'Upload Purchase Agreement Or Invoice, Manufacturer Certification, Or Form 8936 (If Applicable)', key: 'purchase_agreement' },
    { label: 'Upload Tax Bills Or Payment Receipts (Paid Significant State Or Local Taxes in 2024?)', key: 'state_tax_bills' },
    { label: 'Upload Additional Documents', key: 'additional_documents' },
  ];

  constructor(private taxService: TaxSubmissionService) {}

  /** Handles file selection */
  onFileChange(event: Event, doc: DocumentItem) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    doc.file = file;
    doc.status = 'pending';
    doc.error = '';
    doc.expanded = true;

    const reader = new FileReader();
    reader.onload = () => (doc.preview = reader.result as string);
    reader.readAsDataURL(file);

    // Fake verify animation
    setTimeout(() => {
      doc.status = 'verified';
    }, 1200);
  }

  /** Remove document */
  remove(doc: DocumentItem) {
    doc.file = undefined;
    doc.preview = undefined;
    doc.status = undefined;
    doc.expanded = false;
  }

  /** Submit form with multipart data */
  continue() {
    const sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      this.errorMessage = 'Missing session_id. Please restart from Step 1.';
      return;
    }

    const uploadedDocs = this.docs.filter((d) => d.file);
    if (uploadedDocs.length === 0) {
      this.errorMessage = 'Please upload at least one document.';
      return;
    }

    const formData = new FormData();
    formData.append('session_id', sessionId);

    uploadedDocs.forEach((doc, index) => {
      formData.append(`documents[${index}][document_type]`, doc.key);
      if (doc.file) {
        formData.append(`documents[${index}][file]`, doc.file, doc.file.name);
      }
    });

    this.loading = true;
    this.errorMessage = '';

    this.taxService.uploadStep11Documents(formData).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res?.success) {
          console.log('✅ Step 11 success:', res);
          this.next.emit();
        } else {
          this.errorMessage = res?.message || 'Unexpected server response.';
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        console.error('❌ Upload error:', err);

        if (err.error?.errors) {
          const errors = err.error.errors;
          this.errorMessage = Object.entries(errors)
            .map(([k, v]) => `${k}: ${(v as string[]).join(', ')}`)
            .join(' • ');
        } else {
          this.errorMessage = err.message || 'Server error occurred.';
        }
      },
    });
  }
}
