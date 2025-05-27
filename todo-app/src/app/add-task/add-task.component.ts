import { ChangeDetectorRef, Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { priorityToIconMap } from '../utilities/priority.icons';
import { Task } from '../models/task.model';
import { debounce, debounceTime } from 'rxjs';

@Component({
  selector: 'app-add-task',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent implements OnInit {

  newTaskForm = new FormGroup({
    newTaskName: new FormControl<string>('', {
      validators: [ Validators.required ]
    }),
    newTaskPriority: new FormControl<number>(0, {
      validators: [ Validators.required, Validators.min(0), Validators.max(3) ]
    })
  });
  newTaskPriorityIcon = signal<string>(priorityToIconMap.get(
    this.newTaskForm.controls.newTaskPriority.value || 0) || '');
  createTask = output<Task>();

  ngOnInit(): void {
    const storedForm = window.sessionStorage.getItem('newTaskForm');

    if (storedForm) {
      const parsedForm = JSON.parse(storedForm);
      this.newTaskForm.setValue({
        newTaskName: parsedForm.newTaskName || '',
        newTaskPriority: parsedForm.newTaskPriority || 0
      });
      this.newTaskPriorityIcon.set(priorityToIconMap.get(
        this.newTaskForm.controls.newTaskPriority.value || 0) || '');
    }

    this.newTaskForm.valueChanges.pipe(debounceTime(200)).subscribe(value => {
      window.sessionStorage.setItem('newTaskForm', JSON.stringify(value));
    });
  }

  onChangePriority() {
    this.newTaskForm.controls.newTaskPriority.setValue(((
      this.newTaskForm.controls.newTaskPriority.value||0)+1)%4);
    this.newTaskPriorityIcon.set(priorityToIconMap.get(
      this.newTaskForm.controls.newTaskPriority.value || 0) || '');
  }

  onCreateTask($event: Event) {
    $event.preventDefault();

    this.createTask.emit(new Task(
      '', 
      this.newTaskForm.controls.newTaskName.value || '', 
      this.newTaskForm.controls.newTaskPriority.value || 0,
    ));
  }
}
