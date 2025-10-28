import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaxSubmissionService } from '../../services/tax-submission.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-step4',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step4.component.html',
})
export class Step4Component {
  @Output() back = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  form: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private taxService: TaxSubmissionService) {
    this.form = this.fb.group({
      filingWithSpouse: ['No', Validators.required],
      spouseFullName: [''],
      spouseOccupation: [''],
      dob: [''],
    });

    // Reset spouse fields if user selects "No"
    this.form.get('filingWithSpouse')?.valueChanges.subscribe((val) => {
      if (val === 'No') {
        this.form.patchValue({
          spouseFullName: '',
          spouseOccupation: '',
          dob: '',
        });
      }
    });
  }

  continue() {
    const sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      this.errorMessage = 'Missing session. Please go back to Step 1.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.taxService.submitStep5(sessionId, this.form.value).subscribe({
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
