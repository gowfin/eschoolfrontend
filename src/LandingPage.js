// LandingPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [quizType, setQuizType] = useState('');
  const navigate = useNavigate();

  const handleStart = () => {
    if (quizType) {
      navigate(`/quiz/${quizType}`);
    } else {
      alert('Please select the Domain for the quiz.');
    }
  };

  return (
    <div style={styles.container}>
       <div style={styles.select}><b>CERTIFIED INFORMATION SYSTEM SECURITY PROFESSIONAL(CISSP) QUIZ</b></div>
      <h2>Select Quiz Domain</h2>
      <select
        value={quizType}
        onChange={e => setQuizType(e.target.value)}
        style={styles.select}
      >
        <option value="">-- Choose Domain --</option>
        <option value="domain1">Domain 1 - Security & Risk Management 16%</option>
        <option value="domain2">Domain 2 - Asset Security 10%</option>
        <option value="domain3">Domain 3 - Security Architecture and Engineering	13%</option>
        <option value="domain4">Domain 4 - Communication and Network Security	13%</option>
        <option value="domain5">Domain 5 - Identity and Access Management (IAM)	13%</option>
        <option value="domain6">Domain 6 - Security Assessment and Testing	12%</option>
        <option value="domain7">Domain 7 - Security Operations	13%</option>
        <option value="domain8">Domain 8 - Software Development Security	10%</option>
      </select>

      <button style={styles.button} onClick={handleStart}>
        Continue
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '500px',
    margin: '100px auto',
    padding: '30px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  select: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    marginTop: '20px',
    marginBottom: '30px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default LandingPage;
