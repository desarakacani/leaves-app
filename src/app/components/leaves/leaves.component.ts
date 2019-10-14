import {Component, OnInit} from '@angular/core';
import {NgbDate, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {Leave} from '../../models/leave';
import {AuthenticationService} from '../../services/authentication.service';
import {LeavesService} from '../../services/leaves.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {DateDifference} from '../../models/date-difference';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css']
})
export class LeavesComponent implements OnInit {

  maxDaysForLeave = 20;
  remainingDays;
  closeResult: string;
  leaveForm: FormGroup;
  leave: Leave;
  selectedLeaveToEdit: Leave = null;
  submitted = false;
  today = new Date();
  minDate = {
    year: this.today.getFullYear(),
    month: this.today.getMonth() + 1,
    day: this.today.getDate()
  };
  private myLeaves: Leave[];

  constructor(private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private authService: AuthenticationService,
              private leaveService: LeavesService,
              private router: Router,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.leaveForm = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      reason: [null, Validators.required]
    }, {validator: this.dateValidator('fromDate', 'toDate')});

    this.leaveService.getLeaves(this.authService.getLoggedInUser()).subscribe(leaves => {
      this.myLeaves = leaves;
      this.calculateRemainingDays();
    });
  }

  dateValidator = (field1, field2): ValidatorFn => {
    return (control: AbstractControl) => {
      const fromDate = NgbDate.from(control.get(field1).value);
      const toDate = NgbDate.from(control.get(field2).value);

      if (fromDate === null || toDate === null) {
        return {dateRequired: {valid: false}};
      }

      if (fromDate.before(toDate) && !fromDate.equals(toDate)) {
        return null;
      }
      return {dateError: {valid: false}};
    };
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.submitted = false;
      this.leaveForm.reset();
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.leaveForm.invalid) {
      return;
    }

    this.leave = Object.assign({}, this.leaveForm.value);
    this.leave.approved = false;
    this.leave.fullyApproved = false;
    this.leave.reject_reason = '';
    this.leave.rejected = false;
    this.leave.user = this.authService.getLoggedInUser();

    this.leaveService.addLeave(this.leave).subscribe(addedLeave => {
      this.submitted = false;
      this.modalService.dismissAll();
      this.toastr.success('Added with success!', 'Success');
      this.myLeaves.push(addedLeave);
    });

  }

  get f() {
    return this.leaveForm.controls;
  }

  calculateRemainingDays() {
    const approvedLeaves = this.myLeaves.filter(leave => leave.fullyApproved);
    const dates = approvedLeaves.map(leave => {
      return new DateDifference(leave.fromDate, leave.toDate);
    });
    let totalDays = 0;
    dates.forEach(date => {
      totalDays += date.calculateDifference();
    });
    this.remainingDays = this.maxDaysForLeave - totalDays;
  }

  delete(leave: Leave) {
    this.leaveService.delete(leave).subscribe(_ => {
      this.toastr.success('Leave deleted with success!');
      const index = this.myLeaves.indexOf(leave);
      this.myLeaves.splice(index, 1);
    });
  }

  edit(leave: Leave, content) {
    this.selectedLeaveToEdit = leave;
    this.leaveForm.get('fromDate').patchValue(leave.fromDate);
    this.leaveForm.get('toDate').patchValue(leave.toDate);
    this.leaveForm.get('reason').patchValue(leave.reason);

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.submitted = false;
      this.selectedLeaveToEdit = null;
      this.leaveForm.reset();
    });
  }

  update() {
    this.submitted = true;
    if (this.leaveForm.invalid) {
      return;
    }
    this.selectedLeaveToEdit.fromDate = this.leaveForm.get('fromDate').value;
    this.selectedLeaveToEdit.toDate = this.leaveForm.get('toDate').value;
    this.selectedLeaveToEdit.reason = this.leaveForm.get('reason').value;
    this.leaveService.updateLeave(this.selectedLeaveToEdit).subscribe(_ => {
      this.modalService.dismissAll();
      this.toastr.success('updated successfully');
    });
  }
}
