import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-step2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step2.component.html',
})
export class Step2Component {
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  selectedYear = '2024-2025';
  years = ['2024-2025', '2023-2024', '2022-2023', '2021-2022'];

  continue() {
    if (this.selectedYear) this.next.emit();
  }
}
