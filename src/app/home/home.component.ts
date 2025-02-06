import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  @Input() view: string = 'app-home';
  @Output() viewChange = new EventEmitter<string>();

  changeView(view: string) {
    this.view = view;
    this.viewChange.emit(this.view);
  }
}
