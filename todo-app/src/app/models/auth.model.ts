export interface AuthResponse {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean
}

export class User {
    private _email: string;
    private _id: string;
    private _token: string;
    private _tokenExpirationDate: Date;

    constructor(email: string, id: string, token: string, expirationDate: Date){
        this._email = email;
        this._id = id;
        this._token = token;
        this._tokenExpirationDate = expirationDate;
    }

    get email() {
        return this._email;
    }

    get id() {
        return this._id;
    }

    get token() {
        if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return null;
        }
        return this._token;
    }
}