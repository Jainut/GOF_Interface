import { io } from 'socket.io-client';
import { getStoredToken } from './api';

const API_URL = import.meta.env.VITE_API_URL ?? window.location.origin;

const buildAuth = () => {
  const token = getStoredToken();
  return token ? { token, authorization: `Bearer ${token}` } : {};
};

const socket = io(API_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ['websocket', 'polling'],
  auth: buildAuth
});

export const connectSocket = () => {
  socket.auth = buildAuth();
  if (!socket.connected) socket.connect();
};

export const refreshSocketAuth = () => {
  socket.auth = buildAuth();
  if (socket.connected) {
    socket.disconnect();
    socket.connect();
  }
};

export default socket;
