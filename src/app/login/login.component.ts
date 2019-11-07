import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import {AuthService} from '.././service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  myForm: FormGroup;
  errorMessage: string = undefined;

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.myForm = this.fb.group({
      username: 'trader',
      password: 'trader123'
    });
  }

  onSubmit() {
    this.auth.login(this.myForm.value.username, this.myForm.value.password).subscribe(
      result => {
        console.log(result);
        this.errorMessage = undefined;
      },
      errors => {
        this.errorMessage = 'Incorrect credentials. Please try again.';
        this.initForm();
      }
    );
    console.log(this.myForm.value.username + ' ' + this.myForm.value.password);
  }

}
