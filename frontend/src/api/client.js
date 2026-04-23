import axios from 'axios';
import { Platform } from 'react-native';

// For Android emulator it's 10.0.2.2, for iOS simulator it's localhost
// Alternatively, replace with your local network IP if testing on physical device
const baseURL = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';

const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;
