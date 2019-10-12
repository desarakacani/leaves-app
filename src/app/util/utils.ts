import {User} from '../models/user';
import {RoleEnum} from './role.enum';

export const isHr = (user: User) => {
  return user.role === RoleEnum.HR;
}
export const isManager = (user: User) => {
  return user.role === RoleEnum.MANAGER;
}
