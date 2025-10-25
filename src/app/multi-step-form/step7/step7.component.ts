import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-step7',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step7.component.html',
})
export class Step7Component {
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      claimingDependents: ['No', Validators.required],
      businessName: ['', Validators.required],
      businessEIN: [''],
    });
  }

  continue() {
    if (this.form.valid) {
      console.log(this.form.value);
      this.next.emit();
    } else {
      this.form.markAllAsTouched();
    }
  }
}
