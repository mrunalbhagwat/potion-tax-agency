import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-step1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step1.component.html',
})
export class Step1Component {
  @Output() next = new EventEmitter<void>();
  selectedOption: string | null = null;

  options = [
    { icon: 'fa-user', label: 'Personal Tax' },
    { icon: 'fa-file-invoice-dollar', label: 'MTD for Income Tax' },
    { icon: 'fa-building', label: 'Company Tax' },
    { icon: 'fa-handshake', label: 'Partnership Tax' },
  ];

  continue() {
    if (this.selectedOption) this.next.emit();
  }
}
