import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      filingWithSpouse: ['No'],
      spouseName: ['']
    });
  }

  continue() {
    if (this.form.valid) {
      this.next.emit();
    }
  }
}
