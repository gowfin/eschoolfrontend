import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import loadingGif from './loading.gif'; // Your loading gif file
import FormatDate from './formatdate'

function DisbursementReport({state,setState} ) {
  const [startDate, setStartDate] = useState(FormatDate(new Date()));
  const [endDate, setEndDate] = useState(FormatDate(new Date()));
  const [report, setReport] = useState(null);
  const [searching ,setSearching ]=useState(false);
  
//   alert(FormatDate(new Date()));

// Calculate totals
const totals =report && report.reduce(
  (acc, item) => {
    acc.totalAmount += item.Amount || 0;
    acc.totalPrincipalAndInterest += (item.Amount * item.InterestPercent) || 0;
    acc.totalInterest += ((item.Amount * item.InterestPercent) - item.Amount) || 0;
    return acc;
  },
  {
    totalAmount: 0,
    totalPrincipalAndInterest: 0,
    totalInterest: 0,
  }
);
  const generateReport = async () => {
    const {localhost,branch}= state ;
    setSearching(true);
    
    
    const code=branch.slice(0,3);
    // const code='002';
    
    try {
      const response = await axios.post(`${localhost}/disbursedetail-report`, {
        startDate,
        endDate,
        code
      });
      setReport(response.data); // Sets the report data from backend response
      setSearching(false);
    } catch (error) {
      console.error("Error generating report", error);
      setSearching(false);
    }
  };
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Disbursement Report', 10, 10);
    doc.text(JSON.stringify(report, null, 2), 10, 20);
    doc.save('Disbursement_Report.pdf');
  };
  function DisbursementTable({ data }) {
    return (
      <div>
        {data.length > 0 ? (
          <table border="1" cellPadding="10" cellSpacing="0">
            <thead>
              <tr>
                <th>TranID</th>
                <th>CustNo</th>
                <th>Name</th>
                <th>GroupID</th>
                <th>Disbursed(P)</th>
                <th>Disbursed(P+I)</th>
                <th>Loan Product</th>
                <th>Interest</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.TranID}</td>
                  <td>{item.CustNo}</td>
                  <td>{item.name}</td>
                  <td>{item.GroupID || 'N/A'}</td>
                  <td>{ formatter.format(item.Amount)}</td>
                  <td>{formatter.format((item.Amount*item.InterestPercent).toFixed(2))}</td>
                  <td>{item.loanproduct}</td>
                  <td>{formatter.format((item.Amount*item.InterestPercent).toFixed(2)-item.Amount)}</td>
                </tr>
              ))}
              {/* Footer row for totals */}
            <tr style={{ fontWeight: 'bold' }}>
              <td colSpan="4" align="right">Totals:</td>
              <td>{formatter.format(totals.totalAmount.toFixed(2))}</td>
              <td>{formatter.format(totals.totalPrincipalAndInterest.toFixed(2))}</td>
              <td></td>
              <td>{formatter.format(totals.totalInterest.toFixed(2))}</td>
            </tr>
            </tbody>
          </table>
        ) : (
          <p>No data found</p>
        )}
      </div>
    );
  }
  
  return (
    <div>
        {searching && <img src={loadingGif} alt="Loading..." style={{ width: '30px', height: '30px' }} /> }

      <h2>Generate Disbursement Report</h2>
      <div>
        <label>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label>End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <button onClick={generateReport}>Generate Report</button>
      
      {report && (
        <div>
          {/* <pre>{JSON.stringify(report, null, 2)}</pre> */}
          <DisbursementTable data={report} />
        </div>
      )}
          <div><button onClick={exportToPDF}>Export to PDF</button></div>
    </div>

  );
}

export default DisbursementReport;
