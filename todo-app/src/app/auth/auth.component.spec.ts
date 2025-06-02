import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { AuthComponent } from './auth.component';
import { AuthResponse, User } from '../models/auth.model';
import { BehaviorSubject, delay, of, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let authService: AuthService;
  let router: Router;

  const mockExpiryDate = new Date();
  mockExpiryDate.setHours(mockExpiryDate.getHours()+1);
  const mockUser = new User('test@test.test', '', '', mockExpiryDate);

  const mockAuthData = {
      email: 'test@test.test',
      idToken: '',
      expiresIn: '',
      kind: '',
      refreshToken: '',
      localId: ''    
  }

  const mockAuthService = {
    currentUser: new BehaviorSubject<User | null>(null),
    login: (_:any, __:any) => null,
    signup: (_:any, __:any) => null
  }

  const mockRouter = {
    navigate: () => {}
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ],
      imports: [AuthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Testing Component Logic', () => {

    beforeEach(() => {
      component.loginMode.set(true);
      fixture.detectChanges();
    })

    it('form should initialize and validate correctly', () => {
      const form = component.loginForm;

      expect(form.controls.emailFC.value)
      .withContext('Email text box is initialized empty').toBeFalsy();

      expect(form.controls.passwordFC.value)
      .withContext('Password text box is initialized empty').toBeFalsy();

      expect(form.controls.emailFC.invalid)
      .withContext('Email FC should be invalid if empty').toBeTrue();

      expect(form.controls.passwordFC.invalid)
      .withContext('Password FC should be invalid if empty').toBeTrue();

      form.controls.emailFC.setValue('notavalidemail');
      form.controls.passwordFC.setValue('12345');

      expect(form.controls.emailFC.invalid)
      .withContext('Email FC should be invalid if it doesn\'t contain a valid email').toBeTrue();

      expect(form.controls.passwordFC.invalid)
      .withContext('Password FC should be invalid if it is shorter than 6 characters').toBeTrue();

      form.controls.emailFC.setValue('test@test.test');
      form.controls.passwordFC.setValue('123456');

      expect(form.controls.emailFC.valid)
      .withContext('Email FC should be valid if it contains a valid email').toBeTrue();

      expect(form.controls.passwordFC.valid)
      .withContext('Password FC should be valid if it is at least 6 characters').toBeTrue();

    });

    it('form submission should fail if form is invalid ', () => {

      const loginSpy = spyOn(authService, 'login');
      const signupSpy = spyOn(authService, 'signup');

      component.onSubmit();
      fixture.detectChanges();

      expect(component.errorSig())
      .withContext('form submission should fail if email field is invalid')
      .toEqual('INVALID_EMAIL_FIELD');

      component.loginForm.controls.emailFC.setValue('test@test.test');
      component.onSubmit();
      fixture.detectChanges();

      expect(component.errorSig())
      .withContext('form submission should fail if password field is invalid')
      .toEqual('INVALID_PASSWORD_FIELD');

      expect(loginSpy).withContext('login method is not called').not.toHaveBeenCalled();
      expect(signupSpy).withContext('signup method is not called').not.toHaveBeenCalled();

      
    });

    it('form submission should log user in in login mode'
      +' if authService authenticates the user ', fakeAsync(() => {
      const loginSpy = spyOn(authService, 'login')
        .and.returnValue(of<AuthResponse>(mockAuthData).pipe(delay(1)));
      const routerSpy = spyOn(router, 'navigate');
      const formControls = component.loginForm.controls;

      formControls.emailFC.setValue('test@test.test');
      formControls.passwordFC.setValue('123456');

      component.onSubmit();

      expect(component.isLoading()).withContext('loading starts').toBeTrue();
      expect(component.errorSig()).withContext('Error message is cleared').toBeFalsy();

      tick(1);

      expect(loginSpy).withContext('login function is called').toHaveBeenCalledTimes(1);
      expect(component.errorSig()).withContext('No error is produced').toBeFalsy();
      expect(component.isLoading()).withContext('loading stops').toBeFalse();
      expect(routerSpy)
      .withContext('User is routed to todo list').toHaveBeenCalledOnceWith(['/todo']);

    }));

    it('form submission should fail to log user in in login mode'+
       'if authService doesn\'t authenticate the user ', fakeAsync(() => {
        
      const loginSpy = spyOn(authService, 'login')
        .and.returnValue(of(mockAuthData).pipe(delay(1), switchMap(
          () => throwError(() => new Error('fail message'))
        )));
      const formControls = component.loginForm.controls;

      formControls.emailFC.setValue('test@test.test');
      formControls.passwordFC.setValue('123456');

      component.onSubmit();

      expect(component.isLoading()).withContext('loading starts').toBeTrue();
      expect(component.errorSig()).withContext('Error message is cleared').toBeFalsy();

      tick(1);

      expect(loginSpy).withContext('login function is called').toHaveBeenCalledTimes(1);
      expect(component.errorSig()).withContext('Error message is produced').toBeTruthy();
      expect(component.isLoading()).withContext('loading stops').toBeFalse();

    }));

    it('form submission should sign user up in signup mode'
      +' if authService authenticates the user ', fakeAsync(() => {
      component.loginMode.set(false);
      fixture.detectChanges();
      const signupSpy = spyOn(authService, 'signup')
        .and.returnValue(of<AuthResponse>(mockAuthData).pipe(delay(1)));
      const routerSpy = spyOn(router, 'navigate');
      const formControls = component.loginForm.controls;

      formControls.emailFC.setValue('test@test.test');
      formControls.passwordFC.setValue('123456');

      component.onSubmit();

      expect(component.isLoading()).withContext('loading starts').toBeTrue();
      expect(component.errorSig()).withContext('Error message is cleared').toBeFalsy();

      tick(1);

      expect(signupSpy).withContext('signup function is called').toHaveBeenCalledTimes(1);
      expect(component.errorSig()).withContext('No error is produced').toBeFalsy();
      expect(component.isLoading()).withContext('loading stops').toBeFalse();
      expect(routerSpy)
      .withContext('User is routed to todo list').toHaveBeenCalledOnceWith(['/todo']);

    }));

    it('form submission should fail to sign user up in signup mode'+
       'if authService doesn\'t authenticate the user ', fakeAsync(() => {
      component.loginMode.set(false);
      fixture.detectChanges();
      const signupSpy = spyOn(authService, 'signup')
        .and.returnValue(of(mockAuthData).pipe(delay(1), switchMap(
          () => throwError(() => new Error('fail message'))
        )));
      const formControls = component.loginForm.controls;

      formControls.emailFC.setValue('test@test.test');
      formControls.passwordFC.setValue('123456');

      component.onSubmit();

      expect(component.isLoading()).withContext('loading starts').toBeTrue();
      expect(component.errorSig()).withContext('Error message is cleared').toBeFalsy();

      tick(1);

      expect(signupSpy).withContext('login function is called').toHaveBeenCalledTimes(1);
      expect(component.errorSig()).withContext('Error message is produced').toBeTruthy();
      expect(component.isLoading()).withContext('loading stops').toBeFalse();

    }));

    afterAll(() => {
      component.loginMode.set(true);
      fixture.detectChanges();
    })

  });

  describe('Testing template logic', () => {

    beforeEach(() => {
      component.loginMode.set(true);
      component.errorSig.set('');
      fixture.detectChanges();
    })
      
    it('component renders correctly in default state', () => {
      const loginForm = fixture.debugElement.query(By.css('#login-form'));
      const emailField = fixture.debugElement.query(By.css('#email-field'));
      const passwordField = fixture.debugElement.query(By.css('#password-field'));
      const authButton = fixture.debugElement.query(By.css('#auth-button'));
      const modeButton = fixture.debugElement.query(By.css('#mode-button'));
      const loader = fixture.debugElement.query(By.css('#loader'));
      const errorMsg = fixture.debugElement.query(By.css('#error-msg'))

      expect(loginForm).withContext('login form is rendered').toBeTruthy();
      expect(emailField).withContext('email field is rendered').toBeTruthy();
      expect(passwordField).withContext('password field is rendered').toBeTruthy();
      expect(authButton).withContext('auth button is rendered').toBeTruthy();
      expect(modeButton).withContext('switch mode button is rendered').toBeTruthy();
      expect(loader).withContext('loader is not rendered when not loading').toBeFalsy();
      expect(errorMsg).withContext('error message is not rendered initially').toBeFalsy();

      expect(authButton.properties['value'])
      .withContext('auth button contains correct text in login mode').toEqual('Login');

      expect(modeButton.nativeElement.textContent.trim())
      .withContext('switch mode button contains correct text in login mode')
      .toEqual('Don\'t have an account? Click here to sign up!');

    });

    it('component should render correctly in signup mode', () => {
      const authButton = fixture.debugElement.query(By.css('#auth-button'));
      const modeButton = fixture.debugElement.query(By.css('#mode-button'));

      component.loginMode.set(false);
      fixture.detectChanges();

      expect(authButton.properties['value'])
      .withContext('auth button contains correct text in signup mode').toEqual('Sign Up');

      expect(modeButton.nativeElement.textContent.trim())
      .withContext('switch mode button contains correct text in signup mode')
      .toEqual('Already have an account? Click here to login!');
    });

    it('error message should be rendered if there is an error', () => {
      component.errorSig.set('UNKNOWN');
      fixture.detectChanges();

      const errorMsg = fixture.debugElement.query(By.css('#error-msg'));

      expect(errorMsg).withContext('error message is rendered').toBeTruthy();

      expect(errorMsg.nativeElement.textContent.trim())
      .withContext('UI error message displays correctly')
      .toEqual('An unknown error has occurred. Please try again later.')
    });

    afterAll(() => {
      component.loginMode.set(true);
      component.errorSig.set('');
      fixture.detectChanges();
    });

  });

  describe('Testing Interaction', () => {

    beforeEach(() => {
      component.loginMode.set(true);
      fixture.detectChanges();
    })

    it('form submission should fire submit function', () => {
      const loginForm = fixture.debugElement.query(By.css('#login-form'));
      const submitSpy = spyOn(component, 'onSubmit');

      loginForm.triggerEventHandler('submit');

      expect(submitSpy).toHaveBeenCalledTimes(1);
    });

    it('switch mode button should toggle login mode', () => {
      const modeButton = fixture.debugElement.query(By.css('#mode-button'));

      modeButton.triggerEventHandler('click');
      fixture.detectChanges();

      expect(component.loginMode()).withContext('switches to signup mode').toBeFalse();

      modeButton.triggerEventHandler('click');
      fixture.detectChanges();

      expect(component.loginMode()).withContext('switches to login mode').toBeTrue();
    });
  })
});
