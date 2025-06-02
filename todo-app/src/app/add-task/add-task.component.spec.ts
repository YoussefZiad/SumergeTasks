import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { AddTaskComponent } from './add-task.component';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/auth.model';
import { AuthService } from '../services/auth.service';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { By } from '@angular/platform-browser';

describe('AddTaskComponent', () => {
  let component: AddTaskComponent;
  let fixture: ComponentFixture<AddTaskComponent>;

  const mockExpiryDate = new Date();
  mockExpiryDate.setHours(mockExpiryDate.getHours()+1);
  const mockUser = new User('test@test.test', '', '', mockExpiryDate);

  const mockAuthService = {
    currentUser: new BehaviorSubject<User>(mockUser)
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {provide: AuthService, useValue: mockAuthService}
      ],
      imports: [AddTaskComponent, FontAwesomeTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Testing Component Logic', () => {

    beforeEach(() => {
      const form = component.newTaskForm;
      form.controls.newTaskName.setValue('');
      form.controls.newTaskPriority.setValue(0);
      component.validationError.set(false);
    })

    it('form is initialized and validated', () => {
      const form = component.newTaskForm;

      expect(form.controls.newTaskName.value)
      .withContext('task name should be initialized empty').toBeFalsy();

      expect(form.controls.newTaskPriority.value)
      .withContext('task priority is initialized to 0').toBe(0);

      expect(form.valid).withContext('form should be invalid if task name is empty').toBeFalse();

      form.controls.newTaskPriority.setValue(-1);

      expect(form.valid).withContext('form should be invalid if priority is less than 0').toBeFalse();

      form.controls.newTaskPriority.setValue(4);

      expect(form.valid).withContext('form should be invalid if priority is more than 3').toBeFalse();

      form.controls.newTaskName.setValue('Task 1');
      form.controls.newTaskPriority.setValue(1);

      expect(form.valid).withContext('form should be valid otherwise').toBeTrue();

    });

    it('changing priority should update the icon properly', () => {
      const form = component.newTaskForm;

      component.onChangePriority();

      expect(form.controls.newTaskPriority.value)
      .withContext('form value should be incremented').toBe(1);

      component.onChangePriority();

      expect(form.controls.newTaskPriority.value)
      .withContext('form value should be incremented').toBe(2);

      component.onChangePriority();

      expect(form.controls.newTaskPriority.value)
      .withContext('form value should be incremented').toBe(3);

      component.onChangePriority();

      expect(form.controls.newTaskPriority.value)
      .withContext('form value should be incremented').toBe(0);
    });

    it('creating task should validate properly and emit the correct event', fakeAsync(() => {
      expect(component.validationError())
      .withContext('No validation error should be produced until creation is attempted').toBeFalse();

      const createTaskSpy = spyOn(component.createTask, 'emit');

      component.onCreateTask(new SubmitEvent('submit'));

      fixture.detectChanges();

      expect(createTaskSpy).not.toHaveBeenCalled();

      expect(component.validationError())
      .withContext('Validation error should be produced on invalid submission').toBeTrue();

      tick(250);

      expect(component.validationError())
      .withContext('Validation error should be reset shortly after').toBeFalse();

      component.newTaskForm.controls.newTaskName.setValue('Task 1');
      component.newTaskForm.controls.newTaskPriority.setValue(2);

      component.onCreateTask(new SubmitEvent('submit'));

      expect(component.validationError())
      .withContext('No validation error should be produced if form is valid').toBeFalse();

      expect(createTaskSpy).toHaveBeenCalledOnceWith(jasmine.objectContaining({
        _id: '',
        _name: 'Task 1',
        _priority: 2,
        _completed: false,
        _userEmail: 'test@test.test'
      }));

    }));

    afterAll(() => {
      const form = component.newTaskForm;
      form.controls.newTaskName.setValue('');
      form.controls.newTaskPriority.setValue(0);
      component.validationError.set(false);
    })

  });

  describe('Testing Template Rendering', () => {

    beforeEach(() => {
      const form = component.newTaskForm;
      form.controls.newTaskName.setValue('');
      form.controls.newTaskPriority.setValue(0);
      component.validationError.set(false);
    })

    it('should be correctly rendered in default state', () => {
      const mainContainer = fixture.debugElement.query(By.css('#create-task'));

      expect(mainContainer).withContext('main container should be rendered').toBeTruthy();

      const formEl = fixture.debugElement.query(By.css('#create-task-form'));

      expect(formEl).withContext('create task form is rendered').toBeTruthy();

      const taskNameTextbox = fixture.debugElement.query(By.css('#task-name-textbox'));

      expect(taskNameTextbox).withContext('task name textbox is rendered').toBeTruthy();

      const changePriorityButton = fixture.debugElement.query(By.css('#change-priority-button'));

      expect(changePriorityButton).withContext('change priority button is rendered').toBeTruthy();

      const priorityIcon = fixture.debugElement.query(By.css('#priority-icon'));

      expect(priorityIcon).withContext('priority icon is rendered').toBeTruthy();
      expect(priorityIcon.classes['minus'])
      .withContext('priority icon should display minus initially').toBeTrue();

      const addTaskButton = fixture.debugElement.query(By.css('#add-task-button'));

      expect(addTaskButton).toBeTruthy();

    });

    it('textbox should appear invalid on validation error', () => {
      component.validationError.set(true);
      fixture.detectChanges();
      const taskNameTextbox = fixture.debugElement.query(By.css('#task-name-textbox'));

      expect(taskNameTextbox.classes['create-task-invalid']).toBeTrue();
    });

    it('priority icon should change to reflect new icon value', () => {
      component.newTaskPriorityFC.setValue(1);
      fixture.detectChanges();

      const priorityIcon = fixture.debugElement.query(By.css('#priority-icon'));

      expect(priorityIcon.classes['equals']).toBeTrue();
    });

    afterAll(() => {
      const form = component.newTaskForm;
      form.controls.newTaskName.setValue('');
      form.controls.newTaskPriority.setValue(0);
      component.validationError.set(false);
    });

  });

  describe('Testing Interaction', () => {

    it('The change priority button should trigger changing priority', () => {
      const changePriorityButton = fixture.debugElement.query(By.css('#change-priority-button'));
      const changePrioritySpy = spyOn(component, 'onChangePriority');

      changePriorityButton.triggerEventHandler('click');

      expect(changePrioritySpy).toHaveBeenCalledTimes(1);
    });

    it('form submission should trigger task creation', () => {
      const addTaskForm = fixture.debugElement.query(By.css('#create-task-form'));
      const addTaskSpy = spyOn(component, 'onCreateTask');

      addTaskForm.triggerEventHandler('submit');

      expect(addTaskSpy).toHaveBeenCalledTimes(1);
    });

  })

});
