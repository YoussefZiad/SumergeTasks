import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoListComponent } from './todo-list/todo-list.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faMinus, faEquals, faArrowUp, faArrowsUpToLine } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TodoListComponent, FontAwesomeModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(iconLibrary: FaIconLibrary){
    iconLibrary.addIcons(faMinus, faEquals, faArrowUp, faArrowsUpToLine);
  }

  title = 'todo-app';
}
