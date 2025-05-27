import { Component, computed, input, OnInit, output } from '@angular/core';
import { Task } from '../models/task.model';
import { priorityToIconMap } from '../utilities/priority.icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-task',
  imports: [FontAwesomeModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {

  task = input.required<Task>();
  toggleComplete = output<string>();
  priorityIcon = computed<string>(() => priorityToIconMap.get(this.task().priority || 0) || '');
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
