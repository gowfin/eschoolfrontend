import React, { useState } from 'react';

const ExpenseModal = ({ isOpen, onClose, expenseList, onSelectExpense }) => {
    const [selectedExpense,setSelectedExpense]=useState('');
    const [description,setDescription]=useState('');
    const [code,setCode]=useState('');
    const [amount,setAmount]=useState('');

  if (!isOpen) return null; // Don't render if the modal is not open

  const handleSelectExpense = (e) => {
    const glCode=e.target.value;
    setSelectedExpense(glCode); // Set selected expense
    setCode(glCode.slice(0,9));
    setDescription(glCode.slice(9))
    console.log(glCode,code,description)
  };
  const handleExModalClose = () => {
    onClose(); // Close modal
  };
 const handleAmount = (e) => {
    setAmount(e.target.value); // Set selected expense
    console.log(`Amount: ${e.target.value}`);
  };

  const handleDescription = (e) => {
    setDescription(e.target.value); // Set selected expense
    console.log(`description: ${e.target.value}`);
  };
  return (
    <div 
    // style={styles.modalOverlay} 
    style={{ zIndex: 1000, position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeButton}>X</button>
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
        <button>Save</button>
        <button style={{backgroundColor:'#FF9999'}} OnClick={handleExModalClose}>Close</button>
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
