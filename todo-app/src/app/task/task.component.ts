import { Component, computed, input, OnInit, output } from '@angular/core';
import { Task } from '../models/task.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PriorityIconPipe } from "../pipes/priority-icon.pipe";

@Component({
  selector: 'app-task',
  imports: [FontAwesomeModule, PriorityIconPipe],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {

  task = input.required<Task>();
  toggleComplete = output<string>();
  isUpdating = input<boolean>(false);
  isCreating = computed<boolean>(() => this.task().id === '');
  searchTerm = input<string>('');

  get actionAllowed(): boolean {
    return !this.isUpdating() && !this.isCreating();
  }

  isSearchMatch(): boolean {
    if (!this.searchTerm()) {
      return false;
    }
    const searchTermLC = this.searchTerm().toLowerCase();
    return this.task().name.toLowerCase().includes(searchTermLC);
  }
  
  onToggleCompleteness(){
    this.toggleComplete.emit(this.task().id);
  }

}
