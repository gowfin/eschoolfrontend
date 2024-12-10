import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './batch.css';
import loadingGif from '../loading.gif';
import { Link } from 'react-router-dom';
// import { localhost } from '../env.js';

const IndWorkflow = ({ state }) => {
  const { branch } = state || {};
  const {localhost,sesdate}= state ;
  const [loading, setLoading] = useState(false);
  const [branchCode, setBranchCode] = useState('');
  // const [date, setDate] = useState(sesdate?sesdate:'');
  const [date, setDate] = useState(() => {
    const today = new Date(sesdate);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so we add 1
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
});
  const [workflowDataInd, setWorkflowDataInd] = useState([]);
  const [arrayApproving, setArrayApproving] = useState([]);
  const [arrayRejecting, setArrayRejecting] = useState([]); // Initialize similarly
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    AccountID: "",
    TranID: "",
    Amount: "",
    DebitGL: "",
    CreditGL: "",
    RunningBal: "",
    ValueDate: "",
    DateEffective: "",
    CustNo: "",
    StmtRef: "",
    BranchID: "",
    ChequeNbr: "",
    CreatedBy: "",
    TransactionNbr: "",
    GroupID:"none",
    IntElement: "",
    PrinElement: ""
  });
// List of available branch codes
const branchCodes = ["002", "003","004","005","006","007","008", "all"]; 
const handleBranchCodeChange = (event) => {
  setBranchCode(event.target.value);
};

  const handleApprove = async (data, index) => {
    setArrayApproving((prevArrayLoading) => {
      const newArray = [...prevArrayLoading];
      newArray[index] = true;
      return newArray;
    });
    setFormData(data);

    try {
      const response = await axios.post(`${localhost}/approvetransaction`, data);
      alert(response.data.message);
    } catch (error) {
      alert('Error posting transaction: ' + error.response?.data?.error || error.message);
    } finally {
      fetchWorkflowData(); // Refresh the workflow list
      setArrayApproving((prevArrayLoading) => {
        const newArray = [...prevArrayLoading];
        newArray[index] = false;
        return newArray;
      });
    }
  };

  const handleReject = async (tranid) => {
    setLoading(true);
    alert(`Rejected transaction: ${tranid}`);
    setLoading(false);
  };

  useEffect(() => {
    if (branch) {
      setBranchCode(branch.slice(0, 3));
    }
  }, [branch]);

  const fetchWorkflowData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${localhost}/workflowInd`, {
        params: { groupid: 'none', date, branchCode }
      });
      const StateArraylen = response.data.length;
      setWorkflowDataInd(response.data);
      setArrayApproving(new Array(StateArraylen).fill(false));
      setArrayRejecting(new Array(StateArraylen).fill(false)); // Initialize rejecting array
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchWorkflowData();
  // }, [date, branchCode]);

  return (
    <div className="modal" style={{ width: '100%' }}>
      
      {loading && (
        <div>
          Loading...
          <img src={loadingGif} alt="Loading..." style={{ width: '40px', height: '40px' }} />
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="modal-content">
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
  <label>
    Select Branch Code:
    <select value={branchCode} onChange={handleBranchCodeChange}>
      {branchCodes.map((code) => (
        <option key={code} value={code}>
          {code === "all" ? "All Branches" : `Branch ${code}`}
        </option>
      ))}
    </select>
  </label>

  <label style={{ marginLeft: '10px' }}>
    Set Date:
    <input
      type="date"
      value={date}
      style={{ maxWidth: '150px', marginLeft: '5px' }}
      onChange={(e) => setDate(e.target.value)}
    />
  </label>

  <button onClick={()=>{ fetchWorkflowData();}}
    style={{
      width: '10%',
      padding: '5px',
      marginLeft: '25px',
      cursor: 'pointer',
      backgroundColor: '#666666', // Fixed color code
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      transition: 'background-color 0.3s ease',
    }}
  >
    Search
  </button>
  <Link to="/" style={{ textDecoration: 'none' }}>
          <button
            style={{
              width: '100%',
              padding: '5px',
              margin: '10px',
              cursor: 'pointer',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              transition: 'background-color 0.3s ease',
            }}
          >
            Close
          </button>
        </Link>
</h2>
        
        
        <table>
          <thead>
            <tr>
              <th>Account ID</th>
              <th>TrxID</th>
              <th>Amount</th>
              <th>Debit GL</th>
              <th>Credit GL</th>
              <th>Running Balance</th>
              <th>Value Date</th>
              <th>Date Effective</th>
              <th>Customer No</th>
              <th>Statement Reference</th>
              <th>Branch ID</th>
              <th>Cheque Number</th>
              <th>Created By</th>
              <th>Transaction Number</th>
              <th>Interest Element</th>
              <th>Principal Element</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {workflowDataInd.map((item, index) => (
                  
                <tr key={index}>
                <td>{item.AccountID}</td>
                <td>{item.TranID}</td>
                <td style={{ backgroundColor: '#b3b300' }}>{item.Amount}</td>
                <td>{item.DebitGL}</td>
                <td>{item.CreditGL}</td>
                <td>{item.RunningBal}</td>
                <td>{new Date(item.ValueDate).toLocaleDateString('en-GB', {day: '2-digit',month: '2-digit',year: 'numeric'})}</td>
                <td>{new Date(item.DateEffective).toLocaleDateString('en-GB', {day: '2-digit',month: '2-digit',year: 'numeric'})}</td>
                <td>{item.CustNo}</td>
                <td style={{ backgroundColor: '#b3b300' }}>{item.StmtRef}</td>
                <td>{item.BranchID}</td>
                <td>{item.ChequeNbr}</td>
                <td>{item.CreatedBy}</td>
                <td>{item.TransactionNbr}</td>
                <td>{item.IntElement}</td>
                <td>{item.PrinElement}</td>
                <td>
                  <button onClick={() => handleApprove(item,index)}>
                    {arrayApproving[index]? <img src={loadingGif} alt="Loading..." style={{ width: '20px', height: '20px' }} /> : 'Approve'}
                  </button>
                  <button
                    style={{ marginTop: '10px', backgroundColor: '#f44336' }}
                    onClick={() => handleReject(item.TranID)}
                  >
                    {setArrayRejecting[index]? <img src={loadingGif} alt="Loading..." style={{ width: '20px', height: '20px' }} /> : 'Reject'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default IndWorkflow;

