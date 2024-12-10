import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './batch.css';
import loadingGif from '../loading.gif'; // Your loading gif file
// import { localhost } from '../env.js';


const BatchWorkflow = ({ state }) => {
  const {localhost,sesdate}= state ;
  const [workflowData, setWorkflowData] = useState([]);
  const [workflowDataInd, setWorkflowDataInd] = useState([]);
  const [branchCode, setBranchCode] = useState(state.branch.slice(0,3));
  const { branch } = state || {};
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingGrp, setLoadingGrp] = useState(false);
  // const [date, setDate] = useState(sesdate? sesdate.slice(0,10):'');
  const [date, setDate] = useState(() => {
    const today = new Date(sesdate.slice(0,10));
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so we add 1
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
});
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [arrayRejecting, setArrayRejecting] = useState([]); // Initialize similarly
  const [error, setError] = useState(null);
  const [arrayApproving, setArrayApproving] = useState([]);
  const [arrayViewing, setArrayViewing] = useState([]);
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
    GroupID:"",
    IntElement: "",
    PrinElement: ""
  });
  // List of available branch codes
  const branchCodes = ["002", "003","004","005","006","007","008", "all"]; 

  const handleBranchCodeChange = (event) => {
    setBranchCode(event.target.value);
  };



  const handleApproveAll = async (data) => {
setApproving(true);
try {
  const response = await axios.post(`${localhost}/approvetransactionall`, data);
  alert(response.data.message);
  console.log(data);
  handleView (data[0].GroupID,date,null); // Refresh the workflow list
} catch (error) {
  alert('Error posting transaction: ' + error.response?.data?.error || error.message);
} finally {
  handleView (data.GroupID,date,null); // Refresh the workflow list
  setApproving(false);
 
}

  }

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
      console.log(data);
    } catch (error) {
      alert('Error posting transaction: ' + error.response?.data?.error || error.message);
    } finally {
      handleView (data.GroupID,date,index); // Refresh the workflow list
      setArrayApproving((prevArrayLoading) => {
        const newArray = [...prevArrayLoading];
        newArray[index] = false;
        return newArray;
      });
     
    }
  };

  const handleReject = async(tranid) => {
    setRejecting(true);
    alert(`Rejected transaction: ${tranid} 'and ' ${rejecting}`);
    // Handle rejection logic
    setRejecting(false);
  };

  // Set the branch code based on your logic
  // console.log(branch);
  useEffect(() => {
    if (branch) {
      setBranchCode(branch.slice(0,3)); 
    }
  }, [branch]);
console.log(branchCode);
  const handleView = async ( groupid, date,index) => {
    //  setLoading(true);
    //  setApproving(true);
    index && setArrayViewing((prevArrayViewing) => {
      const newArray = [...prevArrayViewing];
      newArray[index] = true;
      return newArray;
    });
    try {
      const response = await axios.get(`${localhost}/workflowInd`, {
        params: { groupid, date, branchCode }
      });
      setWorkflowDataInd(response.data);
      console.log(response.data);
      setModalIsOpen(true);
      // setLoading(false);
      // setApproving(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }finally{
      index && setArrayViewing((prevArrayViewing) => {
        const newArray = [...prevArrayViewing];
        newArray[index] = false;
        return newArray;
      });
    }
  };

  useEffect(() => {
    const fetchGroupData = async () => {
      setLoadingGrp(true);
      try {
        const response = await axios.get(`${localhost}/workflow`, {
          params: { branchCode }
        });
        setWorkflowData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoadingGrp(false);
    };

    fetchGroupData();
  }, [,branchCode]);

  return (
    <div className="workflow">
      <h2>{loadingGrp ? (<div>{'Loading...'}<img src={loadingGif} alt="Loading..." style={{ width: '20px', height: '20px' }} /></div>):'Workflow Data'}</h2>
      {/* BranchCode Dropdown */}
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
      <table>
        <thead>
          <tr>
            <th>Value Date</th>
            <th>Group ID</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {workflowData.map((item, index) => (
            <tr key={index}>
              <td>{item.ValueDate}</td>
              <td>{item.groupid}</td>
              <td>{item.amount}</td>
              <td>{'Pending'}</td>
              <td ><button style={{color:'pink',backgroundColor:'#0AD4A0'}}onClick={(e) => handleView(item.groupid, item.ValueDate,index)}>{'View'}{arrayViewing[index] ? <img src={loadingGif} alt="Loading..." style={{ width: '20px', height: '20px' }} /> : '🔍' }</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    
     { modalIsOpen && (
      
      // <button onClick={() => setModalIsOpen(true)}>Open Modal</button>

      
      <div className="modal" width="100%">
      <div className="modal-content">
        <h2>Transaction Approval</h2>
        <button style={{
  width: '10%',
  padding: '5px',
  margin: '10px',
  cursor: 'pointer',
  backgroundColor: '#f44336', // Red background
  color: 'white', // White text
  border: 'none', // No border
  borderRadius: '10px', // Rounded corners
  transition: 'background-color 0.3s ease', // Smooth background color transition
}}
        onClick={() => setModalIsOpen(false)}>Close</button>
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
              <th>Group ID</th>
              <th>Group Transaction No</th>
              <th>Interest Element</th>
              <th>Principal Element</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {workflowDataInd.map((item,index) => (
              <tr key={index}>
                <td>{item.AccountID}</td>
                <td>{item.tranid}</td>
                <td style={{backgroundColor:'#b3b300'}}>{item.amount}</td>
                <td>{item.DebitGL}</td>
                <td>{item.CreditGL}</td>
                <td>{item.Runningbal}</td>
                <td>{new Date(item.ValueDate).toLocaleDateString('en-GB', {day: '2-digit',month: '2-digit',year: 'numeric'})}</td>
                <td>{new Date(item.DateEffective).toLocaleDateString('en-GB', {day: '2-digit',month: '2-digit',year: 'numeric'})}</td>
                <td>{item.CustNO}</td>
                <td style={{backgroundColor:'#b3b300'}}>{item.StmtRef}</td>
                <td>{item.BranchID}</td>
                <td>{item.ChequeNbr}</td>
                <td>{item.CreatedBy}</td>
                <td>{item.transactionNbr}</td>
                <td>{item.Groupid}</td>
                <td>{item.Grouptrxno}</td>
                <td>{item.IntElement}</td>
                <td>{item.PrinElement}</td>
                <td>
                  <button onClick={() => handleApprove(item,index)}>{arrayApproving[index] ? <img src={loadingGif} alt="Loading..." style={{ width: '20px', height: '20px' }} />:'Approve'}</button>
                  
                  <button style={{ marginTop: '10px',backgroundColor: '#f44336' }} onClick={() => handleReject(item,index)}>{rejecting ? <img src={loadingGif} alt="Loading..." style={{ width: '20px', height: '20px' }} />:'Reject'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => handleApproveAll(workflowDataInd)}>{approving ? <img src={loadingGif} alt="Loading..." style={{ width: '20px', height: '20px' }} />:'Approve All'}</button>

        </div>
        </div>
      
    )}
    </div>
  );
};

export default BatchWorkflow;
