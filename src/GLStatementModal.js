import React, { useState } from "react";
import axios from "axios";
import "./GLReportModal.css"; // Optional: for custom styling
import loadingGif from './loading.gif'; // Your loading gif file


const GLReportModal = ({ isOpen, onClose, incomeList,localhost,userid,sesdate  }) => {
  const [glCode, setGlCode] = useState("");
  const [startDate, setStartDate] = useState(sesdate);
  const [endDate, setEndDate] = useState(sesdate);
  const [loading, setLoading] = useState("");
  const [openingBalance, setOpeningBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

//Function to format Date
  const formatDateForInput = (date) => {
    const d = new Date(date);
    return !isNaN(d) ? d.toISOString().split("T")[0] : "";
  };
 

// Format currency function
const formatCurrency = (amount) => {
  const formatter = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" });
  return amount < 0 ? `(${formatter.format(Math.abs(amount))})` : formatter.format(amount);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const searchCode=glCode.slice(0,9);
      const response = await axios.post(`${localhost}/gl-report`, {
        glCode: searchCode,
        startDate,
        endDate,
      });
      console.log(response.data);
      const data=response.data;
      if (data) {
        // const { openingBalance, transactions } = processData(data);
        setOpeningBalance(data.openingBalance);
        setTransactions(data.transactions);
       
      }
     
      
      setLoading(false);
    } catch (err) {
      console.error(err.message);
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  let runningBal=openingBalance;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Generate GL Report</h2>
        <form onSubmit={handleSubmit}>
          <label>
            GL Code:
            <select value={glCode} onChange={(e) => setGlCode(e.target.value)}>
            <option value="">-- Select an income --</option>
            {incomeList.length!==0 && incomeList.map((income, index) => (
            <option key={index} value={income}>{income}</option>
            ))}
        </select>
          </label>
          <label>
            Start Date:
            <input
              type="date"
              value={formatDateForInput(startDate)}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={formatDateForInput(endDate)}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
          <button type="submit">{loading? <img src={loadingGif} alt="Loading..." style={{ width: '20px', height: '20px' }} />
 :'Generate Report'}</button>
 <button onClick={onClose}>Close</button>
 <div className="report-container">
      <div className="balance-section">
        <p>Opening Balance: {formatCurrency(openingBalance)}</p>
      </div>
      <table className="transactions-table">
        <thead>
          <tr>
            <th>SN</th>
            <th>Description</th>
            <th>TrxCode</th>
            <th>Date</th>
            <th>Debit</th>
            <th>Credit</th>
            <th>RunningBal</th>
            <th>type</th>
          </tr>
        </thead>
        <tbody>
          
          {transactions.map((transaction, index) =>{
            glCode.slice(0,9)===transaction.DebitGL?runningBal +=transaction.amount:runningBal -=transaction.amount;
          return (  
              <tr key={index}>
              <td>{index+1}</td>
              <td>{transaction.StmtRef}</td>
              <td>{transaction.TranID}</td>
              <td>{transaction.ValueDate.slice(0,10)}</td>
              <td>{glCode.slice(0,9)===transaction.DebitGL? formatCurrency(transaction.amount):0}</td>
              <td>{glCode.slice(0,9)===transaction.CreditGL? formatCurrency(transaction.amount):0}</td>
              <td>{formatCurrency(runningBal)}</td>
              <td>{runningBal<0?'DR':'CR'}</td>
            </tr>
          )}
          )}
        </tbody>
      </table>
    </div>
        </form>
      </div>
    </div>
  );
};

export default GLReportModal;
