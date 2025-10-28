import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaxSubmissionService } from '../../services/tax-submission.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-step3',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step3.component.html',
})
export class Step3Component {
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  form: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private taxService: TaxSubmissionService) {
    this.form = this.fb.group({
      referred: ['No', Validators.required],
      referrerName: [''],
      occupation: ['', Validators.required],
      dob: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
    });

    this.form.get('referred')?.valueChanges.subscribe((val) => {
      if (val === 'No') this.form.get('referrerName')?.reset('');
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

    this.loading = true;
    this.errorMessage = '';

    this.taxService.submitStep4(sessionId, this.form.value).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res?.success) {
        
          this.next.emit();
        } else {
          this.errorMessage = res?.message || 'Unexpected response from server';
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage = err.message || 'Server error occurred';
      },
    });
  }
}
