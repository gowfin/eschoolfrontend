import React, { useState,useEffect } from 'react';
import axios from 'axios';
import CashBookDetail from './cashbookdetailmodal'
import loadingGif from './loading.gif'





const DailyCashBook = ({state}) => {
  const [selectedDate, setSelectedDate] = useState(state.sesdate.slice(0,10));
  const [branchCode, setBranchCode] = useState(state.branch.slice(0,3));
  const [report, setReport] = useState(null);
  const [reportDetail, setReportDetail] = useState(null);
  const {localhost,branch}=state;
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState([]);
  const [error, setError] = useState('');
  const [modalIsOpen,setModalIsOpen]=useState(false);
  const [type,setType]=useState('');
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
        { label: "001R-Repayment", value: repayment },
        { label: "002R-Deposit", value: deposit },
        { label: "020R-Income", value: income },
        { label: "020R-Bank Withdrawal", value: bankWithdrawal },
        { label: "010P-Disbursement", value: disbursement },
        { label: "005P-Savings Withdrawn", value: savingsWithdrawn },
        { label: "020P-Expenses", value: expenses },
        { label: "020P-Bank Deposit", value: bankDeposit },
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
      //fill the loadingDetail status with false
      setLoadingDetail(new Array(cashData.details.length).fill(false));
    } catch (error) {
      setError('Failed to fetch data');
      alert('Failed to fetch report.');
    }finally{setLoading(false);}
  };

  const handleDetial = async (tranid,trxtype,index) => {
    try {
      setLoadingDetail((prev) => {
        const newLoading = [...prev];
        newLoading[index] = true; // Set loading for the specific index
        return newLoading;
      });
      setType(trxtype);
      setError('');
     
      const itemQuery=tranid==='020' && trxtype==='Income'?`select CustNo,AccountID,BranchID,StmtRef,Amount,isnull(productid,'GL') productid from transactn where valuedate='${selectedDate}' and tranid like '%${tranid}' and CreditGl like'3%' and DebitGL like'11102%' and left(CustNo,3)='${branchCode}'`:
      tranid==='020' && trxtype==='Expenses'? `select CustNo,AccountID,BranchID,StmtRef,Amount,isnull(productid,'GL') productid from transactn where valuedate='${selectedDate}' and tranid like '%${tranid}' and (DebitGl like'4%' or  DebitGl like'5%') and CreditGl like'11102%' and left(CustNo,3)='${branchCode}'`:
      tranid==='020' && trxtype==='Bank Withdrawal'?`select CustNo,AccountID,BranchID,StmtRef,Amount,isnull(productid,'GL') productid from transactn where valuedate='${selectedDate}' and tranid like '%${tranid}' and CreditGl like'11%' and DebitGL like'11102%' and left(CustNo,3)='${branchCode}'`:
      tranid==='020' && trxtype==='Bank Deposit'? `select CustNo,AccountID,BranchID,StmtRef,Amount,isnull(productid,'GL') productid from transactn where valuedate='${selectedDate}' and tranid like '%${tranid}' and DebitGl like'11%' and CreditGl like'11102%' and left(CustNo,3)='${branchCode}'`:
      `select CustNo,AccountID,BranchID,StmtRef,Amount,isnull( productid,'GL') productid from transactn where valuedate='${selectedDate}' and tranid like '%${tranid}' and left(CustNo,3)='${branchCode}'`
      
      ;
      const response = await axios.post(`${localhost}/cashbookitemdetails`, {
        itemQuery,
        tranid,
        startDate:selectedDate
      });
      // console.log(response.data);
      setReportDetail(response.data);
      setModalIsOpen(true);
     
    } catch (error) {
      setError(error.response.data.error||error.status.error||error.message ||'Failed to fetch data');
      // alert('Failed to fetch report.');
    }finally{ setLoadingDetail((prev) => {
      const newLoading = [...prev];
      newLoading[index] = false; // Reset loading for the specific index
      return newLoading;
    });}
  };
 const ModalClosed=()=>{
  setModalIsOpen(false)
 }
////format the amount to currency
const NairaFormat=(value)=>{
  return value.toLocaleString(undefined, { style: "currency", currency: "NGN" })}
 
  if (loading) {
    return <p>Loading...</p>;
}

return (
  <div>
     {loadingDetail? <p>Click each item to get the details...</p>:<p>Select date and click generate report</p>} 
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
            <td 
              onDoubleClick={()=>handleDetial(detail.label.slice(0,3),detail.label.slice(5),index)}
            >({detail.label.slice(0,3)}){detail.label.slice(5)} {loadingDetail[index]?<img src={loadingGif}  alt="Loading..." style={{ width: '20px', height: '20px'}}/>:''}</td>
            <td onDoubleClick={()=>handleDetial(detail.label.slice(0,3),detail.label.slice(5),index)} style={{color:'green', fontWeight:'bold',border:detail.label.slice(3,5)==='R-' && '2px solid black'}}>{detail.label.slice(3,5)==='R-'?NairaFormat(detail.value):''}</td>
            <td onDoubleClick={()=>handleDetial(detail.label.slice(0,3),detail.label.slice(5),index)}  style={{color:'red', fontWeight:'bold',border:detail.label.slice(3,5)==='P-'&& '2px solid black'}}>{detail.label.slice(3,5)==='P-'?NairaFormat(detail.value):''}</td>
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

{reportDetail&& reportDetail.length>0 && <CashBookDetail reportDetail={reportDetail} onClose={ModalClosed} isOpen={modalIsOpen} NairaFormat={NairaFormat} type={type} localhost={localhost}/>}
  </div>
  
);

};

export default DailyCashBook;




