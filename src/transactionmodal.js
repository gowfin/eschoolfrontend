import React, { useState } from 'react';
import axios from 'axios';
import loadingGif from './loading.gif'; // Your loading gif file

const TransactionModal = ({ userid, products, isOpen, onClose, localhost, fetchData, isDeposit, isWithdr, isRepay, transactionType, AccountID, ProductID, RunningBal, AccountName, CustNo }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState(isDeposit ? `Csh Dep IFO ${AccountName}` : isWithdr ? `Csh Wdr by ${AccountName}` : `Payment by ${AccountName}`);
  const [error, setError] = useState(null);
  const [posting, setPosting] = useState(false);
  const code = 'none';

  const handleSubmit = async () => {
    setPosting(true);
    try {
      const amnt = amount.replace('₦','');
      const name = AccountName;
      const accountValue = transactionType === 'Withdraw' ? -amnt : amnt;

      const product = products.find(productrow => productrow.id === ProductID.slice(0, 3).trim().toUpperCase() + 'SAVGS');
      const pcode = product ? product.code : 'notfound';
     
      console.log(pcode);
      if (!pcode) {
        throw new Error('Product code not found');
      }

      const depositToPost = [{
        code: pcode,
        AccountID,
        CustNo,
        RunningBal,
        name,
        accountValue,
        description
      }
      ];

      const response = await axios.post(`${localhost}/postbulkdeposits`, { depositToPost, code, userid });
      const result = response.data;
      console.log(result);
      setError('Posted successfully');
      onClose();
      setPosting(false);
    } catch (error) {
      setPosting(false);
      setError(error.message); // Use error.message to display the error correctly
      console.error('Transaction error:', error);
    }
  };

  return (
    isOpen && (
      <div className="modal">
        <div className="modal-content" style={{ width: '30%' }}>
          <h3>New {isDeposit ? "Deposit" : isWithdr ? "Withdraw" : "Repayment"} Transaction{` (Bal:₦${RunningBal.toLocaleString()})`}</h3>
          {error && (
         <p className="error" style={error.includes('successful') ? { color: 'green' } : { color: 'red' }}>
          {error}
          </p>
           )}
          <p>{posting && <img src={loadingGif} alt="Loading..." style={{ width: '7%', height: '7%' }} />
        }</p>
          <label>
            Account ID: {CustNo}
            <input
              type="text"
              contentEditable='false'
              value={AccountID}
              readOnly
            />
          </label>
          <label>
            Amount:
            <input
              type="text"
              value={`₦${Number(amount.replace(/₦|,/g, '')).toLocaleString()}`}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          <label>
            Transaction Type:{ProductID}
            <select
              value={transactionType}
            >
              <option value="Deposit" hidden={!isDeposit}>Deposit</option>
              <option value="Withdraw" hidden={!isWithdr}>Withdraw</option>
              <option value="Repayment" hidden={!isRepay}>Repayment</option>
            </select>
          </label>
          <label>
            Description:{<strong>{AccountName}</strong>}
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose} style={{  backgroundColor: 'red'}}>Cancel</button>
        </div>
      </div>
    )
  );
};

export default TransactionModal;
