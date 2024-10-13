import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Wysyłamy zapytanie do Django API
    axios.get('/api/hello/')
      .then((response) => setMessage(response.data.message))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>{message ? message : "Loading..."}</h1>
    </div>
  );
}

export default App;