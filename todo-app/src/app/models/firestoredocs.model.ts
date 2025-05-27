export interface FirestoreDoc {
    name: string;
    fields: Record<string, any>;
    createTime: string;
    updateTime: string;
}

export interface FirestoreDocs {
    documents: Array<FirestoreDoc>;
}