import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { AuthResponse, User } from "../models/auth.model";
import { BehaviorSubject, tap } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthService{
    private httpClient = inject(HttpClient);
    currentUser = new BehaviorSubject<User | null>(null);
    tokenTimeout: NodeJS.Timeout | undefined;
    private router = inject(Router);

    signup(email: string, password: string){
        return this.httpClient.post<AuthResponse>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.authApiKey}`,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            tap(authData => {
                this.createAuthenticatedUser(authData);
            })
        );
    }

    login(email: string, password: string){
        return this.httpClient.post<AuthResponse>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.authApiKey}`,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            tap(authData => {
                this.createAuthenticatedUser(authData);
            })
        );
    }

    autoLogin(): boolean{
        const storedUser = localStorage.getItem('currentUser');
        if(storedUser) {
            const parsedUser = JSON.parse(storedUser)
            this.currentUser.next(new User(
                parsedUser['_email'], 
                parsedUser['_id'],
                parsedUser['_token'],
                new Date(parsedUser['_tokenExpirationDate'])
            ));
            console.log(this.currentUser.getValue());
            return true;
        }
        return false;
    }

    logout() {
        this.currentUser.next(null);
        window.localStorage.clear();
        if(this.tokenTimeout)
            this.tokenTimeout.close();
        this.router.navigate(['/']);
    }

    autoLogout(expirationDate: Date) {
        const timeToExpiration = new Date().getTime() - expirationDate.getTime();
        this.tokenTimeout = setTimeout(() => this.logout(), timeToExpiration);
    }

    createAuthenticatedUser(authData: AuthResponse){
        const expirationDate = new Date(new Date().getTime() + +authData.expiresIn*1000);
        const user = new User(authData.email, authData.localId, authData.idToken, expirationDate);
        this.currentUser.next(user);
        console.log(this.currentUser);
        window.localStorage.setItem('currentUser', JSON.stringify(user));
    }



}