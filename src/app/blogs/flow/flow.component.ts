import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-flow',
  standalone: true,
  imports: [],
  templateUrl: './flow.component.html',
  styleUrl: './flow.component.scss'
})
export class FlowComponent {
  @Input() view: string = 'app-flow';
  @Input() parentView: string = '';
  @Output() viewChange = new EventEmitter<string>();

  changeView(view: string) {
    this.view = view;
    this.viewChange.emit(this.view);
  }
}
