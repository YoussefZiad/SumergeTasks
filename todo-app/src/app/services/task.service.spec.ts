import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { TaskService } from "./task.service";
import { Task } from "../models/task.model";
import { environment } from "../../environments/environment";
import { map } from "rxjs";

describe('Task Service Tests', () => {

    let httpTesting: HttpTestingController;
    let taskService: TaskService;

    const mockTasks = [
        new Task('t1', 'Task 1', 0, false, 'test@test.test'),
        new Task('t2', 'Task 2', 3, false, 'test2@test.test'),
        new Task('t3', 'Task 3', 2, true, 'test3@test.test'),
        new Task('t4', 'Task 4', 1, true, 'test3@test.test')
    ]

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TaskService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        }).compileComponents();
        httpTesting = TestBed.inject(HttpTestingController);
        taskService = TestBed.inject(TaskService);
    });

    it('should be created', () => {
        expect(taskService).toBeTruthy();
    });

    describe('Tests for loading tasks', () => {

        it('should fetch tasks', (done: DoneFn) => {

            const mockResponse = {documents: mockTasks.map((task) => (Task.toFirestoreDoc(task)))};

            taskService.loadTasks().subscribe({
                next: (tasks) => {
                    //Check the return value
                    expect(tasks).withContext('returns the expected tasks').toEqual(mockTasks);

                    expect(taskService.pendingTasks())
                    .withContext('pendingTasks contains all incomplete tasks')
                    .toEqual(jasmine.arrayContaining(mockTasks.filter(
                        task => !task.completed
                    )));

                    expect(taskService.completedTasks())
                    .withContext('completedTasks contains all complete tasks')
                    .toEqual(jasmine.arrayContaining(mockTasks.filter(
                        task => task.completed
                    )));

                    expect(taskService.pendingTasks().every(task => !task.completed))
                    .withContext('pendingTasks contains only incomplete tasks').toBeTrue();

                    expect(taskService.completedTasks().every(task => task.completed))
                    .withContext('completedTasks contains only complete tasks').toBeTrue();

                    expect(taskService.pendingTasks().every((task, index, tasks) => 
                        index === tasks.length-1 || task.priority > tasks[index+1].priority))
                    .withContext('pendingTasks are sorted by priority')
                    .toBeTrue();

                    expect(taskService.completedTasks().every((task, index, tasks) => 
                        index === tasks.length-1 || task.priority > tasks[index+1].priority))
                    .withContext('completedTasks are sorted by priority')
                    .toBeTrue();


                    done();
                },
                error: done.fail
            });

            const req = httpTesting.expectOne({
                method: 'GET',
                url: `${environment.firestoreURL}/documents/tasks`
            }, 'request made to firebase to get tasks');

            req.flush(mockResponse);
        })

    });

    describe('Tests for toggling task completeness', () => {

        beforeEach(() => {
            taskService.pendingTasks.set(mockTasks.filter(task => !task.completed));
            taskService.completedTasks.set(mockTasks.filter(task => task.completed));
        })

        it('should mark task as complete if request passes', (done: DoneFn) => {

            const t1 = mockTasks.filter(task => task.id === 't1')[0];
            
            const restOfPendingTasks = taskService.pendingTasks().filter(task => task !== t1);
            const restOfCompletedTasks = [...taskService.completedTasks()];

            taskService.toggleTaskCompleteness('t1').subscribe({
                next: _ => done(),
                error: done.fail
            });

            const transferredTask = taskService.completedTasks().find(task => task.id === 't1');
            const shouldNotBeThereTask = taskService.pendingTasks().find(task => task.id === 't1');

            expect(taskService.pendingTasks())
            .withContext('No changes made to other pending tasks')
            .toEqual(jasmine.arrayContaining(restOfPendingTasks));

            expect(taskService.completedTasks())
            .withContext('No changes made to other completed tasks')
            .toEqual(jasmine.arrayContaining(restOfCompletedTasks));

            expect(transferredTask).withContext('task with this id was found in completedTasks')
            .toBeTruthy();

            expect(shouldNotBeThereTask).withContext('task with this id was not found in pendingTasks')
            .toBeFalsy();

            if(transferredTask){
                expect({...transferredTask})
                .withContext('Transferred task is identical to t1 but complete')
                .toEqual(jasmine.objectContaining({...t1, _completed: true}));

                expect(transferredTask.completed)
                .withContext('task instance is marked complete').toBeTrue();
            }

            expect(taskService.pendingTasks().every((task, index, tasks) => 
                index === tasks.length-1 || task.priority > tasks[index+1].priority))
            .withContext('pendingTasks are sorted by priority')
            .toBeTrue();

            expect(taskService.completedTasks().every((task, index, tasks) => 
                index === tasks.length-1 || task.priority > tasks[index+1].priority))
            .withContext('completedTasks are sorted by priority')
            .toBeTrue();

            const req = httpTesting.expectOne({
                method: 'PATCH',
                url: `${environment.firestoreURL}/documents/tasks/t1?currentDocument.exists=true&updateMask.fieldPaths=completed&alt=json`
            }, 'request made to firebase to patch tasks');

            expect(req.request.body).withContext('request called with the correct body').toEqual({
                fields: {
                    completed: { booleanValue: true }
                }
            });

            req.flush({});

        });

        it('should revert mark complete operation if request fails', (done: DoneFn) => {

            const t1 = mockTasks.filter(task => task.id === 't1')[0];

            const restOfPendingTasks = taskService.pendingTasks().filter(task => task !== t1);
            const restOfCompletedTasks = [...taskService.completedTasks()];
            
            taskService.toggleTaskCompleteness('t1').subscribe({
                next: _ => done.fail,
                error: () => {
                    const shouldNotBeThereTask = taskService.completedTasks().find(task => task.id === 't1');

                    expect(taskService.pendingTasks())
                    .withContext('No changes made to other pending tasks')
                    .toEqual(jasmine.arrayContaining(restOfPendingTasks));
                    
                    expect(taskService.completedTasks())
                    .withContext('No changes made to other completed tasks')
                    .toEqual(jasmine.arrayContaining(restOfCompletedTasks));

                    expect(shouldNotBeThereTask)
                    .withContext('task with this id is no longer in completedTasks')
                    .toBeFalsy();

                    expect(taskService.pendingTasks())
                    .withContext('original task is back in pendingTasks').toContain(t1);

                    expect(t1.completed).withContext('original task is incomplete').toBeFalse();

                    done();
                }
            });

            expect(taskService.pendingTasks())
            .withContext('No changes made to other pending tasks')
            .toEqual(jasmine.arrayContaining(restOfPendingTasks));
            
            expect(taskService.completedTasks())
            .withContext('No changes made to other completed tasks')
            .toEqual(jasmine.arrayContaining(restOfCompletedTasks));

            const transferredTask = taskService.completedTasks().find(task => task.id === 't1');
            const shouldNotBeThereTask = taskService.pendingTasks().find(task => task.id === 't1');

            expect(transferredTask)
            .withContext('task with this id was found in completedTasks (before error)')
            .toBeTruthy();

            expect(shouldNotBeThereTask)
            .withContext('task with this id was not found in pendingTasks (before error)')
            .toBeFalsy();

            if(transferredTask){
                expect({...transferredTask})
                .withContext('Transferred task is identical to t1 but complete (before error)')
                .toEqual(jasmine.objectContaining({...t1, _completed: true}));

                expect(transferredTask.completed)
                .withContext('task instance is marked complete (before error)').toBeTrue();
            }

            expect(taskService.pendingTasks().every((task, index, tasks) => 
                index === tasks.length-1 || task.priority > tasks[index+1].priority))
            .withContext('pendingTasks are sorted by priority')
            .toBeTrue();

            expect(taskService.completedTasks().every((task, index, tasks) => 
                index === tasks.length-1 || task.priority > tasks[index+1].priority))
            .withContext('completedTasks are sorted by priority')
            .toBeTrue();

            const req = httpTesting.expectOne({
                method: 'PATCH',
                url: `${environment.firestoreURL}/documents/tasks/t1?currentDocument.exists=true&updateMask.fieldPaths=completed&alt=json`
            }, 'request made to firebase to patch tasks');

            expect(req.request.body).withContext('request called with the correct body').toEqual({
                fields: {
                    completed: { booleanValue: true }
                }
            });

            req.error(new ProgressEvent('Network Error'));

        });

        it('should return task to pending if request passes', (done: DoneFn) => {

            const t3 = mockTasks.filter(task => task.id === 't3')[0];

            const restOfCompletedTasks = taskService.completedTasks().filter(task => task !== t3);
            const restOfPendingTasks = [...taskService.pendingTasks()];
            
            taskService.toggleTaskCompleteness('t3').subscribe({
                next: _ => done(),
                error: done.fail
            });

            const transferredTask = taskService.pendingTasks().find(task => task.id === 't3');
            const shouldNotBeThereTask = taskService.completedTasks().find(task => task.id === 't3');

            expect(taskService.pendingTasks())
            .withContext('No changes made to other pending tasks')
            .toEqual(jasmine.arrayContaining(restOfPendingTasks));
            
            expect(taskService.completedTasks())
            .withContext('No changes made to other completed tasks')
            .toEqual(jasmine.arrayContaining(restOfCompletedTasks));

            expect(transferredTask).withContext('task with this id was found in completedTasks')
            .toBeTruthy();

            expect(shouldNotBeThereTask)
            .withContext('task with this id was not found in pendingTasks')
            .toBeFalsy();

            if(transferredTask){
                expect({...transferredTask})
                .withContext('Transferred task is identical to t1 but incomplete')
                .toEqual(jasmine.objectContaining({...t3, _completed: false}));

                expect(transferredTask.completed).withContext('task instance is marked incomplete')
                .toBeFalse();
            }

            expect(taskService.pendingTasks().every((task, index, tasks) => 
                index === tasks.length-1 || task.priority > tasks[index+1].priority))
            .withContext('pendingTasks are sorted by priority')
            .toBeTrue();

            expect(taskService.completedTasks().every((task, index, tasks) => 
                index === tasks.length-1 || task.priority > tasks[index+1].priority))
            .withContext('completedTasks are sorted by priority')
            .toBeTrue();

            const req = httpTesting.expectOne({
                method: 'PATCH',
                url: `${environment.firestoreURL}/documents/tasks/t3?currentDocument.exists=true&updateMask.fieldPaths=completed&alt=json`
            }, 'request made to firebase to patch tasks');

            expect(req.request.body).withContext('request called with the correct body').toEqual({
                fields: {
                    completed: { booleanValue: false }
                }
            });

            req.flush({});

        });

        it('should revert return to pending operation if request fails', (done: DoneFn) => {

            const t3 = mockTasks.filter(task => task.id === 't3')[0];

            const restOfCompletedTasks = taskService.completedTasks().filter(task => task !== t3);
            const restOfPendingTasks = [...taskService.pendingTasks()];
            
            taskService.toggleTaskCompleteness('t3').subscribe({
                next: _ => done.fail,
                error: () => {
                    const shouldNotBeThereTask = 
                    taskService.pendingTasks().find(task => task.id === 't3');

                    expect(taskService.pendingTasks())
                    .withContext('No changes made to other pending tasks')
                    .toEqual(jasmine.arrayContaining(restOfPendingTasks));
                    
                    expect(taskService.completedTasks())
                    .withContext('No changes made to other completed tasks')
                    .toEqual(jasmine.arrayContaining(restOfCompletedTasks));

                    expect(shouldNotBeThereTask)
                    .withContext('task with this id is no longer in pendingTasks').toBeFalsy();

                    expect(taskService.completedTasks())
                    .withContext('original task is back in completed tasks').toContain(t3);

                    expect(t3.completed).withContext('original task is complete').toBeTrue();

                    done();
                }
            });

            const transferredTask = taskService.pendingTasks().find(task => task.id === 't3');
            const shouldNotBeThereTask = taskService.completedTasks().find(task => task.id === 't3');

            expect(taskService.pendingTasks())
            .withContext('No changes made to other pending tasks')
            .toEqual(jasmine.arrayContaining(restOfPendingTasks));
            
            expect(taskService.completedTasks())
            .withContext('No changes made to other completed tasks')
            .toEqual(jasmine.arrayContaining(restOfCompletedTasks));

            expect(transferredTask)
            .withContext('task with this id was found in completedTasks (before error)')
            .toBeTruthy();

            expect(shouldNotBeThereTask)
            .withContext('task with this id was not found in pendingTasks (before error)')
            .toBeFalsy();

            if(transferredTask){
                expect({...transferredTask})
                .withContext('Transferred task is identical to t1 but incomplete (before error)')
                .toEqual(jasmine.objectContaining({...t3, _completed: false}));

                expect(transferredTask.completed)
                .withContext('task instance is marked incomplete (before error)').toBeFalse();
            }

            expect(taskService.pendingTasks().every((task, index, tasks) => 
                index === tasks.length-1 || task.priority > tasks[index+1].priority))
            .withContext('pendingTasks are sorted by priority')
            .toBeTrue();

            expect(taskService.completedTasks().every((task, index, tasks) => 
                index === tasks.length-1 || task.priority > tasks[index+1].priority))
            .withContext('completedTasks are sorted by priority')
            .toBeTrue();

            const req = httpTesting.expectOne({
                method: 'PATCH',
                url: `${environment.firestoreURL}/documents/tasks/t3?currentDocument.exists=true&updateMask.fieldPaths=completed&alt=json`
            }, 'request made to firebase to patch tasks');

            expect(req.request.body).withContext('request called with the correct body').toEqual({
                fields: {
                    completed: { booleanValue: false }
                }
            });

            req.error(new ProgressEvent('Network Error'));

        });

        it('should throw an error if task id is not found', () => {
            expect(() => taskService.toggleTaskCompleteness('t100').subscribe()).toThrow();
        });

        afterAll(() => {
            taskService.pendingTasks.set([]);
            taskService.completedTasks.set([]);
        });

    });

    describe('Testing creating a task', () => {

        beforeEach(() => {
            taskService.pendingTasks.set(mockTasks.filter(task => !task.completed));
            taskService.completedTasks.set(mockTasks.filter(task => task.completed));
        })

        it('should create a task if request passes', (done: DoneFn) => {

            const mockNewTask = new Task('t5', 'Task 5', 2);
            const restOfPendingTasks = [...taskService.pendingTasks()];

            taskService.createTask(mockNewTask).subscribe({
                next: _ => {
                    const addedTask = taskService.pendingTasks().filter(task => task.id === 't5')[0];

                    expect(addedTask).withContext('A task with the correct id was found').toBeTruthy();
                    expect({...addedTask}).withContext('Task is identical to the entered data')
                    .toEqual(jasmine.objectContaining({...mockNewTask}));

                    done();
                },
                error: done.fail,
            })

            expect(taskService.pendingTasks()).withContext('task is added to pending tasks')
            .toContain(mockNewTask);

            expect(taskService.pendingTasks()).withContext('No other tasks are affected')
            .toEqual(jasmine.arrayContaining(restOfPendingTasks));

            expect(taskService.pendingTasks().every((task, index, tasks) => 
                index === tasks.length-1 || task.priority > tasks[index+1].priority))
            .withContext('pendingTasks are sorted by priority')
            .toBeTrue();

            const req = httpTesting.expectOne({
                method: 'POST',
                url: `${environment.firestoreURL}/documents/tasks`
            }, 'request made to firebase to post task');

            expect(req.request.body).withContext('request called with the correct body')
            .toEqual({fields: Task.toFirestoreDoc(mockNewTask).fields});

            req.flush({ name: '/t5'});

        });

        it('should revert task creation if request fails', (done: DoneFn) => {

            const mockNewTask = new Task('t5', 'Task 5', 2);
            const restOfPendingTasks = [...taskService.pendingTasks()];

            taskService.createTask(mockNewTask).subscribe({
                next: _ => done.fail,
                error: () => {
                    const shouldNotBeThereTask = taskService.pendingTasks()
                    .filter(task => task.id === 't5')[0];

                    expect(shouldNotBeThereTask)
                    .withContext('Task was removed from pending tasks').toBeFalsy();

                    done();
                },
            })

            expect(taskService.pendingTasks()).withContext('task is added to pending tasks')
            .toContain(mockNewTask);

            expect(taskService.pendingTasks()).withContext('No other tasks are affected')
            .toEqual(jasmine.arrayContaining(restOfPendingTasks));

            expect(taskService.pendingTasks().every((task, index, tasks) => 
                index === tasks.length-1 || task.priority > tasks[index+1].priority))
            .withContext('pendingTasks are sorted by priority')
            .toBeTrue();

            const req = httpTesting.expectOne({
                method: 'POST',
                url: `${environment.firestoreURL}/documents/tasks`
            }, 'request made to firebase to post task');

            expect(req.request.body).withContext('request called with the correct body')
            .toEqual({fields: Task.toFirestoreDoc(mockNewTask).fields});

            req.error(new ProgressEvent('Network Error'));

        });

        afterAll(() => {
            taskService.pendingTasks.set([]);
            taskService.completedTasks.set([]);
        });

    });

    afterEach(() => {
        httpTesting.verify();
    })

})