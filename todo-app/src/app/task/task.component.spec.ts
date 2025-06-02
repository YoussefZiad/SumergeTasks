import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { TaskComponent } from './task.component';
import { Task } from '../models/task.model';
import { By } from '@angular/platform-browser';

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;

  const mockTask = new Task('t1', 'Task 1', 0, false, 'test@test.test');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskComponent, FontAwesomeTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskComponent);
    component = fixture.componentInstance;
    mockTask.priority = 0;
    mockTask.id = 't1';
    fixture.componentRef.setInput('task', mockTask.cloneTask());
    fixture.componentRef.setInput('isUpdating', false);
    fixture.componentRef.setInput('searchTerm', '');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Testing Component Logic', () => {

    it('should bind isCreating correctly', () => {
      expect(component.isCreating())
      .withContext('isCreating is false if the component task has its id').toBeFalse();

      mockTask.id = '';
      fixture.componentRef.setInput('task', mockTask.cloneTask());
      fixture.detectChanges();

      expect(component.isCreating())
      .withContext('isCreating is true if the component task has no id').toBeTrue();
    });

    it('actionAllowed should return the correct value', () => {
      expect(component.actionAllowed)
      .withContext('action allowed if task is not creating or updating').toBeTrue();

      mockTask.id = '';
      fixture.componentRef.setInput('task', mockTask.cloneTask());
      fixture.detectChanges();

      expect(component.actionAllowed)
      .withContext('action not allowed if task is creating').toBeFalse();

      mockTask.id = 't1';
      fixture.componentRef.setInput('task', mockTask.cloneTask());
      fixture.componentRef.setInput('isUpdating', true);
      fixture.detectChanges();

      expect(component.actionAllowed)
      .withContext('action not allowed if task is updating').toBeFalse();
    });

    it('isSearchTerm should return the correct value', () => {
      expect(component.isSearchMatch())
      .withContext('returns false if search term is empty').toBeFalse();

      fixture.componentRef.setInput('searchTerm', 'Tas');
      fixture.detectChanges();

      expect(component.isSearchMatch())
      .withContext('returns true if search term partially matches task name').toBeTrue();

      fixture.componentRef.setInput('searchTerm', 'Task 1');
      fixture.detectChanges();

      expect(component.isSearchMatch())
      .withContext('returns true if search term fully matches task name').toBeTrue();

      fixture.componentRef.setInput('searchTerm', 'Task 2');
      fixture.detectChanges();

      expect(component.isSearchMatch())
      .withContext('returns true if search term doesn\'t match task name').toBeFalse();
    });

    it('onToggleCompleteness should emit the event with task id', () => {
      const toggleCompleteSpy = spyOn(component.toggleComplete, 'emit');

      component.onToggleCompleteness();

      expect(toggleCompleteSpy).toHaveBeenCalledOnceWith('t1');
    });

  });

  describe('Testing Template Rendering', () => {

    beforeEach(() => {
      mockTask.priority = 0;
      mockTask.id = 't1';
      mockTask.userEmail = 'test@test.test';
      fixture.componentRef.setInput('task', mockTask.cloneTask());
      fixture.componentRef.setInput('isUpdating', false);
      fixture.componentRef.setInput('searchTerm', '');
      fixture.detectChanges();
    })

    it('element is initialized correctly in default state', () => {

      const listItem = fixture.debugElement.query(By.css('li#pending-task-t1'));
      const mainContainer = fixture.debugElement.query(By.css('#main-container'));
      const taskLabel = fixture.debugElement.query(By.css('#task-label'));
      const priorityIcon = fixture.debugElement.query(By.css('#priority-icon'));
      const toggleButton = fixture.debugElement.query(By.css('button#pending-task-t1'));
      const avatar = fixture.debugElement.query(By.css('#avatar'));
      const avatarText = fixture.debugElement.query(By.css('#avatar-text'));

      expect(listItem)
      .withContext('list item should have the correct id').toBeTruthy();

      expect(listItem.properties['draggable'])
      .withContext('list item should be draggable if action is allowed').toBeTrue();

      expect(mainContainer)
      .withContext('main container should be rendered').toBeTruthy();

      expect(mainContainer.classes['task'])
      .withContext('main container class should only be task by default').toBeTrue();

      expect(taskLabel)
      .withContext('task label should be rendered').toBeTruthy();

      expect(taskLabel.nativeElement.textContent)
      .withContext('task label should display task name').toEqual('Task 1');

      expect(priorityIcon)
      .withContext('icon should be rendered').toBeTruthy();

      expect(priorityIcon.classes['minus'])
      .withContext('icon class name is set properly').toBeTrue();

      expect(toggleButton).withContext('Toggle button is given the correct id').toBeTruthy();

      expect(toggleButton.properties['disabled']).withContext('Toggle button is enabled').toBeFalse();

      expect(toggleButton.nativeElement.textContent)
      .withContext('Toggle button has the correct text').toEqual('Mark Complete');

      expect(avatar).withContext('displays user avatar if assigned').toBeTruthy();

      expect(avatar.properties['title']).withContext('avatar tooltip displays user email')
      .toEqual('test@test.test');

      expect(avatarText.nativeElement.textContent).withContext('avatar displays user initial').toEqual('T');

    });

    it('element should be inactive if action is not allowed', () => {

      const listItem = fixture.debugElement.query(By.css('li#pending-task-t1'));
      const mainContainer = fixture.debugElement.query(By.css('#main-container'));
      const toggleButton = fixture.debugElement.query(By.css('button#pending-task-t1'));
      
      fixture.componentRef.setInput('isUpdating', true);
      fixture.detectChanges();

      expect(listItem.properties['draggable'])
      .withContext('list item should not be draggable').toBeFalse();

      expect(mainContainer.classes['action-forbidden'])
      .withContext('main container should have the action forbidden class')
      .toBeTrue();

      expect(toggleButton.properties['disabled'])
      .withContext('Toggle button should be disabled').toBeTrue();

    });

    it('element should be highlighted if it is a search result', () => {

      const mainContainer = fixture.debugElement.query(By.css('#main-container'));

      fixture.componentRef.setInput('searchTerm', 'Tas');
      fixture.detectChanges();

      expect(mainContainer.classes['highlighted'])
      .withContext('main container should have the highlighted class if it is a search result')
      .toBeTrue();
    });

    it('element should not show avatar circle if it is unassigned', () => {

      mockTask.userEmail = '';
      fixture.componentRef.setInput('task', mockTask.cloneTask());
      fixture.detectChanges();

      const avatar = fixture.debugElement.query(By.css('#avatar'));

      expect(avatar).toBeFalsy();
    })

  });

  describe('Testing Interaction', () => {

    it('clicking the toggle button should call the correct method', () => {
      const toggleButton = fixture.debugElement.query(By.css('button#pending-task-t1'));
      const toggleSpy = spyOn(component, 'onToggleCompleteness');

      toggleButton.triggerEventHandler('click');

      expect(toggleSpy).toHaveBeenCalledTimes(1);

    });

  });

});
