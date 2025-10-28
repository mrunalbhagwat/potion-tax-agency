import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaxSubmissionService } from '../../services/tax-submission.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-step2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step2.component.html',
})
export class Step2Component {
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  selectedYear = '2024-2025';
  years = ['2024-2025', '2023-2024', '2022-2023', '2021-2022'];

  loading = false;
  errorMessage = '';

  constructor(private taxService: TaxSubmissionService) {}

  continue() {
    const sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      this.errorMessage = 'Missing session. Please go back to Step 1.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.taxService.submitStep2(sessionId, this.selectedYear).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res?.success) this.next.emit();
        else this.errorMessage = res?.message || 'Unexpected server response';
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage = err.message || 'Server error occurred';
      },
    });
  }
}
