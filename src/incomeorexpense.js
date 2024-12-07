import React, { useState } from 'react';
import axios from 'axios';
import loadingGif from './loading.gif'; // Your loading gif file

function IncomeorExpense({state}) {
    const {localhost,sesdate,branch}=state;
    const [reportType, setReportType] = useState('GL Balance');
    const [fromDate, setFromDate] = useState(sesdate);
    const [toDate, setToDate] = useState(sesdate);
    const [branchCode, setBranchCode] = useState(branch.slice(0,3));
    const [posting, setPosting] = useState(false);
    const [reportData, setReportData] = useState([]);
   
    const generateReport = async () => {
        try {
            setPosting(true);
            const response = await axios.post(`${localhost}/generateIncomeandorexpensenewclientReport`, {
                reportType,
                fromDate,
                toDate,
                branchCode,
            });
            setReportData(response.data);
            setPosting(false)
        } catch (error) {
            setPosting(false)
            console.error('Error generating report:', error);
            alert('Error generating report.');
        }
    };

    const totalAmount = reportData.reduce((sum, item) => sum + item.Amount, 0);
      // Helper function to calculate totals
  const calculateTotals = (data) => {
    const summary = {};
    const primaryOfficerTotals = {};
    let grandMale = 0;
    let grandFemale = 0;

    data.forEach((item) => {
      const { PrimaryOfficerID, groupname, Gender } = item;

      // Initialize PrimaryOfficerID in summary
      if (!summary[PrimaryOfficerID]) {
        summary[PrimaryOfficerID] = {};
        primaryOfficerTotals[PrimaryOfficerID] = 0; // Initialize client count
      }

      // Initialize groupname under PrimaryOfficerID
      if (!summary[PrimaryOfficerID][groupname]) {
        summary[PrimaryOfficerID][groupname] = { total: 0, Gender: {} };
      }

      // Increment group total
      summary[PrimaryOfficerID][groupname].total++;
      primaryOfficerTotals[PrimaryOfficerID]++; // Increment Primary Officer total

      // Increment Gender count under groupname
      if (!summary[PrimaryOfficerID][groupname].Gender[Gender]) {
        summary[PrimaryOfficerID][groupname].Gender[Gender] = 0;
      }
      summary[PrimaryOfficerID][groupname].Gender[Gender]++;

      // Update grand totals for genders
      if (Gender === "Male") grandMale++;
      if (Gender === "Female") grandFemale++;
    });

    return { summary, grandMale, grandFemale, primaryOfficerTotals };
  };

  const {
    summary: totals,
    grandMale,
    grandFemale,
    primaryOfficerTotals,
  } = calculateTotals(reportData);

  // Calculate grand total
  const grandTotal = Object.values(primaryOfficerTotals).reduce((sum, count) => sum + count, 0);

    const totalPrimaryOfficers = Object.keys(totals).length;
  
//   //Calculate grand total
//   const grandTotal = Object.values(totals).reduce(
//     (sum, group) => sum + group.total,
//     0
//   );

    return (
        <div>
            <h1>Report Generator</h1>
            <div>
                <label>Report Type:</label>
                <select value={reportType} onChange={e => setReportType(e.target.value)}>
                    <option value="Income and Expense">Income and Expense</option>
                    <option value="New and Closed Clients Detail">New and Closed Clients Detail</option>
                    <option value="Income Report">Income Report</option>
                    <option value="Expense Report">Expense Report</option>
                </select>
            </div>
            <div>
                <label>From Date:</label>
                <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
            </div>
            <div>
                <label>To Date:</label>
                <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
            </div>
            <div>
                <label>Branch Code:</label>
                <input type="text" value={branchCode} onChange={e => setBranchCode(e.target.value)} />
            </div>
            <button onClick={generateReport}>{posting?<img src={loadingGif} alt="Loading..." style={{ width: '20px', height: '20px' }} />:'Generate Report'}</button>
           
            { reportType==='Income Report' ||reportType==='Expense Report' ?(
    <div style={{ padding: "20px" }}>
      <h2 style={{color:reportType==='Income Report'?'green':'red'}}>{reportType}</h2>
      <table
        border="1"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
        }}
      >
        <thead>
          <tr>
            <th>Date Effective</th>
            <th>Transaction ID</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((item, index) => (
            <tr key={index}>
              <td>{item.DateEffective.slice(0,10)}</td>
              <td>{item.TranID}</td>
              <td>{item.stmtref}</td>
              <td style={{color:reportType==='Income Report'?'green':'red'}}>{item.Amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
  <tr>
    <td colSpan="3" style={{ fontWeight: "bold", textAlign: "right" }}>
      Total:
    </td>
    <td style={{color:reportType==='Income Report'?'green':'red',fontWeight:'bold'}}>
      {totalAmount.toFixed(2)}
    </td>
    <td></td>
  </tr>
 </tfoot>
      </table>
    </div>
  ):reportType==='New and Closed Clients Detail' ? (<div style={{ padding: "20px" }}>
  <h2>{reportType}</h2>
  
  <h3>Summary</h3>
      <table
        border="1"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
        }}
      >
        <thead>
          <tr>
            <th>Primary Officer</th>
            <th>Group Name</th>
            <th>Total</th>
            <th>Gender Breakdown</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(totals).map(([officer, groups]) =>
            Object.entries(groups).map(([groupname, details]) => (
              <tr key={`${officer}-${groupname}`}>
                <td>{officer}</td>
                <td>{groupname}</td>
                <td>{details.total}</td>
                <td>
                  {Object.entries(details.Gender).map(
                    ([gender, count]) => `${gender}: ${count} `
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h3>Grand Totals</h3>
      <p>Total New Clients: {grandTotal}</p>
      <p>Total Primary Officers: {totalPrimaryOfficers}</p>
      <p>Grand Total Male: {grandMale}</p>
      <p>Grand Total Female: {grandFemale}</p>
      <h3>Total Clients Per Primary Officer</h3>
      <ul>
        {Object.entries(primaryOfficerTotals).map(([officer, count]) => (
          <li key={officer}>
            {officer}: {count}
          </li>
        ))}
      </ul>
      <tr><span>Details:</span></tr>
  <table
    border="1"
    style={{
      width: "100%",
      borderCollapse: "collapse",
      textAlign: "left",
    }}
  >
    <thead>
      <tr>
        <th>Customer No</th>
        <th>Client Name</th>
        <th>Gender</th>
        <th>Phone</th>
        <th>Date Created</th>
        <th>Status</th>
        <th>Group Name</th>
        <th>Primary Officer</th>
      </tr>
    </thead>
    <tbody>
      {reportData.map((item, index) => (
        <tr key={index}>
          <td>{item.Custno}</td>
          <td>{item.ClientName}</td>
          <td>{item.Gender}</td>
          <td>{item.Phone || "N/A"}</td>
          <td>{item.DateCreated.slice(0,10)}</td>
          <td>{item.Status}</td>
          <td>{item.groupname}</td>
          <td>{item.PrimaryOfficerID}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
):<pre>{JSON.stringify(reportData, null, 2)}</pre>}
        </div>
    );
}

export default IncomeorExpense;
