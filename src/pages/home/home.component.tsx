import React, { useState } from 'react';
import { getNewAPI } from '../../api/user-api';

const Home: React.FC = () => {
  const [apiResponse, setApiResponse] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setError(null);
    try {
      const usersData = await getNewAPI();
      setApiResponse(usersData);
    } catch (err) {
      setError('Failed to fetch data - ' + err);
    }
  };

  return (
    <div>Hoe wors
      <button
        onClick={fetchUsers}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
      >
        Fetch Data
      </button>
      {
        apiResponse && <div>{apiResponse}</div>
      }
      {
        error && <div>{error}</div>
      }
    </div>
  );
};

export default Home;