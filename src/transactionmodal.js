import React, { useState,useEffect } from 'react';
import axios from 'axios';
import loadingGif from './loading.gif'; // Your loading gif file
import './transactionmodal.css'

const TransactionModal = ({ userid, products, isOpen, onClose, localhost, fetchData, isDeposit, isWithdr, isRepay, transactionType, AccountID, ProductID, RunningBal, AccountName, CustNo }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState(isDeposit ? `Csh Dep IFO ${AccountName}` : isWithdr ? `Csh Wdr by ${AccountName}` : `Payment by ${AccountName}`);
  const [error, setError] = useState(null);
  const [posting, setPosting] = useState(false);
  const [loanSchData, setLoanSchData] = useState(null);
  const code = 'none';


  ////GETTING FIRST LOAN SCHEDULE FOR REPAYMENT
  useEffect(() => {
    const fetchLoanData = async () => {
        if (transactionType === 'Repayment') {
            try {
                const response = await axios.get(`${localhost}/loan-schedule`, {
                    params: {
                        loanID: AccountID,
                        custno: CustNo,
                    },
                });
                setLoanSchData(response.data);
                setAmount(response.data.RepayWithInt.toLocaleString());
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching loan data:", error.message);
            }
        }
    };

    fetchLoanData(); // Call the async function here
}, []);
const handleBlur = async () => {
  if (transactionType === 'Repayment' && loanSchData.IntRepay != null && loanSchData.RepayWithInt != null && amount != null) {
   console.log(loanSchData.IntRepay,loanSchData.RepayWithInt,amount);
    const intrt = (parseFloat(loanSchData.IntRepay) / parseFloat(loanSchData.RepayWithInt)) * parseFloat(amount.replace('₦','').replace(',',''));
    
    console.log(intrt.toFixed(2),loanSchData.IntRepay,loanSchData.RepayWithInt,amount);
    const prin = parseFloat(amount.replace('₦','').replace(',','')) - intrt;
  console.log(prin.toFixed(2));

    setLoanSchData(prevData => ({ 
      ...prevData,
      IntRepay: intrt.toFixed(2), 
      PrinRepay: prin.toFixed(2) ,
      PrinWithInt: amount.replace('₦','').replace(',','')
    }));
  } 
};
  const handleSubmit = async () => {
    setPosting(true);
    if (transactionType === 'Repayment'){
      try {
        const amnt = amount.replace('₦','');
        const name = AccountName;
        const accountValue =  amnt;
  
        const product = products.find(productrow => productrow.id === ProductID.trim().toUpperCase());
        const pcode = product ? product.code : 'notfound';
       
        console.log(pcode);
        if (!pcode) {
          throw new Error('Product code not found');
        }
  
        const repayToPost = [{
          code: pcode,
          loanID:AccountID,
          custno:CustNo,
          outstandingbal:RunningBal,
          name,
          accountValue,
          interestPercent:(loanSchData.IntRepay/loanSchData.PrinRepay)+1,
          description 
        }
        ];
          // alert(loanSchData.IntRepay/loanSchData.PrinWithInt);
        const response = await axios.post(`${localhost}/postrepayments`, { repayToPost, code, userid });
        const result = response.data;
        console.log(result);
        setError('Posted successfully');
        alert('Transaction Posted successfully');
        onClose();
        setPosting(false);
      } catch (error) {
        setPosting(false);
        setError(error.message); // Use error.message to display the error correctly
        console.error('Transaction error:', error);
      }
    } else{
      try {
     
        const amnt = amount.replace('₦','').replace(',','');
        const name = AccountName;
        const accountValue = transactionType === 'Withdrawal' ? -amnt : amnt;
        // alert (accountValue);
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
          RunningBal:RunningBal+accountValue,
          name,
          accountValue:accountValue,
          description
        }
        ];
  
        const response = await axios.post(`${localhost}/postbulkdeposits`, { depositToPost, code, userid });
        const result = response.data;
        console.log(result);
        setError('Posted successfully');
        alert('Transaction Posted successfully');
        onClose();
        setPosting(false);
      } catch (error) {
        setPosting(false);
        setError(error.message); // Use error.message to display the error correctly
        console.error('Transaction error:', error);
      }
    }
    
  };

  return (
    isOpen && (
      <div className="modal">
        <div className="modal-content" style={{ width: '30%' }}>
        <h3>
           New {isDeposit ? "Deposit" : isWithdr ? "Withdrawal" : "Repayment"} Transaction Bal:
          <span style={{ color: RunningBal < 0 ? 'red' : 'green' }}>
           {` (₦${RunningBal.toLocaleString()})`}
       </span>
       </h3>         
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
            Amount: {transactionType==='Repayment' && loanSchData ? `Prin: ${loanSchData.PrinRepay} , Int: ${loanSchData.IntRepay}`:''}

            <input
              type="text"
              value={`₦${Number(amount.replace(/₦|,/g, '')).toLocaleString()}`}
              onChange={(e) => setAmount(e.target.value)}
              onBlur={handleBlur}
            />
          </label>
          <label>
            Transaction Type:{ProductID}
            <select
              value={transactionType}
            >
              <option value="Deposit" hidden={!isDeposit}>Deposit</option>
              <option value="Withdrawal" hidden={!isWithdr}>Withdrawal</option>
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
