import React, { useState, useEffect } from "react";
import axios from "axios";

const LoanApprovalTable = ({state}) => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const {localhost,sesdate,userid,branch}= state ;

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${localhost}/getpendingloans`);
      setLoans(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching loans:", error);
    }
  };

  const handleAction = async (loanId,custno,name,interestPercent,bvn,instalment,disburseddate,amount,paymentfrequency,term,GLCode,moratorium,InterestRate,monthduration,action) => {
    
    if(loading===false){ //Disable clicking while it is still running
      setLoading(true);
    const branchCode=branch.slice(0,3);
    try {
      const response = await axios.post(`${localhost}/actiononpendingloans`, {
        loanId,
        custno,
        name,
        interestPercent,bvn,instalment,disburseddate,amount,
        sesdate,branchCode,userid,paymentfrequency,
        term,GLCode,moratorium,InterestRate,monthduration,
        action, // "approve" or "reject"
      });
      alert(response.data.message);
      fetchLoans(); // Refresh data
    } catch (error) {
      console.error("Error processing loan:", error);
    } finally {
      setLoading(false);
    }
  }
  };

  return (
    <div>
      <h1>Pending Loan Approval Table</h1>
      {loading && <p>Processing... Please wait.</p>}
      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Customer No</th>
            <th>Loan ID</th>
            <th>Account Name</th>
            <th>Loan Product</th>
            <th>Date of Disbursement</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.loanid}>
              <td>{loan.custno}</td>
              <td>{loan.loanid}</td>
              <td>{loan.accountname}</td>
              <td>{loan.loanproduct}</td>
              <td>{loan.disburseddate.slice(0,10)}</td>
              <td style={{ color: loan.amount < 0 ? "red" : "black" }}>
                {loan.amount}
              </td>
              <td>
                <button onClick={() => handleAction(loan.loanid,loan.custno,loan.accountname,loan.interestPercent,loan.bvn,loan.instalment,loan.disburseddate,loan.amount,loan.paymentfrequency,
                  loan.term,loan.GLCode,loan.moratorium,loan.InterestRate,loan.monthduration, "approve")}>
                  Approve
                </button>
                <button onClick={() => handleAction(loan.loanid,loan.custno, "reject")}>
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoanApprovalTable;
