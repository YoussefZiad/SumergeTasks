import { ChangeDetectorRef, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { Task } from '../models/task.model';
import { HttpClient } from '@angular/common/http';
import { TaskService } from '../services/task.service';
import { TaskComponent } from '../task/task.component';
import { AddTaskComponent } from '../add-task/add-task.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-todo-list',
  imports: [HeaderComponent, TaskComponent, AddTaskComponent, ReactiveFormsModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent implements OnInit{
  
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  pendingTasks = this.taskService.pendingTasks.asReadonly();
  completedTasks = this.taskService.completedTasks.asReadonly();
  filteredPendingTasks = computed(() => this.pendingTasks().filter(this.filterFn()));
  filteredCompletedTasks = computed(() => this.completedTasks().filter(this.filterFn()));
  fetchingTasks = signal<boolean>(true);
  fetchingTasksError = signal<string>('');
  destroyRef = inject(DestroyRef);
  isUpdating = signal<string>('');
  searchTerm = new FormControl<string>('');
  searchTermSig = signal<string>('');
  filterDropdown = new FormControl<'None' | 'My Tasks' | 'Search Results'>('None');
  filterFn = signal<(task: Task) => boolean>((task: Task) => true);

  ngOnInit(): void {
    const loadTasksSubscription = this.taskService.loadTasks().subscribe({
        error: (err) => {
          this.fetchingTasksError.set('Failed to load tasks, please try again later.');
          console.error('Failed to load tasks', err);
        },
        complete: () => {
          this.fetchingTasks.set(false);
        }
    });

    const searchSubscription = this.searchTerm.valueChanges.subscribe(value => {
      this.searchTermSig.set(value || '');
    });

    const dropdownSubscription = this.filterDropdown.valueChanges.subscribe(value => {
      switch(value){
        case 'My Tasks':
          this.filterFn.set((task) => task.userEmail === this.authService.currentUser.getValue()?.email);
          break;
        case 'Search Results':
          this.filterFn.set((task) => task.name.toLowerCase().includes(this.searchTermSig().toLowerCase()));
          break;
        default:
          this.filterFn.set((task) => true)
          break;
      }
    })

    this.destroyRef.onDestroy(() => {
      loadTasksSubscription.unsubscribe();
      searchSubscription.unsubscribe();
      dropdownSubscription.unsubscribe();
    });
  }

  onToggleCompleteness(taskId: string) {
    this.isUpdating.set(taskId);
    const subscription = this.taskService.toggleTaskCompleteness(taskId).subscribe({
        complete: () => {
          console.log(`Task ${taskId} toggled successfully.`);
          this.isUpdating.set('');
        }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onCreateTask(task: Task) {
    const subscription = this.taskService.createTask(task).subscribe({
        error: (err) => {
          console.error('Failed to create task', err);
        },
        complete: () => {
          console.log(`Task ${task.name} created successfully.`);
        },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

}
