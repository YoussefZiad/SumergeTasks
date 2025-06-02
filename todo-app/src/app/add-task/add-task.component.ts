import { ChangeDetectorRef, Component, computed, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Task } from '../models/task.model';
import { debounce, debounceTime } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { PriorityIconPipe } from "../pipes/priority-icon.pipe";

@Component({
  selector: 'app-add-task',
  imports: [ReactiveFormsModule, FontAwesomeModule, PriorityIconPipe],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent {

  newTaskForm = new FormGroup({
    newTaskName: new FormControl<string>('', {
      validators: [ Validators.required ]
    }),
    newTaskPriority: new FormControl<number>(0, {
      validators: [ Validators.required, Validators.min(0), Validators.max(3) ]
    })
  });
  createTask = output<Task>();
  validationError = signal<boolean>(false);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  get newTaskNameFC() {
    return this.newTaskForm.controls.newTaskName;
  }

  get newTaskPriorityFC() {
    return this.newTaskForm.controls.newTaskPriority;
  }

  onChangePriority() {
    this.newTaskPriorityFC.setValue(((this.newTaskPriorityFC.value||0)+1)%4);
  }

  onCreateTask($event: Event) {
    $event.preventDefault();

    if(this.newTaskForm.invalid){
      this.validationError.set(true);
      const revertTimeout = setTimeout(() => {this.validationError.set(false)}, 250);
      this.destroyRef.onDestroy(() => clearTimeout(revertTimeout));
      return;
    }

    this.createTask.emit(new Task(
      '', 
      this.newTaskNameFC.value!, 
      this.newTaskPriorityFC.value!,
      false,
      this.authService.currentUser.getValue()?.email
    ));
  }
}
