import { environment } from "../../environments/environment";
import { FirestoreDoc } from "./firestoreDocs.model";

export class Task {
    private _id: string;
    private _name: string;
    private _priority: number;
    private _completed: boolean = false;

    constructor(id: string, name: string, priority: number, completed: boolean = false) {
        this._id = id;
        this._name = name;
        this._priority = priority;
        this._completed = completed;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get priority(): number {
        return this._priority;
    }

    get completed(): boolean {
        return this._completed;
    }

    set id(newId: string) {
        this._id = newId;
    }

    set name(newName: string) {
        this._name = newName;
    }

    set priority(newPriority: number) {
        if(newPriority < 1 || newPriority > 5) {
            throw new Error("Priority must be between 1 and 5.");
        }
        this._priority = newPriority;
    }

    set completed(isCompleted: boolean) {
        this._completed = isCompleted;
    }

    cloneTask() {
        return new Task(this.id, this.name, this.priority, this.completed);
    }

    static fromFirestoreDoc(doc: FirestoreDoc): Task {
        const fields = doc.fields;
        return new Task(
            doc.name.split('/').pop() || '', // Extracting ID from the document name
            fields['name'].stringValue || '',
            fields['priority'].integerValue ? parseInt(fields['priority'].integerValue) : 0,
            fields['completed'].booleanValue || false
        );
    }

    static toFirestoreDoc(task: Task): FirestoreDoc {
        return {
            name: `${environment.firestoreDocNamePrefix}/documents/tasks/${task.id}`,
            fields: {
                name: { stringValue: task.name },
                priority: { integerValue: task.priority },
                completed: { booleanValue: task.completed }
            },
            createTime: new Date().toISOString(),
            updateTime: new Date().toISOString()
        };
    }

}