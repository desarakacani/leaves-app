import { Injectable } from '@angular/core';
import {User} from '../models/user';
import {Observable} from 'rxjs';
import {Leave} from '../models/leave';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private httpClient: HttpClient) { }

  getUserRequest(): Observable<Leave[]> {
    return this.httpClient.get<Leave[]>(`${environment.baseUrl}/leaves`);
  }
}
