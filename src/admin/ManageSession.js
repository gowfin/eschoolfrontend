import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../account.css';
import loadingGif from '../loading.gif'; // Your loading gif file
import Dateformat from '../formatdate';
// import { localhost } from '../env.js';

const SessionMgt = ({ state }) => {
  const {localhost}= state;
  const [sessionDate, setSessionDate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize sessionDate with the current date in YYYY-MM-DD format
  useEffect(() => {
    const today = Dateformat(new Date());
        setSessionDate(today);
  }, []);

  const handleDate = async (e) => {
    e.preventDefault(); // Prevent form submission
    setLoading(true); // Set loading state

    try {
      const response = await axios.post(`${localhost}/set_session_date`, {
        ses_date: sessionDate, // Send the session date as a body parameter
      });
      setMessage(response.data.message); // Access message from response
      // console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Error fetching data.'); // Handle error
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <form onSubmit={handleDate}>
      <label>
        {message && (
          <p
            className="message"
            style={{
              color: message.includes('successful') ? 'green' : 'red',
            }}
          >
            {message}
          </p>
        )}
        Set Session Date:
        <input
          type="date"
          name="sesdate"
          value={sessionDate}
          onChange={(e) => setSessionDate(e.target.value)} // Update sessionDate on change
        />
      </label>
      {/* Submit Button with Loading State */}
      <button type="submit" disabled={loading}>
        {loading ? (
          <img src={loadingGif} alt="Loading..." style={{ width: '20px', height: '20px' }} />
        ) : (
          'Submit'
        )}
      </button>
    </form>
  );
};

export default SessionMgt;
