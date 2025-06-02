import { HttpClient } from "@angular/common/http";
import { DestroyRef, inject, Injectable } from "@angular/core";
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
    tokenTimeout: ReturnType<typeof setTimeout> | undefined;
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);

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
        if(typeof window !== 'undefined' && window.localStorage){
            const storedUser = localStorage.getItem('currentUser');
            if(storedUser) {
                const parsedUser = JSON.parse(storedUser);
                const newCurrentUser = new User(
                    parsedUser['_email'], 
                    parsedUser['_id'],
                    parsedUser['_token'],
                    new Date(parsedUser['_tokenExpirationDate'])
                );
                if(!newCurrentUser.token){
                    return false;
                }
                this.currentUser.next(newCurrentUser);
                console.log(this.currentUser.getValue());
                return true;
            }
            return false;
        }
        return false;
    }

    logout() {
        this.currentUser.next(null);
        window.localStorage.clear();
        if(this.tokenTimeout)
            this.tokenTimeout = undefined;
        this.router.navigate(['/']);
    }

    autoLogout(expirationDate: Date) {
        const timeToExpiration = expirationDate.getTime() - new Date().getTime();
        this.tokenTimeout = setTimeout(() => this.logout(), timeToExpiration);
        this.destroyRef.onDestroy(() => clearTimeout(this.tokenTimeout));
    }

    createAuthenticatedUser(authData: AuthResponse){
        const expirationDate = new Date(new Date().getTime() + +authData.expiresIn*1000);
        const user = new User(authData.email, authData.localId, authData.idToken, expirationDate);
        this.currentUser.next(user);
        console.log(this.currentUser);
        window.localStorage.setItem('currentUser', JSON.stringify(user));
    }



}