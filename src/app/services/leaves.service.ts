import {Injectable} from '@angular/core';
import {Leave} from '../models/leave';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {User} from '../models/user';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeavesService {

  constructor(private httpClient: HttpClient) {
  }

  addLeave(leave: Leave) {
    return this.httpClient.post(`${environment.baseUrl}/leaves`, leave);
  }

  getLeaves(user: User): Observable<Leave[]> {
    return this.httpClient.get<Leave[]>(`${environment.baseUrl}/leaves?user.id=${user.id}`);
  }

  updateLeave(leave: Leave) {
    return this.httpClient.patch(`${environment.baseUrl}/leaves/${leave.id}`, leave);
  }

}
