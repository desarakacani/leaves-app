import {Component, OnInit} from '@angular/core';
import {ModalDismissReasons, NgbDate, NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {Leave} from '../../models/leave';
import {AuthenticationService} from '../../services/authentication.service';
import {LeavesService} from '../../services/leaves.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css']
})
export class LeavesComponent implements OnInit {

  closeResult: string;
  leaveForm: FormGroup;
  leave: Leave;
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
    });
  }

  dateValidator = (field1, field2): ValidatorFn => {
    return (control: AbstractControl) => {
      const fromDate = NgbDate.from(control.get(field1).value);
      const toDate = NgbDate.from(control.get(field2).value);

      if (fromDate === null && toDate === null) {
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
}
