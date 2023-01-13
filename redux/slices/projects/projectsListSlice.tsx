import {createSlice} from '@reduxjs/toolkit';
import {ProjectData} from '../../../data/projects';
import {RootState} from '../../store/store';

type ProjectState = {
  projects: ProjectData[];
};

const initialState: ProjectState = {
  projects: [],
};

const projectsListSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
  },
});

export const {setProjects} = projectsListSlice.actions;

export const selectProjects = (state: RootState) => state.projectsList;
export const selectProjectById = (state: RootState, id: string) =>
  state.projectsList.projects.filter(item => item.projectId === id);

export default projectsListSlice.reducer;
