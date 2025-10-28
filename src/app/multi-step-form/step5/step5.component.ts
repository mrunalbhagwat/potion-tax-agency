import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { TaxSubmissionService } from '../../services/tax-submission.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-step5',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step5.component.html',
})
export class Step5Component {
  @Output() back = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  form: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private taxService: TaxSubmissionService) {
    this.form = this.fb.group({
      claimingDependants: ['No'],
      dependants: this.fb.array([]),
    });

    // Reset dependants when "No" is selected
    this.form.get('claimingDependants')?.valueChanges.subscribe((val) => {
      if (val === 'No') {
        this.dependants.clear();
      }
    });
  }

  get dependants(): FormArray<FormGroup> {
    return this.form.get('dependants') as FormArray<FormGroup>;
  }

  addDependant() {
    const dependant = this.fb.group({
      fullName: ['', Validators.required],
      occupation: ['', Validators.required],
      dob: [''],
    });
    this.dependants.push(dependant);
  }

  removeDependant(index: number) {
    this.dependants.removeAt(index);
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

    this.taxService.submitStep6(sessionId, this.form.value).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res?.success) {
          console.log('✅ Step 6 success:', res);
          this.next.emit();
        } else {
          this.errorMessage = res?.message || 'Unexpected server response';
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage = err.message || 'Server error occurred';
      },
    });
  }
}
