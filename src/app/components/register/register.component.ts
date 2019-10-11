import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AuthenticationService} from '../../services/authentication.service';
import {User} from '../../models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  signUpForm: FormGroup;
  submitted = false;
  user: User;
  constructor(private formBuilder: FormBuilder,
              private authService: AuthenticationService,
              private router: Router,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
      gender: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.signUpForm.invalid) {
      return;
    }

    this.user = Object.assign({}, this.signUpForm.value);

    this.authService.addUser(this.user).subscribe(user => {
      this.toastr.success('User created successfully', 'Success');
      this.router.navigate(['/users']);
    }, error => {
      this.toastr.error(error.message, 'Error!');
    });
  }

  get f() {
    return this.signUpForm.controls;
  }
}
