import {User} from './user';

export interface Leave {
  id: number;
  date: Date;
  reason: string;
  approved: boolean;
  fullyApproved: boolean;
  user: User;
}
