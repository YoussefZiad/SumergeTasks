import { ComponentFixture, DeferBlockBehavior, DeferBlockState, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { TodoListComponent } from './todo-list.component';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';
import { Task } from '../models/task.model';
import { User } from '../models/auth.model';
import { BehaviorSubject, delay, of, switchMap, throwError } from 'rxjs';
import { signal } from '@angular/core';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { By } from '@angular/platform-browser';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let taskService: TaskService;
  let authService: AuthService;

  const mockPendingTasks = [
    new Task('t1', 'Task 1', 0, false, 'test@test.test'),
    new Task('t2', 'Task 2', 3, false, 'test2@test.test'),
    new Task('t3', 'Task 3', 1, false, 'test3@test.test')
  ];

  const mockCompletedTasks = [
    new Task('t4', 'Task 4', 2, true, 'test4@test.test'),
    new Task('t5', 'Task 5', 1, true, 'test5@test.test'),
    new Task('t6', 'Task 6', 3, true, 'test6@test.test'),
  ];

  const mockTaskService = {
    pendingTasks: signal<Task[]>(mockPendingTasks),
    completedTasks: signal<Task[]>(mockCompletedTasks),
    loadTasks: () => of(null),
    toggleTaskCompleteness: () => of(null),
    createTask: () => of(null)
  }

  const mockExpiryDate = new Date();
  mockExpiryDate.setHours(mockExpiryDate.getHours() + 1);
  const mockCurrentUser = new User('test@test.test','','',mockExpiryDate);
  
  const mockAuthService = {
    currentUser: new BehaviorSubject<User>(mockCurrentUser),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {provide: TaskService, useValue: mockTaskService},
        {provide: AuthService, useValue: mockAuthService}
      ],
      imports: [TodoListComponent, FontAwesomeTestingModule],
      deferBlockBehavior: DeferBlockBehavior.Manual
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    taskService = TestBed.inject(TaskService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Testing component logic', () => {

    beforeEach(() => {
      component.filterFn.set((_) => true);
      component.searchTerm.setValue('');
      component.isUpdating.set('');
      component.fetchingTasks.set(true);
      component.fetchingTasksError.set('');
    })
    
    it('filtered tasks are calculated by the filter function', () => {
      component.filterFn.set((task) => task.priority === 3);
      fixture.detectChanges();

      expect(component.filteredPendingTasks())
      .withContext('filtered pending tasks contains all matching tasks')
      .toEqual(jasmine.arrayContaining(mockPendingTasks.slice(1,2)));

      expect(mockPendingTasks.slice(1,2))
      .withContext('filtered pending tasks contains only matching tasks')
      .toEqual(jasmine.arrayContaining(component.filteredPendingTasks()));

      expect(component.filteredCompletedTasks())
      .withContext('filtered completed tasks contains all matching tasks')
      .toEqual(jasmine.arrayContaining(mockCompletedTasks.slice(2,3)));

      expect(mockCompletedTasks.slice(2,3))
      .withContext('filtered completed tasks contains only matching tasks')
      .toEqual(jasmine.arrayContaining(component.filteredCompletedTasks()));

    });

    it('tasks are loaded on startup if task load request passes', () => {
      expect(component.fetchingTasks()).withContext('tasks should start loading').toBeTrue();

      const loadTasksSpy = spyOn(taskService, 'loadTasks').and
        .returnValue(of(mockPendingTasks.concat(mockCompletedTasks)));

      fixture.detectChanges();

      expect(loadTasksSpy).withContext('task service should be called to load tasks')
      .toHaveBeenCalledTimes(1);

      expect(component.fetchingTasks()).withContext('task loading should stop').toBeFalse();

      expect(component.fetchingTasksError())
      .withContext("No error message should appear").toBeFalsy();
    });

    it('tasks fail to load and an error message is assigned if load request fails', () => {
      const loadTasksSpy = spyOn(taskService, 'loadTasks').and
        .returnValue(throwError(() => new Error('fail message')));

      fixture.detectChanges();

      expect(loadTasksSpy).withContext('task service should be called to load tasks')
      .toHaveBeenCalledTimes(1);

      expect(component.fetchingTasksError())
      .withContext('An error message should be produced')
      .toEqual('Failed to load tasks, please try again later.');
    });

    it('changing the filter dropdown should change the filter function', () => {
      fixture.detectChanges();

      component.filterDropdown.setValue('My Tasks');

      expect(mockPendingTasks.filter(component.filterFn()))
      .withContext('my tasks filter function keeps all user tasks')
      .toEqual(jasmine.objectContaining(mockPendingTasks.slice(0,1)));

      expect(mockPendingTasks.slice(0,1))
      .withContext('my tasks filter function keeps only user tasks')
      .toEqual(jasmine.objectContaining(mockPendingTasks.filter(component.filterFn())));

      component.filterDropdown.setValue('Search Results');
      component.searchTerm.setValue('Task 6');

      expect(mockCompletedTasks.filter(component.filterFn()))
      .withContext('search results filter function keeps all search results')
      .toEqual(jasmine.objectContaining(mockCompletedTasks.slice(2,3)));

      expect(mockCompletedTasks.slice(2,3))
      .withContext('search results filter function keeps only search results')
      .toEqual(jasmine.objectContaining(mockCompletedTasks.filter(component.filterFn())));

      component.filterDropdown.setValue('None');

      expect(mockCompletedTasks.filter(component.filterFn()))
      .withContext('none filter function keeps all tasks')
      .toEqual(jasmine.objectContaining(mockCompletedTasks));

    });

    it('toggle completeness function calls task service to toggle task completeness'
       + ' should update isupdating signal', fakeAsync(() => {
      fixture.detectChanges();

      const toggleTaskSpy = spyOn(taskService, 'toggleTaskCompleteness')
        .and.returnValue(of({}).pipe(delay(1)));

      component.onToggleCompleteness('t2');

      expect(toggleTaskSpy)
      .withContext('task service is called to toggle task with the appropriate id')
      .toHaveBeenCalledOnceWith('t2');

      expect(component.isUpdating())
      .withContext('isUpdating is set to the proper task id').toEqual('t2');

      tick(1);

      expect(component.isUpdating())
      .withContext('isUpdating is reset after updating is resolved/rejected').toEqual('');
      
    }));

    it('task creation function should call task service to create task', () => {
      fixture.detectChanges();

      const newTask = new Task('t7', 'Task 7', 2);
      const createTaskSpy = spyOn(taskService, 'createTask').and.returnValue(of(newTask));

      component.onCreateTask(newTask);

      expect(createTaskSpy).withContext('task service is called to create task')
      .toHaveBeenCalledOnceWith(newTask);
    });

    afterAll(() => {
      component.filterFn.set((_) => true);
      component.searchTerm.setValue('');
      component.isUpdating.set('');
      component.fetchingTasks.set(true);
      component.fetchingTasksError.set('');
    });

  });

  describe('Testing Template Rendering', () => {

    beforeEach(() => {
      taskService.pendingTasks.set(mockPendingTasks);
      taskService.completedTasks.set(mockCompletedTasks);
      component.searchTerm.setValue('');
      component.isUpdating.set('');
    })

    it('component should render properly in default state', fakeAsync(() => {

      spyOn(taskService, 'loadTasks').and.returnValue(
        of(mockPendingTasks.concat(mockCompletedTasks)).pipe(delay(1))
      );
      fixture.detectChanges();
      const appHeader = fixture.debugElement.query(By.css('#app-header'));
      const searchTextbox = fixture.debugElement.query(By.css('#search'));
      const filterDD = fixture.debugElement.query(By.css('#filterDD'));
      const pendingTasksHeader = fixture.debugElement.query(By.css('#pending-tasks-header'));
      const completedTasksHeader = fixture.debugElement.query(By.css('#completed-tasks-header'));
      const pendingTasksList = fixture.debugElement.query(By.css('#pending-tasks'));
      const completedTasksList = fixture.debugElement.query(By.css('#completed-tasks'));
      const addTask = fixture.debugElement.query(By.css('#add-task'));
      const pendingLoadError = fixture.debugElement.query(By.css('#pending-load-error'));
      const completedLoadError = fixture.debugElement.query(By.css('#completed-load-error'));
      const pendingLoader = fixture.debugElement.query(By.css('#pending-loader'));
      const completedLoader = fixture.debugElement.query(By.css('#completed-loader'));
      const emptyPendingTasks = fixture.debugElement.query(By.css('#empty-pending-tasks'));
      const emptyCompletedTasks = fixture.debugElement.query(By.css('#empty-completed-tasks'));

      expect(appHeader).withContext('app header is rendered').toBeTruthy();
      expect(searchTextbox).withContext('search textbox is rendered').toBeTruthy();
      expect(filterDD).withContext('filter dropdown list is rendered').toBeTruthy();
      expect(pendingTasksHeader).withContext('pending tasks header is rendered').toBeTruthy();
      expect(completedTasksHeader).withContext('completed tasksheader is rendered').toBeTruthy();
      expect(pendingTasksList).withContext('pending tasks list is rendered').toBeTruthy();
      expect(completedTasksList).withContext('completed tasks list is rendered').toBeTruthy();
      expect(addTask).withContext('add task form is rendered').toBeTruthy();
      expect(pendingLoadError)
      .withContext('error message for loading pending tasks is not rendered').toBeFalsy();
      expect(completedLoadError)
      .withContext('error message for loading completed tasks is not rendered').toBeFalsy();
      expect(pendingLoader).withContext('loader for pending tasks is rendered').toBeTruthy();
      expect(completedLoader).withContext('loader for completed tasks is rendered').toBeTruthy();
      expect(emptyPendingTasks)
      .withContext('message for empty pending tasks is not rendered').toBeFalsy();
      expect(emptyCompletedTasks)
      .withContext('message for empty completed tasks is not rendered').toBeFalsy();

      tick(1);
      fixture.detectChanges();

      const gonePendingLoader = fixture.debugElement.query(By.css('#pending-loader'));
      const goneCompletedLoader = fixture.debugElement.query(By.css('#completed-loader'));

      expect(gonePendingLoader)
      .withContext('pending tasks loader disappears after loading is complete').toBeFalsy();
      expect(goneCompletedLoader)
      .withContext('complete tasks loader disappears after loading is complete').toBeFalsy();

      const placeholderTasks = fixture.debugElement.queryAll(By.css('.placeholder-task'));

      expect(placeholderTasks.length).withContext('tasks are replaced by placeholders').toBe(6);

      fixture.getDeferBlocks().then(res => { 
          for(let i = 0; i < res.length; i++){
            res[i].render(DeferBlockState.Complete);
          }
        }
      );

      tick();

      const gonePlaceholderTasks = fixture.debugElement.queryAll(By.css('.placeholder-task'));
      const appTasks = fixture.debugElement.queryAll(By.css('app-task'));

      expect(gonePlaceholderTasks.length).withContext('placeholders disappear on viewport').toBe(0);
      expect(appTasks.length).withContext('tasks are loaded').toBe(6);

      const allTasks = mockPendingTasks.concat(mockCompletedTasks);

      component.searchTerm.setValue('Task 4');
      component.isUpdating.set('t3');
      fixture.detectChanges();

      for(let i = 0; i < appTasks.length; i++){
        expect(appTasks[i].attributes['id'])
        .toEqual(`${allTasks[i].completed?'completed':'pending'}-task-comp-${allTasks[i].id}`);

        expect(appTasks[i].componentInstance.searchTerm())
        .withContext(`${allTasks[i].id} has the proper search term`)
        .toEqual(component.searchTerm.value);
        if(i != 2)
          expect(appTasks[i].componentInstance.isUpdating())
          .withContext(`${allTasks[i].id} has the proper updating status`).toBeFalse();
        else
          expect(appTasks[i].componentInstance.isUpdating())
          .withContext(`${allTasks[i].id} has the proper updating status`).toBeTrue();
      }

    }));

    it('component should display error message if task loading fails', () => {
      spyOn(taskService, 'loadTasks').and.returnValue(
        throwError(() => new Error('fail message'))
      );
      fixture.detectChanges();

      const pendingLoadError = fixture.debugElement.query(By.css('#pending-load-error'));
      const completedLoadError = fixture.debugElement.query(By.css('#completed-load-error'));

      expect(pendingLoadError).withContext('Error message is shown for pending tasks').toBeTruthy();
      expect(completedLoadError).withContext('Error message is shown for completed tasks').toBeTruthy();

    });

    it('component should display empty message if pending tasks array is empty', () => {
      taskService.pendingTasks.set([]);
      spyOn(taskService, 'loadTasks').and.returnValue(
        of(mockPendingTasks.concat(mockCompletedTasks))
      );
      fixture.detectChanges();

      const emptyPendingTasks = fixture.debugElement.query(By.css('#empty-pending-tasks'));

      expect(emptyPendingTasks).withContext('Empty message is shown for pending tasks').toBeTruthy();

    });

    it('component should display empty message if completed tasks array is empty', () => {
      taskService.completedTasks.set([]);
      spyOn(taskService, 'loadTasks').and.returnValue(
        of(mockPendingTasks.concat(mockCompletedTasks))
      );
      fixture.detectChanges();

      const emptyCompletedTasks = fixture.debugElement.query(By.css('#empty-completed-tasks'));

      expect(emptyCompletedTasks).withContext('Empty message is shown for completed tasks').toBeTruthy();

    });

    afterAll(() => {
      taskService.pendingTasks.set(mockPendingTasks);
      taskService.completedTasks.set(mockCompletedTasks);
      component.searchTerm.setValue('');
      component.isUpdating.set('');
    })



  });

  describe('Testing Interaction', () => {

    it('add task component should trigger task creation event', () => {
      const createTaskSpy = spyOn(component, 'onCreateTask');
      const addTask = fixture.debugElement.query(By.css('#add-task'));

      const newTask = new Task('t7', 'Task 7', 2);
      addTask.triggerEventHandler('createTask', newTask);

      expect(createTaskSpy).toHaveBeenCalledOnceWith(newTask);
    });

    it('task components should toggle task completeness', () => {
      const toggleCompleteSpy = spyOn(component, 'onToggleCompleteness');
      const taskComponents = fixture.debugElement.queryAll(By.css('app-task'));

      for(let i = 0; i < taskComponents.length; i++){
        taskComponents[i]
        .triggerEventHandler('createTask', taskComponents[i].componentInstance.task.id);

        expect(toggleCompleteSpy).toHaveBeenCalledOnceWith(taskComponents[i].componentInstance.task.id);
      }
    });

  })
});
