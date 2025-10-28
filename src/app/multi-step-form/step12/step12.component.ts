import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaxSubmissionService } from '../../services/tax-submission.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-step12',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step12.component.html',
})
export class Step12Component {
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  form: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private taxService: TaxSubmissionService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile_number: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', Validators.required],
    });
  }

  continue() {
    console.log('Continue clicked ✅');

    if (this.form.invalid) {
      console.warn('Form invalid:', this.form.value);
      this.form.markAllAsTouched();
      return;
    }

    const sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      this.errorMessage = 'Session expired or missing. Please restart the form.';
      return;
    }

    const body = {
      session_id: sessionId,
      name: this.form.value.name,
      email: this.form.value.email,
      mobile_number: this.form.value.mobile_number,
      password: this.form.value.password,
    };

    this.loading = true;
    this.errorMessage = '';

    this.taxService.submitStep12(body).subscribe({
      next: (res: any) => {
        this.loading = false;
        console.log('✅ API Response:', res);
        if (res?.success) {
          this.next.emit();
        } else {
          this.errorMessage = res?.message || 'Unexpected server response.';
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        console.error('❌ API Error:', err);
        this.errorMessage =
          err.error?.message ||
          (typeof err.error === 'object' ? JSON.stringify(err.error) : err.error) ||
          'Server error occurred.';
      },
    });
  }
}
