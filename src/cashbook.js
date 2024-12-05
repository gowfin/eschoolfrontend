
//   return (
//     <div>
//         {/* {loading && <p>Loading...</p>} */}
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//       <h1>Daily Cash Book Report</h1>
      // <div>
      //   <label>
      //     Branch Code:
      //     <input
      //       type="text"
      //       value={branchCode}
      //       onChange={(e) => setBranchCode(e.target.value)}
      //     />
      //   </label>
      // </div>
      // <div>
      //   <label>
      //     Date:
      //     <input
      //       type="date"
      //       value={selectedDate}
      //       onChange={(e) => setSelectedDate(e.target.value)}
      //     />
      //   </label>
      // </div>
      // <button onClick={fetchReport}>Generate Report</button>

//       {report && (
//         <div>
//           <h2>Cash Balance</h2>
//           <table>
//             <thead>
//               <tr>
//                 <th>CoaNbr</th>
//                 <th>CoaName</th>
//                 <th>Openning</th>
//                 <th>Credit</th>
//                 <th>Debit</th>
//               </tr>
//             </thead>
//             <tbody>
//               {report.cashBalance.map((item, index) => (
//                 <tr key={index}>
//                   <td>{item.CoaNbr}</td>
//                   <td>{item.CoaName}</td>
//                   <td>{item.Openning}</td>
//                   <td>{item.Credit}</td>
//                   <td>{item.Debit}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <h2>Transactions</h2>
//           <table>
//             <thead>
//               <tr>
//                 <th>TranID</th>
//                 <th>ProductID</th>
//                 <th>CreditGL</th>
//                 <th>DebitGL</th>
//                 <th>Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {report.transactions.map((item, index) => (
//                 <tr key={index}>
//                   <td>{item.TranID}</td>
//                   <td>{item.productid}</td>
//                   <td>{item.CreditGL}</td>
//                   <td>{item.DebitGL}</td>
//                   <td>{item.Amount}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };
import React, { useState,useEffect } from 'react';
import axios from 'axios';

const DailyCashBook = ({state}) => {
  const [selectedDate, setSelectedDate] = useState(state.sesdate.slice(0,10));
  const [branchCode, setBranchCode] = useState(state.branch.slice(0,3));
  const [report, setReport] = useState(null);
  const {localhost,branch}=state;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cashData, setCashData] = useState({
    cashBalance: 0,
    prevCash: 0,
    totalReceipt: 0,
    totalPayment: 0,
    details: [],
  });

  const qCashbal = [
    {
      CoaNbr: "",
      CoaName: "",
      Openning: 0,
      Credit: 0,
      Debit: 0,
    },
  ];


  useEffect(() => {
    // Process `qCashbal`
    const { Openning, Credit, Debit } = qCashbal[0];
    let cashBalance = Openning + Debit - Credit;

    // Process `query1`
    let deposit = 0,
      repayment = 0,
      disbursement = 0,
      savingsWithdrawn = 0,
      income = 0,
      expenses = 0,
      bankWithdrawal = 0,
      bankDeposit = 0,
      totalReceipt = 0,
      totalPayment = 0;

      if(report){ report.transactions.forEach((entry) => {
      const { Amount, TranID, CreditGL, DebitGL } = entry;
      if (TranID.endsWith("002")) {
        deposit += Amount;
        totalReceipt += Amount;
      } else if (TranID.endsWith("001")) {
        repayment += Amount;
        totalReceipt += Amount;
      } else if (TranID.endsWith("010")) {
        disbursement += Amount;
        totalPayment += Amount;
      } else if (TranID.endsWith("005")) {
        savingsWithdrawn += Amount;
        totalPayment += Amount;
      } else if (TranID.endsWith("020")) {
        if (CreditGL.startsWith("11102") && DebitGL.startsWith("11")) {
          bankDeposit += Amount;
          totalPayment += Amount;
        } else if (CreditGL.startsWith("11102") && DebitGL.startsWith("4")) {
          expenses += Amount;
          totalPayment += Amount;
        } else if (DebitGL.startsWith("11102") && CreditGL.startsWith("11")) {
          bankWithdrawal += Amount;
          totalReceipt += Amount;
        } else if (DebitGL.startsWith("11102") && CreditGL.startsWith("3")) {
          income += Amount;
          totalReceipt += Amount;
        }
      }
    });}
    const prevCash = cashBalance - totalReceipt + totalPayment;

    // Update state
    setCashData({
      cashBalance,
      prevCash,
      totalReceipt,
      totalPayment,
      details: [
        { label: "R-Repayment", value: repayment },
        { label: "R-Deposit", value: deposit },
        { label: "R-Income", value: income },
        { label: "R-Bank Withdrawal", value: bankWithdrawal },
        { label: "P-Disbursement", value: disbursement },
        { label: "P-Savings Withdrawn", value: savingsWithdrawn },
        { label: "P-Expenses", value: expenses },
        { label: "P-Bank Deposit", value: bankDeposit },
      ],
    });
  }, [report]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.post(`${localhost}/dailycashbook`, {
        selectedDate,
        branchCode,
      });
      console.log(response.data);
      setReport(response.data);
    } catch (error) {
      setError('Failed to fetch data');
      alert('Failed to fetch report.');
    }finally{setLoading(false);}
  };


  if (loading) {
    return <p>Loading...</p>;
}

