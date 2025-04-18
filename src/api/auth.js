import API from './fetcher';

export const login = async (credentials) => {
  const res = await API.post('/users/login', credentials);
  localStorage.setItem('token', res.data.token);
  return res.data;
};

export const register = async (data) => {
  const res = await API.post('/users/register', data);
  localStorage.setItem('token', res.data.token);
  return res.data;
};

export const fetchUser = async () => {
  const res = await API.get('/users/me');
  return res.data;
};
