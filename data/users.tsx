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

export const users: UserData[] = [
  {
    userId: 3,
    name: 'João Pereira',
    email: 'joao@devoteam.com',
    password: '1234567',
    role: 'SysAdmin',
    birthday: new Date('1995-07-28'),
    avatar: 'https://picsum.photos/seed/picsum/200/300',
    projects: ['projectacademy'],
  },
];