return (
  <div>
     {loading && <p>Loading...</p>} 
    {error && <p style={{ color: 'red' }}>{error}</p>}
    <h1>{`${state.companyname.toUpperCase()} DAILY CASH BOOK`}</h1>
    <p>Date: {selectedDate}</p>
     <div>
         <label>
          Branch Code:
          <input
            type="text"
            value={branchCode}
            onChange={(e) => setBranchCode(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Date:
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>
      </div>
      <button onClick={fetchReport}>Generate Report</button>

    <table border="2" width="100%">
      <thead>
        <tr >
          <th>Transaction Type</th>
          <th>Receipt</th>
          <th>Payment</th>
        </tr>
      </thead>
      <tbody>
          <tr>
          <td colSpan="3"  style={{
    textAlign: 'center', 
    padding: '10px', 
    fontWeight: 'bold',
    fontSize: '1.5rem',
  }}><span>Previous Cash in Hand</span> <span style={{color:cashData.prevCash<0?'red':'green',fontWeight:'bold',fontSize:'1.5rem',textAlign:'right'}}>{cashData.prevCash.toLocaleString(undefined, { style: "currency", currency: "NGN" })}</span></td>
        </tr>
        {cashData.details.map((detail, index) => (
          <tr key={index}>
            <td>{detail.label.slice(2)}</td>
            <td style={{color:'green', fontWeight:'bold',border:detail.label.slice(0,2)==='R-' && '2px solid black'}}>{detail.label.slice(0,2)==='R-'?detail.value.toLocaleString(undefined, { style: "currency", currency: "NGN" }):''}</td>
            <td style={{color:'red', fontWeight:'bold',border:detail.label.slice(0,2)==='P-'&& '2px solid black'}}>{detail.label.slice(0,2)==='P-'?detail.value.toLocaleString(undefined, { style: "currency", currency: "NGN" }):''}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td>Total (Receipt | Payment)</td>
         <td style={{color:'green', fontWeight:'bold'}}> {cashData.totalReceipt.toLocaleString(undefined, { style: "currency", currency: "NGN" })}</td>
           <td style={{color:'red', fontWeight:'bold'}}>{cashData.totalPayment.toLocaleString(undefined, { style: "currency", currency: "NGN" })}</td>
        </tr>
        <tr>
          <td colSpan='3' style={{
    textAlign: 'center', 
    padding: '10px', 
    fontWeight: 'bold',
    fontSize: '1.5rem',
  }}><span>Current Cash in Hand</span> <span style={{color:cashData.prevCash<0?'red':'green',fontWeight:'bold',fontSize:'1.5rem',textAlign:'right'}}> { (cashData.totalReceipt - cashData.totalPayment + cashData.prevCash).toLocaleString(undefined, { style: "currency", currency: "NGN" })}</span></td>
        </tr>
      </tfoot>
    </table>
  </div>
);
};

export default DailyCashBook;
