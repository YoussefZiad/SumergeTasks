import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { UIErrorMessagePipe } from '../pipes/ui-error-msg.pipe';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, UIErrorMessagePipe],
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
    emailFC: new FormControl('', {validators: [
      Validators.required, Validators.email
    ]}),
    passwordFC: new FormControl('', {validators: [
      Validators.required, Validators.minLength(6)
    ]})
  })
  
  onSubmit(){
    this.errorSig.set('');
    const formControls = this.loginForm.controls;

    if(this.loginForm.invalid){
      if(formControls.emailFC.invalid){
        this.errorSig.set("INVALID_EMAIL_FIELD");
      }
      else if(formControls.passwordFC.invalid){
        this.errorSig.set("INVALID_PASSWORD_FIELD");
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
      next: (_) => {
        this.router.navigate(['/todo'])
      },
      error: (err) => {
        this.errorSig.set(err?.error?.error?.message || 'UNKNOWN');
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
