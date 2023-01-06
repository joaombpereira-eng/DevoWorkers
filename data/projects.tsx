import {status, Status} from './status';
import {UserData, users} from './users';

export type ProjectData = {
  projectId: string;
  name: string;
  workForce: UserData[];
  status: string;
  logo: string;
  startingDate: Date;
  endDate: Date;
  budget: number;
};

export const projects: ProjectData[] = [
  {
    projectId: '0',
    name: 'Joshua Hines',
    workForce: [users[0], users[2]],
    status: 'status[0]',
    logo: 'https://picsum.photos/seed/picsum10/200/300',
    startingDate: new Date('2022-10-11'),
    endDate: new Date('2022-10-11'),
    budget: 5.847,
  },
  {
    projectId: '1',
    name: 'Fatima Scott',
    workForce: [users[3], users[4], users[5]],
    status: 'status[1]',
    logo: 'https://picsum.photos/seed/picsum11/200/300',
    startingDate: new Date('2022-10-12'),
    endDate: new Date(),
    budget: 3.505,
  },
  {
    projectId: '2',
    name: 'Madaline Franks',
    workForce: [users[1], users[2]],
    status: 'status[2]',
    logo: 'https://picsum.photos/seed/picsum12/200/300',
    startingDate: new Date('2022-10-13'),
    endDate: new Date(),
    budget: 7.405,
  },
  {
    projectId: '3',
    name: 'Eugenia Rose',
    workForce: [users[4], users[5]],
    status: 'status[1]',
    logo: 'https://picsum.photos/seed/picsum13/200/300',
    startingDate: new Date('2022-10-14'),
    endDate: new Date(),
    budget: 7.593,
  },
  {
    projectId: '4',
    name: 'Xenos Allen',
    workForce: [users[1], users[3]],
    status: 'status[0]',
    logo: 'https://picsum.photos/seed/picsum14/200/300',
    startingDate: new Date('2022-10-15'),
    endDate: new Date(),
    budget: 8.486,
  },
];
