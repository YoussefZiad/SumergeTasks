import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-survey',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule, 
    MatStepperModule, 
    MatButtonModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './survey.component.html',
  styleUrl: './survey.component.css'
})
export class SurveyComponent {

  surveyForm = new FormGroup({
    steps: new FormArray([
      new FormGroup({
        name: new FormControl<string>('', {validators: [
          Validators.required
        ]}),
        age: new FormControl<number>(18, {validators: [
          Validators.required,
          Validators.min(18)
        ]}),
        gender: new FormControl<'Male' | 'Female'>('Male', {validators: [
          Validators.required
        ]}),
        nationality: new FormControl<string | null>(null, {validators: [
          Validators.required
        ]}),
        termsAndConditions: new FormControl<boolean>(false, {validators: [
          Validators.requiredTrue
        ]})
      }),
      new FormGroup({
        rate: new FormControl<number | null>(null, {validators: [
          Validators.required, Validators.min(1), Validators.max(5)
        ]}),
        liked: new FormControl<string>(''),
        disliked: new FormControl<string>('')
      }),
      new FormGroup({
        additionalComments: new FormControl<string>('')
      })
    ])
  });

}
