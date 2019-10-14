import {NgbDate} from '@ng-bootstrap/ng-bootstrap';

import * as moment from 'moment';

export class DateDifference {
  private _from: NgbDate;
  private _to: NgbDate;

  constructor(from: NgbDate, to: NgbDate) {
    this._from = from;
    this._to = to;
  }


  get from(): NgbDate {
    return this._from;
  }

  set from(value: NgbDate) {
    this._from = value;
  }

  get to(): NgbDate {
    return this._to;
  }

  set to(value: NgbDate) {
    this._to = value;
  }

  public calculateDifference() {
    const fromMoment = moment().year(this.from.year).month(this.from.month).date(this.from.day);
    const toMoment = moment().year(this.to.year).month(this.to.month).date(this.to.day);
    return toMoment.diff(fromMoment, 'days') + 1;
  }

}
