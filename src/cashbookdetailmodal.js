
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AccountHostoryModal from './accounthistoryModal'

const CashbookDetail = ({ isOpen, onClose, reportDetail,NairaFormat,type,localhost }) => {
  const [tranxType, setTranxType] = useState('Deposit');
   const [error, setError] = useState(null);
   const [accountHistory, setAccountHistory] = useState([]);
   const [message, setMessage] = useState('');
   const [searching, setSearching] = useState(false);
   const [isHistoryOpen,setIsHistoryOpen]=useState(false)
  // const [posting, setPosting] = useState(false);
  const navigate = useNavigate(); 
  const tableRef = useRef(null);

  // Scroll to the bottom of the table when content updates
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollTop = tableRef.current.scrollHeight;
    }
  }, [reportDetail]);

  // Do not render the modal if `isOpen` is false
  if (!isOpen) {
    return null;
  }
  const total = reportDetail.reduce((sum, row) => {
    return sum + row.Amount; // Assuming 'Amount' is the field in your data
  }, 0);
const gotoAccount=(custno)=>{

   if(custno.length>4 ){navigate(`/account?custno=${custno}`);}
}
const gotoHist= async (custno,accountid)=>{

  if(custno.length>4 ){
    try {
  
    const response = await axios.post(`${localhost}/get_history`, { custno, accountid });
    const data = response.data;
    // Extract data from response
    let bal = 0;
    // //calculate running history from amount in data
    const dataWithRunningBal = data.map((item) => {
      const isAmountNegative = item.tranid === '005' || item.tranid === 'R001' || item.tranid === 'R002' || item.tranid === '059' || item.tranid === '010' || item.tranid === 'R010';
      bal = isAmountNegative ? bal - item.amount : bal + item.amount;
      item.Runningbal = bal;
      return item;
    });
    setAccountHistory(dataWithRunningBal);
    setMessage('Search successful');
    setIsHistoryOpen(true);
  } catch (error) {
    setError(error.message);
    // Handle errors
    setMessage(error.message);
  } finally {
    setSearching(false);
  }}
}
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <h3>{type} Details</h3>
        <div style={styles.tableContainer} ref={tableRef}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>CustNo</th>
                <th>AccountID</th>
                <th>Name</th>
                <th>Product</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {reportDetail &&
                reportDetail.map((row, index) => (
                  <tr key={index}>
                    <td onDoubleClick={()=>gotoAccount(row.CustNo)}>{row.CustNo}</td>
                    <td onDoubleClick={()=>gotoHist(row.CustNo,row.AccountID)}>{row.AccountID}</td>
                    <td>{row.BranchID}</td>
                    <td>{row.productid}</td>
                    <td>{row.StmtRef}</td>
                    <td>{NairaFormat(row.Amount)}</td>
                  </tr>
                ))}
            </tbody>
           <tr>
            <td colSpan={'5'}> <strong>Total Amount:</strong></td>
                <td> <strong>{NairaFormat(total)}</strong></td>
                  </tr>
          </table>
        </div>
        <button onClick={onClose} style={styles.closeButton}>
          Close
        </button>
      </div>
      {isHistoryOpen && <AccountHostoryModal  accountHistory={accountHistory} isHistoryOpen={isHistoryOpen} setIsHistoryOpen={setIsHistoryOpen} message={message}
      error={error} onClose={onClose}/>}
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
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    width: '100%',
    maxWidth: '800px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'relative',
    maxHeight: '80vh', // Limit height to viewport
    overflow: 'hidden', // Prevent overflow outside the modal
  },
  tableContainer: {
    maxHeight: '60vh', // Limit the table container height
    overflowY: 'auto', // Enable vertical scrolling for overflow
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  closeButton: {
    marginTop: '10px',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007BFF',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default CashbookDetail;

