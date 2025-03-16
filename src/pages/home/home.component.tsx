import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '../../store/auth-store/auth.selectors';

const Home: React.FC = () => {
  const [apiResponse, setApiResponse] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const user = useSelector(selectAuthUser);

  const fetchUsers = async () => {
    setError(null);
    try {
      // const usersData = await getNewAPI();
      console.log('User state:', user);
      setApiResponse('usersData');
    } catch (err) {
      setError('Failed to fetch data - ' + err);
    }
  };

  return (
    <div>Some content is finna be here soon!
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