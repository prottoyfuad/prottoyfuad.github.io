import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { marked } from 'marked';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
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

  markdownContent: string = "";
  htmlContent: string = "";

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.httpClient.get('flow.md', { responseType: 'text' })
      .subscribe({
        next: (markdown: string) => {
          this.markdownContent = markdown; // Store raw markdown content
          this.htmlContent = marked(markdown).toString(); // Convert Markdown to HTML
        },
        error: (err) => {
          console.error('Error loading Markdown file', err);
        }
      });
  }
  
}
