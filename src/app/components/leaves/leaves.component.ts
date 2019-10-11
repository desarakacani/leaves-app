import {Component, OnInit} from '@angular/core';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Leave} from '../../models/leave';
import {AuthenticationService} from '../../services/authentication.service';
import {LeavesService} from '../../services/leaves.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from "@angular/router";

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css']
})
export class LeavesComponent implements OnInit {

  closeResult: string;
  leaveForm: FormGroup;
  leave: Leave;
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
      date: [null, Validators.required],
      reason: ['', Validators.required],
      approved: [false],
      fullyApproved: [false],
      user: [this.authService.getLoggedInUser()]
    });

    this.leaveService.getLeaves(this.authService.getLoggedInUser()).subscribe(leaves => {
      this.myLeaves = leaves;
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

    this.leave = Object.assign({}, this.leaveForm.value);
    console.log(this.leave);
    this.leaveService.addLeave(this.leave).subscribe(_ => {
      this.modalService.dismissAll();
    });
    this.toastr.success('Added with success!', 'Success');
    this.router.navigate(['/leaves']);
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
