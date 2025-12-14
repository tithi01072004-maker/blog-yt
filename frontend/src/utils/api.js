import axios from 'axios';
import store from '../redux/store';
import { setUser } from '../redux/authSlice';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      store.dispatch(setUser(null));
      toast.error("Session expired. Redirecting to home.");
      window.location.replace('/'); // redirect without history flash
    }
    return Promise.reject(error);
  }
);

export default api;
