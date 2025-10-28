import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { TaxSubmissionService } from '../../services/tax-submission.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-step11',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step11.component.html',
})
export class Step11Component {
  @Output() back = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  form: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private taxService: TaxSubmissionService) {
    this.form = this.fb.group({
      claimingDependants: ['No', Validators.required],
      dependants: this.fb.array([]),
    });
  }

  get dependants(): FormArray<FormGroup> {
  return this.form.get('dependants') as FormArray<FormGroup>;
}

  addDependant() {
    const group = this.fb.group({
      fullName: ['', Validators.required],
      number: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
    });
    this.dependants.push(group);
  }

  removeDependant(index: number) {
    this.dependants.removeAt(index);
  }

  continue() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      this.errorMessage = 'Missing session_id. Please restart from Step 1.';
      return;
    }

    const hasReferrals = this.form.value.claimingDependants === 'Yes';
    const payload: any = {
      session_id: sessionId,
      will_refer_friends: hasReferrals,
      referrals: [],
    };

    if (hasReferrals) {
      payload.referrals = this.dependants.value.map((dep: any) => ({
        full_name: dep.fullName,
        phone_number: dep.number,
      }));
    }

    this.loading = true;
    this.errorMessage = '';

    this.taxService.submitStep12Referral(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res?.success) {
          this.next.emit();
        } else {
          this.errorMessage = res?.message || 'Unexpected server response.';
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
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
