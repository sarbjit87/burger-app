import axios from 'axios';

const instance = axios.create({
  baseURL : 'https://react-my-burger-a0473.firebaseio.com/'
});

export default instance;
