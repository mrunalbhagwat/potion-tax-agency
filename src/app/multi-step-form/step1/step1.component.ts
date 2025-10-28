import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxSubmissionService } from '../../services/tax-submission.service'; // adjust path
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-step1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step1.component.html',
})
export class Step1Component {
  @Output() next = new EventEmitter<void>();
  selectedOption: string | null = null;
  loading = false;
  errorMessage = '';

  options = [
    { icon: 'fa-user', label: 'Personal Tax' },
    { icon: 'fa-file-invoice-dollar', label: 'MTD for Income Tax' },
    { icon: 'fa-building', label: 'Company Tax' },
    { icon: 'fa-handshake', label: 'Partnership Tax' },
  ];

  constructor(private taxService: TaxSubmissionService) {}

  continue() {
    if (!this.selectedOption) return;

    this.loading = true;
    this.errorMessage = '';

    this.taxService.submitStep1(this.selectedOption).subscribe({
      next: (res) => {
        this.loading = false;
        if (res?.success && res?.data?.session_id) {
          // Store session_id for later steps
          localStorage.setItem('session_id', res.data.session_id);
          console.log('✅ Step 1 completed, session_id:', res.data.session_id);
          this.next.emit();
        } else {
          this.errorMessage = res?.message || 'Unknown response from server';
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage = err.message || 'Server error occurred';
      },
    });
  }
}
