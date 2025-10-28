import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TaxSubmissionService } from '../../services/tax-submission.service';

@Component({
  selector: 'app-step9',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step9.component.html',
})
export class Step9Component {
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  form: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private taxService: TaxSubmissionService) {
    this.form = this.fb.group({
      is_military_veteran: ['No'],
      energyUpgrade: ['No'],
      hybridVehicle: ['No'],
      stateTaxes: ['No'],
      irsDebt: ['No'],
      referralHelp: ['No'],
      desiredOutcome: [''],
      itinNumber: [''],
      ipPin: [''],
      refundAmount: [''],
    });
  }

  continue() {
    const sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      this.errorMessage = 'Missing session_id. Please restart from Step 1.';
      return;
    }

    const body = {
      session_id: sessionId,
      is_military_veteran: this.form.value.militaryVeteran === 'Yes',
      made_energy_efficient_upgrades: this.form.value.energyUpgrade === 'Yes',
      purchased_electric_vehicle: this.form.value.hybridVehicle === 'Yes',
      paid_state_local_taxes: this.form.value.stateTaxes === 'Yes',
      owes_irs_debt: this.form.value.irsDebt === 'Yes',
      wants_irs_debt_referral: this.form.value.referralHelp === 'Yes',
      desired_tax_outcome: this.form.value.desiredOutcome,
      itin_number: this.form.value.itinNumber,
      identity_protection_pin: this.form.value.ipPin,
      last_year_tax_refund: this.form.value.refundAmount,
    };

    this.loading = true;
    this.errorMessage = '';

    this.taxService.submitAdditionalInfoStep10(body).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res?.success) {
          console.log('✅ Step 10 success:', res);
          this.next.emit();
        } else {
          this.errorMessage = res?.message || 'Unexpected server response';
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        console.error('Step 10 error:', err);
        if (err.error?.errors) {
          const errors = err.error.errors;
          this.errorMessage = Object.entries(errors)
            .map(([key, val]) => `${key}: ${(val as string[]).join(', ')}`)
            .join(' • ');
        } else {
          this.errorMessage = 'Server error occurred. Please try again.';
        }
      },
    });
  }
}
