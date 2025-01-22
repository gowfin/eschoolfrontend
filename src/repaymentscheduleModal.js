import React, { useState, useEffect } from 'react';
import axios from 'axios';
import loadingGif from './loading.gif'; // Ensure you have this file

const RepayscheduleModal = ({ isOpen, onClose, loanID: initialLoanID, custno: initialCustno, localhost }) => {
  const [loanID, setLoanID] = useState(initialLoanID || '');
  const [custno, setCustno] = useState(initialCustno || '');
  const [schedule, setSchedule] = useState([]);
  const [searching, setSearching] = useState(false);
  const [err, setErr] = useState('');

  // Fetch loan schedule when modal opens and loanID and custno are valid
  useEffect(() => {
    if (isOpen && loanID && custno) {
      fetchSchedule();
    }
  }, [isOpen, loanID, custno]);

  const fetchSchedule = async () => {
    setSearching(true);
    setErr('');
    try {
      const response = await axios.post(`${localhost}/getrepaymentschedule`, {
        loanID,
        custno,
      });
      setSchedule(response.data);
    } catch (error) {
      console.error('Error fetching loan schedule:', error);
      setErr('Failed to fetch loan schedule. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h2>Loan Schedule</h2>
        <button style={modalStyles.closeButton} onClick={onClose}>
          &times;
        </button>
        <div>
          <label>
            Loan ID:
            <input
              type="text"
              value={loanID}
              onChange={(e) => setLoanID(e.target.value)}
            />
          </label>
          <label>
            Customer Number:
            <input
              type="text"
              value={custno}
              onChange={(e) => setCustno(e.target.value)}
            />
          </label>
          <button onClick={fetchSchedule} disabled={searching}>
            {searching ? 'Fetching...' : 'Fetch Schedule'}
          </button>
        </div>

        {searching && <img src={loadingGif} alt="Loading..." style={{ display: 'block', margin: '20px auto' }} />}
        {err && <p style={{ color: 'red' }}>{err}</p>}

        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Date</th>
              <th>Balance</th>
              <th>Repay+Int</th>
              <th>Principal Repay</th>
              <th>Interest</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.Date?.substring(0, 10)}</td>
                <td>{item.RunningBal}</td>
                <td>{item.RepayWithInt}</td>
                <td>{item.PrinRepay}</td>
                <td>{item.IntRepay}</td>
                <td>
                  {item.servicedInt + item.servicedPrin >= item.repaywithint
                    ? 'Serviced'
                    : item.servicedInt + item.servicedPrin > 0
                    ? 'Partially Serviced'
                    : 'Not Serviced'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button style={{color:'red'}} onClick={onClose} disabled={searching}> [X] Close</button>
      </div>
      
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '80%',
    maxHeight: '90%',
    overflowY: 'auto',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
};

export default RepayscheduleModal;
