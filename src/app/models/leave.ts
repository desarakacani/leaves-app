import {User} from './user';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';

export interface Leave {
  id: number;
  date: NgbDate;
  reason: string;
  fromDate: NgbDate;
  toDate: NgbDate;
  approved: boolean;
  fullyApproved: boolean;
  user: User;
}
