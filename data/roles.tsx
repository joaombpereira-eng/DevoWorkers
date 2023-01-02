export type Role = {
  id: number;
  name: string;
};

export const roles: Role[] = [
  {
    id: 0,
    name: 'SysAdmin',
  },
  {
    id: 1,
    name: 'Project Manager',
  },
  {
    id: 2,
    name: 'Developer',
  },
  {
    id: 3,
    name: 'QA',
  },
  {
    id: 4,
    name: 'Designer',
  },
];
