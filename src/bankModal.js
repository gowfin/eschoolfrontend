import React, { useState } from 'react';
import axios from 'axios';
import loadingGif from './loading.gif'; // Your loading gif file

const BankModal = ({ isOpen, onClose, bankList,localhost,userid }) => {
    const [selectedBank,setSelectedIncome]=useState('');
    const [description,setDescription]=useState('');
    const [brcode,setBrcode]=useState('');
    const [code,setCode]=useState('');
    const [amount,setAmount]=useState('');
    const [ tranxType, setTranxType]=useState('Deposit');
    const [error, setError] = useState(null);
    const [posting, setPosting] = useState(false);
   

    const handleSelectType = (e) => {
        setError('');
        setTranxType(e.target.value);
        
      };

  const handleSelectBank = (e) => {
    setError('');
    const glCode=e.target.value;
    setSelectedIncome(glCode); // Set selected expense
    setCode(glCode.slice(0,5));
    setBrcode('00'+glCode.slice(6,7));
    const desc=tranxType==='Deposit'? 'Deposit to '+glCode.slice(8):'Withdr From '+glCode.slice(8);
    setDescription(desc)
   
    
  };
 const handleAmount = (e) => {
    setAmount(e.target.value); // Set selected expense
   
  };

  const handleDescription = (e) => {
    setDescription(e.target.value); // Set selected expense
   
  };
  const handleSubmit = async(e) => {
    try
    {
      setPosting(true);
   const response=await axios.post(`${localhost}/journaltransactions`,{amount, 
    debitGL:tranxType==='Deposit'?code+'-'+brcode:'11102-'+brcode, 
    creditGL:tranxType==='Deposit'?'11102-'+brcode:code+'-'+brcode, 
    comment:description, 
    createdBy:userid,
    journalType:'BANK',
    branchCode:brcode});
    alert(response.data);
    setPosting(false);
    setError(response.data)
   }
   catch(error){ setPosting(false); setError(error)}
  };
 

  return (
    <div style={{ zIndex: 1000, position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      >
      <div style={styles.modal}>
      {error && (
         <p className="error" style={error.includes('successful') ? { color: 'green' } : { color: 'red' }}>
          {error}
          </p>
           )}<label>Transaction Type</label>
        <select onChange={handleSelectType} style={styles.select}>
          <option value="Deposit">Deposit</option>
          <option  value="Withdrawal">Withdrawal</option>
        </select>
        <label>Select Bank</label>
        <select onChange={handleSelectBank } style={styles.select}>
          <option value="">-- Select a bank --</option>
        {bankList.length!==0 && bankList.map((bank, index) => (
            <option key={index} value={bank}>{bank}</option>
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
        <button style={{backgroundColor:'#FF9999'}} onClick={onClose}>Close</button>
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

export default BankModal;
