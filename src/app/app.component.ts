
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  site: any = {
    title: 'Eucalyptus',
    logo: './logo.jpg',
    url: 'https://prottoyfuad.github.io',
    description: [
      'ছায়ারো ছায়াতে সে অন্যজন,',
      'ভরদুপুরে একলা রাতে অন্যমন!'
    ],
    userInfo: [
      'Prottoy Fuad',
      'SWE | Competitive Programmer',
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
  
}
