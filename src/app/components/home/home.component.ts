import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private user: User;
  constructor(private authenticationService: AuthenticationService,
              private userService: UserService) { }

  ngOnInit() {
    const userLoggedInId = this.authenticationService.getLoggedInUser().id;
    this.userService.getUser(userLoggedInId).subscribe(user => {
      this.user = user;
    });
  }
}
