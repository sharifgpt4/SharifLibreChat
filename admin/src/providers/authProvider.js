// authProvider.js
import config from "../config";

const apiUrl = `${config.api.host}/api`;

export default {
  login: async ({ username, password }) => {
    const request = new Request(`${apiUrl}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ password: password, email: username }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    const response = await fetch(request);
    if (response.status < 200 || response.status >= 300) {
      throw new Error(response.statusText);
    }
    const { token, user } = await response.json();
    if (user.role !== 'ADMIN') {
      throw new Error('Yo are not admin so fuck off');
    }

    localStorage.setItem('auth_token', token); // Store the token
  },
  logout: async () => {
    localStorage.removeItem('auth_token');
    // Optionally, call your backend to invalidate the token
    return Promise.resolve();
  },
  checkError: (error) => {
    // Implement check for unauthorized or forbidden response status
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem('auth_token');
      return Promise.reject();
    }
    return Promise.resolve();
  },
  checkAuth: () => {
    console.log('checking here...');
    return localStorage.getItem('auth_token') ? Promise.resolve() : Promise.reject();
  },
  getPermissions: () => Promise.resolve(),
};
