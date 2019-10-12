import {Component, OnInit} from '@angular/core';
import {LeavesService} from '../../services/leaves.service';
import {RequestService} from '../../services/request.service';
import {Leave} from '../../models/leave';
import {ToastrService} from 'ngx-toastr';
import {User} from '../../models/user';
import {RoleEnum} from '../../util/role.enum';
import {AuthenticationService} from '../../services/authentication.service';
import {isHr, isManager} from '../../util/utils';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  private userRequests: Leave[];
  loggedInUser: User;

  constructor(private requestService: RequestService,
              private leaveService: LeavesService,
              private toastr: ToastrService,
              private authService: AuthenticationService) {
  }

  ngOnInit() {

    this.loggedInUser = this.authService.getLoggedInUser();

    if (this.loggedInUser.role === RoleEnum.HR) {
      this.requestService.getApprovedUserRequest().subscribe(leaves => {
        this.userRequests = leaves;
      });
    } else {
      this.requestService.getUserRequest().subscribe(leaves => {
        this.userRequests = leaves;
      });
    }
  }


  approve(leave: Leave) {

    if (this.isManager()) {
      leave.approved = true;
    } else {
      leave.fullyApproved = true;
      leave.approved = true;
    }

    this.leaveService.updateLeave(leave).subscribe(_ => {
      this.toastr.success('Request Approved!', 'Success');
    });
  }

  reject(leave: Leave) {
    leave.fullyApproved = false;
    leave.approved = false;
    this.leaveService.updateLeave(leave).subscribe(_ => {
        this.toastr.error('Request Rejected!');
      },
      error => {

      });
  }

  isManager() {
    return isManager(this.loggedInUser);
  }

  isHr() {
    return isHr(this.loggedInUser);
  }
}
