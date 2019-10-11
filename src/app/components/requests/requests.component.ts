import {Component, OnInit} from '@angular/core';
import {LeavesService} from '../../services/leaves.service';
import {RequestService} from '../../services/request.service';
import {Leave} from '../../models/leave';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {
  private userRequests: Leave[];

  constructor(private requestService: RequestService,
              private leaveService: LeavesService,
              private toastr: ToastrService) {
  }

  ngOnInit() {

    this.requestService.getUserRequest().subscribe(leaves => {
      this.userRequests = leaves;
    });

  }

  approve(leave: Leave) {
    leave.fullyApproved = true;
    leave.approved = true;
    this.leaveService.updateLeave(leave).subscribe(_ => {
      this.toastr.success('Request Approved!', 'Success');
    });
  }

  reject(leave: Leave) {
    leave.fullyApproved = false;
    leave.approved = false;
    this.leaveService.updateLeave(leave).subscribe(_ => {
    },
      error => {
        this.toastr.error(error.message, 'Request Rejected!');
      });
  }

}
