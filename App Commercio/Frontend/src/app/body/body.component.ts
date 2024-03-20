import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent {
  @Input() isCollapsed!: boolean;
  @Input() COMERCIO!: boolean;
  @Output() toggleSidebar = new EventEmitter<void>();

  // Call this method to emit the event
  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}
