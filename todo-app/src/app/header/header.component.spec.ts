import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/auth.model';
import { AuthService } from '../services/auth.service';

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

  describe('Testing user data display', () => {

    it('avatar circle displays uppercase user initial', () => {
      const avatarText = fixture.nativeElement.querySelector('#avatar-text');

      expect(avatarText.textContent).toEqual('T');
    });

    it('user email is displayed', () => {
      const emailText = fixture.nativeElement.querySelector('#email-display');
      expect(emailText.textContent).toEqual(mockCurrentUser.email);
    })

  });

  describe('Testing user logout button', () => {

    it('should call logout on button click', () => {

      const componentLogoutSpy = spyOn(component, 'logout').and.callThrough();
      const serviceLogoutSpy = spyOn(authService, 'logout');

      const logoutButton = fixture.nativeElement.querySelector('#logout-button');

      logoutButton.click();

      expect(componentLogoutSpy)
      .withContext('click event called component logout').toHaveBeenCalledTimes(1);
      expect(serviceLogoutSpy)
      .withContext('component logout called service logout').toHaveBeenCalledTimes(1);
      
    });
    
  })


});
