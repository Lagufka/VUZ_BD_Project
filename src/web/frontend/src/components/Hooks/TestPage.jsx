// src/components/DataComponent.jsx
import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

function TestPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await apiService.getData();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      const userData = { name: 'John', email: 'john@example.com' };
      const result = await apiService.createUser(userData);
      console.log('User created:', result);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Data from Flask:</h1>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      <button onClick={handleCreateUser}>Create User</button>
    </div>
  );
}

export default TestPage;