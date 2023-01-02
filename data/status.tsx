export type Status = {
  id: number;
  name: string;
};

export const status: Status[] = [
  {
    id: 0,
    name: 'To Start',
  },
  {
    id: 1,
    name: 'Active',
  },
  {
    id: 2,
    name: 'Finished',
  },
];
