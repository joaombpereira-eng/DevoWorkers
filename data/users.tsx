import {Role, roles} from './roles';

export type UserData = {
  userId: number;
  name: string;
  email: string;
  password: string;
  role: string;
  birthDate: Date;
  avatar: string;
  projects: string[];
};
