import React from 'react';

const Modal = ({ accountHistory, isHistoryOpen, setIsHistoryOpen, message, error }) => {
  if (!isHistoryOpen) return null;
const balance=0;
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <h2 style={styles.header}>Account History</h2>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
         
              <tr>
            <th>Transaction ID</th>
            <th>Value Date</th>
            <th>Account ID</th>
            <th>Statement Reference</th>
            <th>Transaction Number</th>
            <th>Amount</th>
            <th>Running Balance</th>
            <th>Posted By</th>
          </tr>
            
            </thead>
            <tbody>
            {accountHistory.map((item, index) =>{
           
           const tranid = item.tranid;
          const isRunBalNegative = balance < 0;
           const isAmountNegative = tranid ==='005' || tranid === 'R001' || tranid === 'R002' || tranid === '059' ||tranid === '010' ||tranid === 'R010'; //loan reversal need -(-amount) to make it positive
          // tempbal=isAmountNegative ? balance-item.amount:balance+ item.amount;
          
          return(
          
          <tr key={index}>
            <td>{item.tranid}</td>
            <td>{item.ValueDate}</td>
            <td>{item.AccountID}</td>
            <td>{item.Stmtref}</td>
            <td>{item.transactionNbr}</td>
            <td style={{ fontWeight: 'bold', color: isAmountNegative ? 'red' : 'green' }}>{isAmountNegative ? `₦${Number(item.amount).toLocaleString()}` : `₦${item.amount.toLocaleString()}`}</td>
            <td style={{ fontWeight: 'bold', color: isRunBalNegative ? 'red' : 'green' }}>{`₦${item.Runningbal.toLocaleString()}`}</td>
            <td>{item.CreatedBy}</td>
          </tr>
        )}) }
        
            </tbody>
          </table>
        </div>
        {message && <p style={styles.message}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}
        <button onClick={() => setIsHistoryOpen(false)} style={styles.closeButton}>
          Close
        </button>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
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
    borderRadius: '10px',
    width: '90%',
    maxWidth: '600px',
    height: '80%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
  header: {
    backgroundColor: 'green',
    color: '#fff',
    padding: '10px',
    margin: 0,
    fontSize: '18px',
    textAlign: 'center',
    borderBottom: '2px solid #0056b3',
  },
  tableContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  message: {
    color: '#007BFF',
    textAlign: 'center',
    marginTop: '10px',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: '10px',
  },
  closeButton: {
    margin: '10px auto',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007BFF',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
};

export default Modal;
