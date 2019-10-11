import {Component, OnInit} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {BackendService} from '../../services/backend.service';
import {FormGroup} from '@angular/forms';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  closeResult: string;
  userForm: FormGroup;
  user: User;
  private users: User[];

  constructor(
    private backend: BackendService,
    private modalService: NgbModal,
    private userService: UserService) {
  }

  ngOnInit() {
    this.backend.getUsers().subscribe(users => {
      console.log(users[0].first_name);
      this.users = users;
    });
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onSubmit() {

    this.user = Object.assign({}, this.userForm.value);
    console.log(this.user);
    this.userService.addUser(this.user).subscribe(_ => {
      this.modalService.dismissAll();
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
