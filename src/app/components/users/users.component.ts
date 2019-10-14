import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {ToastrService} from 'ngx-toastr';
import {RoleEnum} from '../../util/role.enum';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  closeResult: string;
  submitted = false;
  userForm: FormGroup;
  user: User;
  selectedUserToEdit: User = null;
  private users: User[];

  private roles = [RoleEnum.USER, RoleEnum.MANAGER];

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService) {
  }

  ngOnInit() {

    this.userForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      role: [null, Validators.required],
      gender: [null, Validators.required],
      password: ['', Validators.required]
    });
    this.userService.getUsers().subscribe(users => {
      this.users = users.filter(user => user.role !== RoleEnum.HR);
    });
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.submitted = false;
      this.userForm.reset();
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }
    this.user = Object.assign({}, this.userForm.value);
    this.userService.addUser(this.user).subscribe(addedUser => {
      this.submitted = false;
      this.modalService.dismissAll();
      this.toastr.success('Added with success!', 'Success');
      this.users.push(addedUser as User);
    });
  }

  edit(user: User, content) {
    this.selectedUserToEdit = user;
    this.userForm.get('first_name').patchValue(user.first_name);
    this.userForm.get('last_name').patchValue(user.last_name);
    this.userForm.get('email').patchValue(user.email);
    this.userForm.get('role').patchValue(user.role);
    this.userForm.get('gender').patchValue(user.gender);
    this.userForm.get('password').patchValue(user.password);

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.submitted = false;
      this.selectedUserToEdit = null;
      this.userForm.reset();
    });
  }

  update() {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }
    this.selectedUserToEdit.first_name = this.userForm.get('first_name').value;
    this.selectedUserToEdit.last_name = this.userForm.get('last_name').value;
    this.selectedUserToEdit.email = this.userForm.get('email').value;
    this.selectedUserToEdit.role = this.userForm.get('role').value;
    this.selectedUserToEdit.gender = this.userForm.get('gender').value;
    this.selectedUserToEdit.password = this.userForm.get('password').value;
    this.userService.updateUser(this.selectedUserToEdit).subscribe(_ => {
      this.modalService.dismissAll();
      this.toastr.success('updated successfully');
    });
  }

  delete(user: User) {
    this.userService.delete(user).subscribe(_ => {
      this.toastr.success('User deleted with success!');
      const index = this.users.indexOf(user);
      this.users.splice(index, 1);
    });
  }

  get f() {
    return this.userForm.controls;
  }
}
