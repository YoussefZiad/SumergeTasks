import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/auth.model';
import { AuthService } from '../services/auth.service';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: AuthService;

  const mockExpiryDate = new Date();
  mockExpiryDate.setHours(mockExpiryDate.getHours() + 1);
  const mockCurrentUser = new User('test@test.test','','',mockExpiryDate);

  const mockAuthService = {
    currentUser: new BehaviorSubject<User>(mockCurrentUser),
    logout: () => {}
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {provide: AuthService, useValue: mockAuthService}
      ],
      imports: [HeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    authService = TestBed.inject(AuthService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Testing Component Logic', () => {

    it('currentUser is bound to the correct value', () => {
      expect({...component.currentUser()}).toEqual(jasmine.objectContaining({...mockCurrentUser}))
    })

    it('logout method calls the auth service to log the user out', () => {
      const serviceLogoutSpy = spyOn(authService, 'logout');

      component.logout();

      expect(serviceLogoutSpy)
      .withContext('component logout called service logout').toHaveBeenCalledTimes(1);
    })

  });

  describe('Testing Template Rendering', () => {

    it('header is rendered correctly', () => {
      const avatar = fixture.debugElement.query(By.css('#avatar'));
      const avatarText = fixture.debugElement.query(By.css('#avatar-text'));

      expect(avatar).withContext('avatar circle should be displayed').toBeTruthy()
      expect(avatarText.nativeElement.textContent).withContext('user initial should be displayed').toEqual('T');

      const emailText = fixture.debugElement.query(By.css('#email-display'));

      expect(emailText.nativeElement.textContent)
      .withContext('user email should be displayed').toEqual(mockCurrentUser.email);

      const title = fixture.debugElement.query(By.css('#title'));
      const subtitle = fixture.debugElement.query(By.css('#subtitle'));

      expect(title).withContext('title should be displayed').toBeTruthy();
      expect(subtitle).withContext('subtitle should be displayed').toBeTruthy();
      
    });

  });

  describe('Testing Interaction', () => {

    it('should call logout on button click', () => {

      const componentLogoutSpy = spyOn(component, 'logout');

      const logoutButton = fixture.debugElement.query(By.css('#logout-button'));

      logoutButton.triggerEventHandler('click');

      expect(componentLogoutSpy)
      .withContext('click event called component logout').toHaveBeenCalledTimes(1);
      
    });
    
  })

});
