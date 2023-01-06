export type ProjectData = {
  projectId: string;
  name: string;
  workforce: number[];
  status: string;
  logo: string;
  startDate: Date;
  endDate: Date;
  budget: number;
};

export const projects: ProjectData[] = [
  {
    projectId: 'projectacademy',
    name: 'Project Academy',
    workforce: [3],
    status: 'Active',
    logo: '',
    startDate: new Date(),
    endDate: new Date(),
    budget: 1234.56,
  },
];
