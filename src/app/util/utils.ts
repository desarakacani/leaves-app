import {User} from '../models/user';

export const isHr = (user: User) => {
  return user.role === 'HR';
}
export const isManager = (user: User) => {
  return user.role === 'manager';
}
