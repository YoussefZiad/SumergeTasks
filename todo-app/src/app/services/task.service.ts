import { inject, Injectable, signal } from "@angular/core";
import { Task } from "../models/task.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { catchError, map, tap } from "rxjs";
import { FirestoreDocs } from "../models/firestoreDocs.model";

@Injectable({
    providedIn: 'root'
})
export class TaskService {

    pendingTasks = signal<Task[]>([]);
    completedTasks = signal<Task[]>([]);
    private _httpClient = inject(HttpClient);

    loadTasks() {
        return this._httpClient.get<FirestoreDocs>(
            `${environment.firestoreURL}/documents/tasks`,
        ).pipe(
            map((taskDocs) => 
                taskDocs.documents.map(
                    (taskDoc) => Task.fromFirestoreDoc(taskDoc)
                )
            ),
            tap((tasks: Task[]) => {
                this.pendingTasks.set(tasks.filter(task => !task.completed));
                this.completedTasks.set(tasks.filter(task => task.completed));
                console.log('Pending Tasks:', this.pendingTasks());
                console.log('Completed Tasks:', this.completedTasks());
            })
        )
    }

    toggleTaskCompleteness(taskId: string) {
        const originalPending = [...this.pendingTasks()];
        const originalCompleted = [...this.completedTasks()];

        const pendingTaskIndex = originalPending.findIndex(task => task.id === taskId);
        const completedTaskIndex = originalCompleted.findIndex(task => task.id === taskId);
        let task:Task | null = null;

        if (pendingTaskIndex != -1) {
            task = this.pendingTasks()[pendingTaskIndex].cloneTask();
            task.completed = true;
            this.pendingTasks.set(this.pendingTasks().toSpliced(pendingTaskIndex, 1));
            this.completedTasks.set([...this.completedTasks(), task]);
        } else if (completedTaskIndex != -1) {
            task = this.completedTasks()[completedTaskIndex].cloneTask();
            task.completed = false;
            this.completedTasks.set(this.completedTasks().toSpliced(completedTaskIndex, 1));
            this.pendingTasks.set([...this.pendingTasks(), task as Task]);
        } else {
            throw new Error(`Task with ID ${taskId} not found in either pending or completed tasks.`);
        }

        return this._httpClient.patch(
            `${environment.firestoreURL}/documents/tasks/${taskId}?currentDocument.exists=true&updateMask.fieldPaths=completed&alt=json`,
            {
                fields: {
                    completed: { booleanValue: task.completed },
                }
            }
        ).pipe(
            catchError((err) => {
                console.error(`Failed to update task ${taskId}`, err);
                // Revert changes if the update fails
                this.pendingTasks.set(originalPending);
                this.completedTasks.set(originalCompleted);
                throw err; 
            })
        )

    }

    createTask(task: Task) {
        const originalPending = [...this.pendingTasks()];

        this.pendingTasks.set([...this.pendingTasks(), task]);

        return this._httpClient.post<Task>(
            `${environment.firestoreURL}/documents/tasks`,
            {fields: Task.toFirestoreDoc(task).fields},
        ).pipe(
            tap((createdTask) => {
                task.id = createdTask.name.split('/').pop() || '';
                task = task.cloneTask();
            }),
            catchError((err) => {
                console.error('Failed to create task', err);
                // Revert changes if the creation fails
                this.pendingTasks.set(originalPending);
                throw err;
            })
        );
    }


}