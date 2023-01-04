import {createSlice} from '@reduxjs/toolkit';
import {projects} from '../../../data/projects';
import {Status} from '../../../data/status';
import {UserData} from '../../../data/users';
import {RootState} from '../../store/store';

export type ProjectData = {
  projectId: string;
  name: string;
  workForce: UserData[];
  status: Status;
  logo: string;
  startingDate: Date;
  endDate: Date;
  budget: number;
};

type ProjectState = {
  projects: ProjectData[];
};

const initialState: ProjectState = {
  projects: projects,
};

const projectsListSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProject: (state, action) => {
      state.projects = action.payload;
    },
  },
});

export const {setProject} = projectsListSlice.actions;

export const selectProjects = (state: RootState) => state.projectsList.projects;
export const selectProjectById = (state: RootState, id: string) =>
  state.projectsList.projects.filter(item => item.projectId === id);

export default projectsListSlice.reducer;
