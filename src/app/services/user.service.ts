import {Injectable} from '@angular/core';
import {User} from '../models/user';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  addUser(user: User) {
    return this.httpClient.post(`${environment.baseUrl}/users`, user);
  }

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${environment.baseUrl}/users`);
  }

  updateUser(user: User) {
    return this.httpClient.patch(`${environment.baseUrl}/users/${user.id}`, user);
  }

  delete(user: User) {
    return this.httpClient.delete(`${environment.baseUrl}/users/${user.id}`);
  }
}
