import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  let authService: AuthService;
  let router: Router;

  const mockRouter = {
    navigate: () => null
  }

  const mockAuthService = {
    autoLogin: () => null
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {provide: AuthService, useValue: mockAuthService},
        {provide: Router, useValue: mockRouter},
      ],
      imports: [AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  describe('Testing Component Logic', () => {
    it('should attempt to log user in and route user to todo list on success', () => {
      const autoLoginSpy = spyOn(authService, 'autoLogin').and.returnValue(true);
      const routerSpy = spyOn(router, 'navigate');

      fixture.detectChanges();

      expect(autoLoginSpy).toHaveBeenCalledTimes(1);
      expect(routerSpy).toHaveBeenCalledOnceWith(['/todo']);
    });

    it('should not route user if autologin fails', () => {
      const autoLoginSpy = spyOn(authService, 'autoLogin').and.returnValue(false);
      const routerSpy = spyOn(router, 'navigate');

      fixture.detectChanges();

      expect(autoLoginSpy).toHaveBeenCalledTimes(1);
      expect(routerSpy).not.toHaveBeenCalled();
    })
  });

});
