import React, { useState } from 'react';

const IncomeModal = ({ isOpen, onClose, incomeList, onSelectExpense }) => {
    const [selectedIncome,setSelectedIncome]=useState('');
    const [description,setDescription]=useState('');
    const [code,setCode]=useState('');
    const [amount,setAmount]=useState('');

  if (!isOpen) return null; // Don't render if the modal is not open

  const handleSelectIncome = (e) => {
    const glCode=e.target.value;
    setSelectedIncome(glCode); // Set selected expense
    setCode(glCode.slice(0,9));
    setDescription(glCode.slice(9))
    console.log(glCode,code,description)
    
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
    <div style={{ zIndex: 1000, position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      >
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeButton}>X</button>
        <h3>Select Income</h3>
        <select onChange={onSelectExpense} style={styles.select}>
          <option value="">-- Select an income --</option>
        {incomeList.length!==0 && incomeList.map((income, index) => (
            <option key={index} value={income}>{income}</option>
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
        <button style={{backgroundColor:'#FF9999'}} OnClick={onClose}>Close</button>
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

export default IncomeModal;
