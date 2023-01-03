import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {projects} from '../../data/projects';
import {Status, status} from '../../data/status';
import {UserData} from '../../data/users';
import {RootState} from '../store/store';

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

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProject: (state, action) => {
      state.projects = action.payload;
    },
  },
});

export const {setProject} = projectsSlice.actions;

export const selectProjects = (state: RootState) => state.projects.projects;
export const selectProjectById = (state: RootState, id: string) =>
  state.projects.projects.filter(item => item.projectId === id);

export default projectsSlice.reducer;
