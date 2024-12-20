import React, { useState } from 'react';
import axios from 'axios';
import loadingGif from './loading.gif'; // Your loading gif file


const ExpenseModal = ({ isOpen, onClose,localhost, expenseList,userid, onSelectExpense,sesdate }) => {
    const [selectedExpense,setSelectedExpense]=useState('');
    const [description,setDescription]=useState('');
    const [code,setCode]=useState('');
    const [brcode,setBrcode]=useState('');
    const [amount,setAmount]=useState('');
    const [error, setError] = useState(null);
    const [posting, setPosting] = useState(false);
   
  if (!isOpen) return null; // Don't render if the modal is not open

  const handleSelectExpense = (e) => {
    const glCode=e.target.value;
    setSelectedExpense(glCode); // Set selected expense
    setCode(glCode.slice(0,5));
    setBrcode(glCode.slice(6,9));
    setDescription(glCode.slice(10))
   
    
   
  };
  const handleExModalClose = () => {
    onClose(); // Close modal
  };
 const handleAmount = (e) => {
    setAmount(e.target.value); 
   
  };

  const handleDescription = (e) => {
    setDescription(e.target.value); 
   
  };
  const handleSubmit = async(e) => {
    try
    {
      setPosting(true);
   const response=await axios.post(`${localhost}/journaltransactions`,{amount, 
    debitGL:code+'-'+brcode, 
    creditGL:'11102-'+brcode, 
    comment:description, 
    createdBy:userid,
    journalType:'E',
    branchCode:brcode,
    sesdate:sesdate,
  });
    alert(response.data);
    setPosting(false);
    setError(response.data);
   }
   catch(error){setPosting(false); setError(error);}
  };
 
  return (
    <div 
    // style={styles.modalOverlay} 
    style={{ zIndex: 1000, position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
>
      <div style={styles.modal}>
      {error && (
         <p className="error" style={error.includes('successful') ? { color: 'green' } : { color: 'red' }}>
          {error}
          </p>
           )}
        <h3>Select Expense</h3>
        <select onChange={handleSelectExpense} style={styles.select}>
          <option value="">-- Select an expense --</option>
          {expenseList && expenseList.map((expense, index) => (
            <option key={index} value={expense}>{expense}</option>
          ))}
        </select>
        
        <label>Amount
        <input type='text'
        value={amount} 
        onChange={handleAmount}
         placeholder="Enter Amount"
         style={{ flex: 1 }}
        > 
        </input>
        </label>
        <label>Description</label>
        <input type='text' value={description} 
        onChange={handleDescription}
        placeholder="Enter Description"
        style={{ flex: 2 }}> 
       
        </input>
        <button onClick={handleSubmit}>{posting ? <img src={loadingGif} alt="Loading..." style={{ width: '7%', height: '7%' }} />
        : 'Save'}</button>
        <button style={{backgroundColor:'#FF9999'}} onClick={handleExModalClose}>Close</button>
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
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    width: '300px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    border: 'none',
    background: 'none',
    fontSize: '20px',
    cursor: 'pointer',
  },
  select: {
    width: '100%',
    padding: '10px',
    marginTop: '20px',
    borderRadius: '5px',
  },
};

export default ExpenseModal;
