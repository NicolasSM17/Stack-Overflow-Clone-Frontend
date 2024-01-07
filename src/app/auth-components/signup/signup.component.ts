import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth-services/auth-service/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  signupForm: FormGroup | undefined;

  constructor(private authService: AuthService, private formBuilder: FormBuilder,
              private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(){
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {validator: this.confirmationValidator});
  }

  private confirmationValidator(formGroup: FormGroup){
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if(password != confirmPassword){
      formGroup.get('confirmPassword')?.setErrors({passwordMismatch: true});
    } else{
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  signup(){
    console.log(this.signupForm.value);

    this.authService.signup(this.signupForm.value).subscribe(
      (response) => {
        console.log(response);

        if(response.id != null){
          this.snackBar.open("You're registered successfully!", 'Close',
                             {duration: 5000});

          this.router.navigateByUrl('/login');
        } else{
          this.snackBar.open(response.meesage, 'Close', {duration: 5000});
        }
      },
      (error: any) => {
        this.snackBar.open("Registration failed, Please try again later", 'Close', {duration: 5000});
      }
    );
  }
}
