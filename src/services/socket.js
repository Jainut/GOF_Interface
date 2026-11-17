import { io } from 'socket.io-client';
import { demoEnabled } from '../demo/demoApi';
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
  if (demoEnabled) return;
  socket.auth = buildAuth();
  if (!socket.connected) socket.connect();
};

export const refreshSocketAuth = () => {
  if (demoEnabled) return;
  socket.auth = buildAuth();
  if (socket.connected) {
    socket.disconnect();
    socket.connect();
  }
};

export default socket;
