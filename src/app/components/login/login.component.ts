import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../services/authentication.service';
import {LoginBody} from '../../models/login-body';
import {LeavesService} from '../../services/leaves.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  loginBody: LoginBody;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private authService: AuthenticationService) {
  }

  ngOnInit() {

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loginBody = Object.assign({}, this.loginForm.value);
    this.authService.login(this.loginBody).subscribe(data => {
      if (data.length > 0) {
        localStorage.setItem('user', JSON.stringify(data[0]));
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 200);

      } else {
        console.log('bad cred');
      }
    });
  }

  get f() {
    return this.loginForm.controls;
  }
}
