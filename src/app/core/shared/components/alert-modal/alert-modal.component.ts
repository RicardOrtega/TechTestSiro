import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-alert-modal',
  imports: [CommonModule],
  templateUrl: './alert-modal.component.html',
  standalone: true,
  styleUrl: './alert-modal.component.css'
})
export class AlertModalComponent {
  @Input() show: boolean = false;
  @Input() message: string = '';
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
