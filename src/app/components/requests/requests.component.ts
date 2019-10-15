import {Component, OnInit} from '@angular/core';
import {LeavesService} from '../../services/leaves.service';
import {RequestService} from '../../services/request.service';
import {Leave} from '../../models/leave';
import {ToastrService} from 'ngx-toastr';
import {User} from '../../models/user';
import {RoleEnum} from '../../util/role.enum';
import {AuthenticationService} from '../../services/authentication.service';
import {isHr, isManager} from '../../util/utils';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  private userRequests: Leave[];
  closeResult: string;
  loggedInUser: User;
  rejectReason = '';

  selectedRequestForRejection: Leave;

  constructor(private requestService: RequestService,
              private leaveService: LeavesService,
              private toastr: ToastrService,
              private authService: AuthenticationService,
              private modalService: NgbModal) {
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
      const sentToHR = isManager(this.loggedInUser) ? 'Sent to HR!' : '';
      this.toastr.success('Request Approved! ' + sentToHR, 'Success');
      if (this.loggedInUser.role === RoleEnum.MANAGER) {
        this.requestService.getUserRequest().subscribe(requests => {
          this.userRequests = requests;
        });
      } else {
        this.requestService.getApprovedUserRequest().subscribe(requests => {
          this.userRequests = requests;
        });
      }
    });
  }

  reject() {
    this.selectedRequestForRejection.fullyApproved = false;
    this.selectedRequestForRejection.rejected = true;
    this.selectedRequestForRejection.reject_reason = this.rejectReason;
    this.leaveService.updateLeave(this.selectedRequestForRejection).subscribe(_ => {
        this.toastr.error('Request Rejected!');
        this.modalService.dismissAll();
      });
  }

  isManager() {
    return isManager(this.loggedInUser);
  }

  isHr() {
    return isHr(this.loggedInUser);
  }

  open(content, req: Leave) {
    this.selectedRequestForRejection = req;
    this.rejectReason = '';
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
    });
  }
}
