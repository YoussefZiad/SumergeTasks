import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TodoListComponent } from './todo-list/todo-list.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faMinus, faEquals, faArrowUp, faArrowsUpToLine } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FontAwesomeModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);

  constructor(iconLibrary: FaIconLibrary){
    iconLibrary.addIcons(faMinus, faEquals, faArrowUp, faArrowsUpToLine);
  }

  ngOnInit(): void {
    const alreadyLoggedIn = this.authService.autoLogin();

    if(alreadyLoggedIn){
      this.router.navigate(['/todo']);
    }
  }

  title = 'todo-app';
}
