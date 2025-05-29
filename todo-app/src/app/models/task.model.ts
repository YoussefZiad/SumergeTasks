import { environment } from "../../environments/environment";
import { FirestoreDoc } from "./firestoreDocs.model";

export class Task {
    private _id: string;
    private _name: string;
    private _priority: number;
    private _completed: boolean = false;
    private _userEmail?: string;

    constructor(id: string, name: string, priority: number, completed: boolean = false, userEmail?: string) {
        this._id = id;
        this._name = name;
        this._priority = priority;
        this._completed = completed;
        if(userEmail)
            this._userEmail = userEmail;
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

    get userEmail(): string | undefined {
        return this._userEmail;
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

    set userEmail(userEmail: string) {
        this._userEmail = userEmail;
    }

    cloneTask() {
        if(this.userEmail)
            return new Task(this.id, this.name, this.priority, this.completed, this.userEmail);
        return new Task(this.id, this.name, this.priority, this.completed);
    }

    static fromFirestoreDoc(doc: FirestoreDoc): Task {
        const fields = doc.fields;

        const id = doc.name.split('/').pop() || ''; // Extracting ID from the document name
        const name = fields['name'].stringValue || '';
        const priority = fields['priority'].integerValue ? parseInt(fields['priority'].integerValue) : 0;
        const completed = fields['completed'].booleanValue || false;
        const userEmail = fields['userEmail']?.stringValue;

        if(userEmail)
            return new Task(id, name , priority, completed, userEmail);
        return new Task(id, name , priority, completed);
    }

    static toFirestoreDoc(task: Task): FirestoreDoc {
        return {
            name: `${environment.firestoreDocNamePrefix}/documents/tasks/${task.id}`,
            fields: {
                name: { stringValue: task.name },
                priority: { integerValue: task.priority },
                completed: { booleanValue: task.completed },
                ...(task.userEmail? { userEmail: { stringValue: task.userEmail } }:{})
            },
            createTime: new Date().toISOString(),
            updateTime: new Date().toISOString()
        };
    }

}