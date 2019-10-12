import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {User} from '../../models/user';
import {isHr} from '../../util/utils';
import {isManager} from '../../util/utils';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Input() loggedIn: boolean;
  loggedInUser: User = null;

  constructor(private authService: AuthenticationService) {
  }

  ngOnInit() {

    if(this.loggedIn) {
      this.loggedInUser = this.authService.getLoggedInUser();
    }

    this.authService.getLoggedIn().subscribe(value => {
      if (value) {
        this.loggedInUser = this.authService.getLoggedInUser();
      }
    });
  }

  logOut() {
    this.authService.logout();
  }

  isHr(loggedInUser: User) {
    return isHr(loggedInUser);
  }

  isManager(loggedInUser: User) {
    return isManager(loggedInUser);
  }
}
