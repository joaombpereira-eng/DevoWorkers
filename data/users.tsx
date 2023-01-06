import {Role, roles} from './roles';

export type UserData = {
  userId: number;
  name: string;
  email: string;
  password: string;
  role: string;
  birthday: Date;
  avatar: string;
  projects: string[];
};
