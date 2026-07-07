import { io } from 'socket.io-client';
import { getStoredToken } from './api';

const socket = io(import.meta.env.VITE_API_URL, {
  withCredentials: true,
  auth: () => {
    const token = getStoredToken();
    return token ? { token } : {};
  }
});

export const refreshSocketAuth = () => {
  const token = getStoredToken();
  socket.auth = token ? { token } : {};

  if (socket.connected) {
    socket.disconnect().connect();
  } else {
    socket.connect();
  }
};

export default socket;
