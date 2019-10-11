import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {LoginBody} from '../models/login-body';
import {BackendService} from './backend.service';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private loggedIn = new Subject<boolean>();

  constructor(private router: Router,
              private backend: BackendService,
              private httpClient: HttpClient) {
  }

  addUser(user: User): Observable<User> {
    return this.httpClient.post<User>(`${environment.baseUrl}/users`, user);
  }

  login(loginBody: LoginBody): Observable<User[]> {
    return this.httpClient.get<User[]>(`${environment.baseUrl}/users?email=${loginBody.username}&password=${loginBody.password}`);
  }

  logout() {
    this.loggedIn.next(false);
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }


  isLoggedIn() {
    const user = JSON.parse(localStorage.getItem('user'));
    return !!user;
  }

  getLoggedIn() {
    return this.loggedIn.asObservable();
  }

  getLoggedInUser() {
    if (this.loggedIn) {
      return  JSON.parse(localStorage.getItem('user'));
    }
  }
}
