import {createSlice} from '@reduxjs/toolkit';
import {UserData} from '../../../data/users';
import {RootState} from '../../store/store';

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

type ProjectState = {
  projects: ProjectData[];
  loading: boolean;
  error: boolean;
};

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: false,
};

const projectsListSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = true;
    },
    setProjects: (state, action) => {
      state.loading = false;
      state.error = false;
      state.projects = action.payload;
    },
    setError: state => {
      state.error = true;
    },
  },
});

export const {setProjects, setError, setLoading} = projectsListSlice.actions;

export const selectProjects = (state: RootState) => state.projectsList;
export const selectProjectById = (state: RootState, id: string) =>
  state.projectsList.projects.filter(item => item.projectId === id);

export default projectsListSlice.reducer;
