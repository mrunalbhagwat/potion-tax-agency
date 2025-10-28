import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxSubmissionService } from '../../services/tax-submission.service';
import { HttpErrorResponse } from '@angular/common/http';

interface DocItem {
  label: string;
  type: string;
  file?: File;
  preview?: string;
  status?: 'pending' | 'verified' | 'rejected';
  error?: string;
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

  loading = false;
  errorMessage = '';

  docs: DocItem[] = [
    { label: 'Upload W-2 Form', type: 'income_documents[]' },
    { label: 'Upload 1099-INT (Interest)', type: 'income_documents[]' },
    { label: 'Upload 1099-DIV (Dividends)', type: 'additional_income_documents[]' },
  ];

  constructor(private taxService: TaxSubmissionService) {}

  // ✅ Handle file upload + preview
  onFileChange(event: any, doc: DocItem) {
    const file = event.target.files[0];
    if (!file) return;

    doc.file = file;
    doc.status = 'pending';
    doc.error = '';
    doc.preview = '';

    const reader = new FileReader();
    reader.onload = () => (doc.preview = reader.result as string);
    reader.readAsDataURL(file);

    // Fake verification status after 1s
    setTimeout(() => {
      const failed = Math.random() < 0.2;
      doc.status = failed ? 'rejected' : 'verified';
      if (failed) doc.error = 'Unreadable document. Please re-upload.';
    }, 1000);
  }

  // ✅ Remove file
  remove(doc: DocItem) {
    doc.file = undefined;
    doc.preview = undefined;
    doc.status = undefined;
    doc.error = '';
  }

  // ✅ Submit form data to backend
  continue() {
    const sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      this.errorMessage = 'Session not found. Please restart the process.';
      return;
    }

    const formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('paid_for_childcare', '1');
    formData.append('has_income_documents', '1');
    formData.append('has_additional_income_documents', '1');

    this.docs.forEach((doc) => {
      if (doc.file) {
        formData.append(doc.type, doc.file);
      }
    });

    this.loading = true;
    this.errorMessage = '';

    this.taxService.submitStep7(formData).subscribe({
      next: (res: any) => {
        this.loading = false;
        console.log('✅ Step 7 Success:', res);
        if (res?.success) this.next.emit();
        else this.errorMessage = res?.message || 'Unexpected server response.';
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        console.error('❌ Step 7 Error:', err);
        this.errorMessage =
          err.error?.message || 'Failed to upload. Please try again.';
      },
    });
  }
}
