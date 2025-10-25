import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup,FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-step9',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step9.component.html',

})
export class Step9Component {
  @Output() back = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      claimingDependants: ['No'],
      dependants: this.fb.array([])
    });
  }

  get dependants(): FormArray<FormGroup> {
    return this.form.get('dependants') as FormArray<FormGroup>;
  }


  // Add a new dependant group
  addDependant() {
    const dependant = this.fb.group({
      name: ['', Validators.required],
      relation: ['', Validators.required],
      age: ['']
    });
    this.dependants.push(dependant);
  }

  // Remove dependant by index
  removeDependant(index: number) {
    this.dependants.removeAt(index);
  }

  // Continue to next step
  continue() {
    if (this.form.valid) {
      this.next.emit();
    }
  }
}
