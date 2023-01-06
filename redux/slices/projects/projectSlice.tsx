import {createSlice} from '@reduxjs/toolkit';
import {ProjectData} from '../../../data/projects';
import {RootState} from '../../store/store';

const initialState: ProjectData = {
  projectId: '',
  name: '',
  workforce: [],
  status: '',
  logo: '',
  startDate: new Date(),
  endDate: new Date(),
  budget: 0,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProject: (state, action) => {
      state.name = action.payload.name;
      state.workforce = action.payload.workForce;
      state.status = action.payload.status;
      state.logo = action.payload.logo;
      state.startDate = action.payload.startingDate;
      state.endDate = action.payload.endDate;
      state.budget = action.payload.budget;
    },
  },
});

export const {setProject} = projectSlice.actions;

export const selectProject = (state: RootState) => state.project;

export default projectSlice.reducer;
