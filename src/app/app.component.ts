
import { Component } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { FlowComponent } from './blogs/flow/flow.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HomeComponent,
    FlowComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  view: string = 'app-home';
  site: any = {
    title: 'Eucalyptus',
    logo: './logo.jpg',
    url: 'https://prottoyfuad.github.io',
    description: [
      'ছায়ারও ছায়াতে সে অন্যজন,',
      'ভরদুপুরে একলা রাতে অন্যমন!'
    ],
    userInfo: [
      'Prottoy Fuad',
      'Competitive Programmer',
      'Chittagong, Bangladesh'
    ]
  }
  git: any = {
    username: 'prottoyfuad',
    fullName: 'Prottoy Fuad',
    url: 'https://github.com/prottoyfuad',
    repo: 'prottoyfuad',
    repoUrl: 'https://github.com/prottoyfuad/prottoyfuad/tree/angular',
    nwo: 'prottoyfuad/prottoyfuad'
  }

  changeView(view: string) {
    this.view = view;
  }
}
