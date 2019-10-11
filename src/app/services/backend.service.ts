import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {LoginBody} from '../models/login-body';
import {environment} from '../../environments/environment';
import {User} from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class BackendService {

  users: string[];

  constructor(private httpClient: HttpClient) {
  }

  addUser(): Observable<any> {
   return  this.httpClient.post(`${environment.baseUrl}/users`, {
      id: 7,
      first_name: 'red',
      last_name: 'Yorston',
      email: 'test@nhs.uk',
      password: 'test',
      gender: 'Male',
      role: 'user'
    });
  }

  findUser(email: string) {
    this.getUsers().subscribe(data => {
      const user = data.filter(u => u.email === email);

      if (user.length === 0) {
        return null;
      }
      return user[0];
    });
  }

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${environment.baseUrl}/users`);
  }

}
