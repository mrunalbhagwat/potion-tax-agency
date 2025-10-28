import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TaxSubmissionService } from '../../services/tax-submission.service';

@Component({
  selector: 'app-step7',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step7.component.html',
})
export class Step7Component {
  @Output() back = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  form: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private taxService: TaxSubmissionService) {
    this.form = this.fb.group({
      hasBusiness: ['No', Validators.required],
      businessName: [''],
      businessEIN: [''],
    });

    // 👇 Watch changes and update validators dynamically
    this.form.get('hasBusiness')?.valueChanges.subscribe((value) => {
      const businessNameControl = this.form.get('businessName');
      const businessEINControl = this.form.get('businessEIN');

      if (value === 'Yes') {
        businessNameControl?.setValidators([Validators.required]);
        businessEINControl?.setValidators([]);
      } else {
        businessNameControl?.clearValidators();
        businessEINControl?.clearValidators();
      }

      businessNameControl?.updateValueAndValidity();
      businessEINControl?.updateValueAndValidity();
    });
  }

  continue() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      this.errorMessage = 'Missing session. Please go back to Step 1.';
      return;
    }

    const payload = {
      session_id: sessionId,
      has_business: this.form.value.hasBusiness === 'Yes',
      business_name: this.form.value.businessName || '',
      business_ein: this.form.value.businessEIN || '',
    };

    this.loading = true;
    this.errorMessage = '';

    this.taxService.submitStep8(payload).subscribe({
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
        this.errorMessage = err.error?.message || 'Server error occurred';
      },
    });
  }
}
