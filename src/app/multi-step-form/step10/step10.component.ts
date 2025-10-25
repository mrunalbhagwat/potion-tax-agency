import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-step10',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step10.component.html',
})
export class Step10Component {
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  form: FormGroup;
  taxYears = ['2024', '2023', '2022', '2021'];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      taxYear: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  continue() {
    if (this.form.valid) this.next.emit();
    else this.form.markAllAsTouched();
  }
}
