// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  async getData(endpoint) {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`);
    return await response.json();
  }

  async createUser(userData) {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return await response.json();
  }
}

export default new ApiService();