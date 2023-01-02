import {ProjectData, projects} from './projects';
import {Role, roles} from './roles';

export type UserData = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
  birthday: Date;
  avatar: string;
  project: string[];
};

export const users: UserData[] = [
  {
    id: 0,
    name: 'João Pereira',
    email: 'joao@devoteam.com',
    password: '1234567',
    role: roles[0],
    birthday: new Date('1995-07-28'),
    avatar: 'https://picsum.photos/seed/picsum/200/300',
    project: ['0', '2'],
  },
  {
    id: 1,
    name: 'Miguel Barbosa',
    email: 'miguel@devoteam.com',
    password: '12345678',
    role: roles[1],
    birthday: new Date('1979-11-30'),
    avatar: 'https://picsum.photos/seed/picsum1/200/300',
    project: ['3', '4'],
  },
  {
    id: 2,
    name: 'Demetria Fitzpatrick',
    email: 'lobortis.risus@google.couk',
    password: 'DMG28VNM1UF',
    role: roles[2],
    birthday: new Date('2000-01-16'),
    avatar: 'https://picsum.photos/seed/picsum2/200/300',
    project: ['1', '2'],
  },
  {
    id: 3,
    name: 'Ulric House',
    email: 'eget.massa.suspendisse@google.com',
    password: 'GLV31LGD1EO',
    role: roles[3],
    birthday: new Date('1998-02-01'),
    avatar: 'https://picsum.photos/seed/picsum3/200/300',
    project: ['4', '2'],
  },
  {
    id: 4,
    name: 'Baxter Durham',
    email: 'sodales.mauris@yahoo.couk',
    password: 'BLS24PSG8RU',
    role: roles[4],
    birthday: new Date('1992-09-06'),
    avatar: 'https://picsum.photos/seed/picsum4/200/300',
    project: ['0', '3'],
  },
  {
    id: 5,
    name: 'Steel Pruitt',
    email: 'enim.suspendisse@hotmail.couk',
    password: 'DYU99WRW4ND',
    role: roles[2],
    birthday: new Date('1987-01-16'),
    avatar: 'https://picsum.photos/seed/picsum5/200/300',
    project: ['1'],
  },
];
