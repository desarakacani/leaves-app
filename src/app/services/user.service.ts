import { Injectable } from '@angular/core';
import {User} from '../models/user';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  addUser(user: User) {
    return this.httpClient.post(`${environment.baseUrl}/users`, user);
  }
}
