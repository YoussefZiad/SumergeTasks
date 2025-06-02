import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing"
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { User } from "../models/auth.model";

describe('Auth Service Tests' , () => {

    let httpTesting: HttpTestingController;
    let authService: AuthService;
    let router: Router;

    const mockEmail = 'test@test.test';
    const mockPassword = 'testpass';
    const mockId = 'mockId';
    const mockToken = 'mockToken';
    const mockExpiresIn = '3600';
    const mockExpiryDate = new Date();
    mockExpiryDate.setHours(new Date().getHours()+1);

    const mockRouter = {
        navigate: () => {}
    }

    const mockAuthData = {
        email: 'test@test.test',
        idToken: mockToken,
        expiresIn: mockExpiresIn,
        kind: '',
        refreshToken: '',
        localId: mockId    
    }


    const mockCurrentUser = {
        _email: mockEmail,
        _id: mockId,
        _token: mockToken,
        _tokenExpirationDate: mockExpiryDate
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthService,
                {provide: Router, useValue: mockRouter},
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        }).compileComponents();
        httpTesting = TestBed.inject(HttpTestingController);
        authService = TestBed.inject(AuthService);
        router = TestBed.inject(Router);
    });

    it('should be created', () => {
        expect(authService).toBeTruthy();
    });

    describe('Testing user signup', () => {

        it('should sign user up if request passes', (done: DoneFn) => {

            const createUserSpy = spyOn(authService, 'createAuthenticatedUser');

            authService.signup(mockEmail, mockPassword).subscribe({
                next: (authData) => {
                    expect(createUserSpy).withContext('Creates user object and logs user in')
                    .toHaveBeenCalledOnceWith(authData);
                    
                    done();
                },
                error: done.fail
            });

            const req = httpTesting.expectOne({
                method: 'POST',
                url: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.authApiKey}`
            }, 'request made to firebase to signup');

            expect(req.request.body).withContext('request called with the correct body').toEqual({
                email: mockEmail,
                password: mockPassword,
                returnSecureToken: true
            });

            req.flush(mockAuthData);
        });

    });

    describe('Testing user login', () => {

        it('should log user in if request passes', (done: DoneFn) => {

            const createUserSpy = spyOn(authService, 'createAuthenticatedUser');

            authService.login(mockEmail, mockPassword).subscribe({
                next: (authData) => {
                    expect(createUserSpy).withContext('Creates user object and logs user in')
                    .toHaveBeenCalledOnceWith(authData);

                    done();
                },
                error: done.fail
            });

            const req = httpTesting.expectOne({
                method: 'POST',
                url: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.authApiKey}`
            }, 'request made to firebase to login');

            expect(req.request.body).withContext('request called with the correct body').toEqual({
                email: mockEmail,
                password: mockPassword,
                returnSecureToken: true
            });

            req.flush(mockAuthData);
        });

    });

    describe('Testing autologin', () => {

        beforeEach(() => {
            authService.currentUser.next(null);
        })

        it('should automatically log user in if user is found in localstorage', () => {

            spyOn(window.localStorage, 'getItem').and.returnValue(JSON.stringify(mockCurrentUser));

            const autoLoginSuccess = authService.autoLogin();

            expect({...authService.currentUser.getValue()})
            .withContext('currentUser should be set to the correct value')
            .toEqual(jasmine.objectContaining(mockCurrentUser));

            expect(autoLoginSuccess).withContext('login is successful').toBeTrue();
            
        });

        it('should not automatically log user in if user is not found', () => {

            spyOn(window.localStorage, 'getItem').and.returnValue(null);

            const autoLoginSuccess = authService.autoLogin();

            expect(authService.currentUser.getValue())
            .withContext('currentUser should not be set')
            .toBeFalsy();

            expect(autoLoginSuccess).withContext('login fails').toBeFalse();
            
        });

        it('should not automatically log user in if user token is expired', () => {

            const pastDate = new Date();
            pastDate.setHours(pastDate.getHours()-1);

            spyOn(window.localStorage, 'getItem').and
            .returnValue(JSON.stringify({...mockCurrentUser, _tokenExpirationDate: pastDate}));

            const autoLoginSuccess = authService.autoLogin();

            expect(authService.currentUser.getValue())
            .withContext('currentUser should not be set')
            .toBeFalsy();

            expect(autoLoginSuccess).withContext('login fails').toBeFalse();
            
        });

        afterAll(() => {
            authService.currentUser.next(null);
        });

    });

    describe('Testing user logout', () => {

        beforeEach(() => {
            authService.currentUser.next(new User(
                mockEmail,
                mockId,
                mockToken,
                mockExpiryDate
            ))

        });
        
        it('should log user out', () => {

            const clearSpy = spyOn(window.localStorage, 'clear');
            const routerSpy = spyOn(router, 'navigate');

            authService.logout();

            expect(authService.currentUser.getValue()).withContext('user is logged out').toBeFalsy();

            expect(clearSpy).withContext('User is cleared from localStorage').toHaveBeenCalledTimes(1);

            expect(authService.tokenTimeout).withContext('Token Timeout is clear').toBeFalsy();

            expect(routerSpy).withContext('User is routed to login').toHaveBeenCalledOnceWith(['/']);

        });

        afterAll(() => {
            authService.currentUser.next(null);
            authService.tokenTimeout = undefined;
        })

    });

    describe('Testing autologout', () => {

        beforeEach(() => {
            authService.currentUser.next(new User(
                mockEmail,
                mockId,
                mockToken,
                mockExpiryDate
            ));

        });

        it('should set logout timer', fakeAsync(() => {

            const logoutSpy = spyOn(authService, 'logout');

            authService.autoLogout(mockExpiryDate);

            expect(authService.tokenTimeout).withContext('Token timeout is initialized').toBeTruthy();

            tick(+mockExpiresIn*1000);

            expect(logoutSpy).toHaveBeenCalledTimes(1);
        }));

    });

    describe('Testing creating user from auth response', () => {

        beforeEach(() => {
            authService.currentUser.next(null);
        })

        it('should create the user', () => {
            const setItemSpy = spyOn(window.localStorage, 'setItem');

            authService.createAuthenticatedUser(mockAuthData);

            console.log('curr:'+JSON.stringify(authService.currentUser.getValue()));
            console.log('expDate:'+mockExpiryDate);

            expect({...authService.currentUser.getValue()})
            .withContext('User is set to the correct value')
            .toEqual(jasmine.objectContaining({...mockCurrentUser,
                _tokenExpirationDate: jasmine.objectContaining(mockCurrentUser._tokenExpirationDate)}));

            const stringToBeSaved = JSON.stringify(mockCurrentUser);

            expect(setItemSpy).toHaveBeenCalledOnceWith('currentUser', 
                jasmine.stringContaining(stringToBeSaved.substring(0, stringToBeSaved.length-9)));

        })

        afterAll(() => {
            authService.currentUser.next(null);
        })

    })

})