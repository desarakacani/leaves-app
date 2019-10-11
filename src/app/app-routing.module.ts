import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {LeavesComponent} from './components/leaves/leaves.component';
import {UsersComponent} from './components/users/users.component';
import {RequestsComponent} from './components/requests/requests.component';
import {AuthGuard} from './guards/auth.guard';
import {HrGuard} from './guards/hr.guard';
import {AppComponent} from './app.component';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent, canActivate: [AuthGuard]},
  {path: 'leaves', component: LeavesComponent, canActivate: [AuthGuard]},
  {path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
  {path: 'requests', component: RequestsComponent, canActivate: [AuthGuard, HrGuard]},

  // otherwise redirect to home
  {path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
