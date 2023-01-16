import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL} from '../util/constants';

export const axiosApiInstance = axios.create();

axiosApiInstance.interceptors.response.use(
  resp => resp,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await AsyncStorage.getItem('RefreshToken');
      const response = await axios.post(
        `${BASE_URL}/auth/refreshtoken`,
        refreshToken,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        originalRequest.headers[
          'Authorization'
        ] = `bearer ${response.data.data.accessToken}`;
        console.log(response.data.data.accessToken);
        console.log('Refreshed');
        console.log(originalRequest);

        return axiosApiInstance(originalRequest);
      }
    }
    return error;
  },
);
