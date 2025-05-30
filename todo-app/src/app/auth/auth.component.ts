import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {

  loginMode = signal<boolean>(true);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  errorSig = signal<string>('');
  isLoading = signal<boolean>(false);
  router = inject(Router);

  loginForm = new FormGroup({
    emailFC: new FormControl(''),
    passwordFC: new FormControl('')
  })

  getErrorMessage(errCode: string){
    switch(errCode){
      case "EMAIL_EXISTS":
        return "There already is an account with this email.";
      case "TOO_MANY_ATTEMPTS_TRY_LATER":
        return "You made too many successive attempts. Try again later.";
      case "EMAIL_NOT_FOUND":
        return "There is no account with this email. Please sign up first.";
      case "INVALID_PASSWORD":
        return "The password is incorrect!";
      case "INVALID_LOGIN_CREDENTIALS":
        return "Email or password is incorrect!";
      default:
        return "An unknown error has occurred. Please try again later.";
    }
  }
  

  onSubmit(){
    this.errorSig.set('');
    const formControls = this.loginForm.controls;

    if(this.loginForm.invalid){
      if(formControls.emailFC.invalid){
        this.errorSig.set("Please enter a valid email address!");
      }
      else if(formControls.passwordFC.invalid){
        this.errorSig.set("Please enter a valid password (min 6 characters)");
      }
      return;
    }

    const email = formControls.emailFC.value!;
    const password = formControls.passwordFC.value!;

    this.isLoading.set(true);

    let authObs;

    if(this.loginMode()){
      authObs = this.authService.login(email, password);
    }
    else{
      authObs = this.authService.signup(email, password);
    }

    const subscription = authObs.subscribe({
      next: (value) => {
        console.log(value);
        this.router.navigate(['/todo'])
      },
      error: (err) => {
        this.errorSig.set(this.getErrorMessage(err?.error?.error?.message));
        this.isLoading.set(false);
        console.log(err);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    })

    this.destroyRef.onDestroy(() => subscription.unsubscribe())
  }

}
