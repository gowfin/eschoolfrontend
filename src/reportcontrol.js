import React, { useEffect, useState } from "react";
import axios from "axios";
import loadingGif from "./loading.gif"; // Your loading gif file
import { createRoot } from 'react-dom/client';
import ProfitLossStatement from "./morereports/profitOrLoss";
import NewAndClosedClients from "./newandclosedclientdetails";
import IncomeReport from "./morereports/incomereport";
import Dateformat from './formatdate';


function ReportControl({ state }) {
  const { localhost, sesdate, branch } = state;
  const [reportType, setReportType] = useState("");
  const [fromDate, setFromDate] = useState(Dateformat(sesdate));
  const [toDate, setToDate] = useState(Dateformat(sesdate));
  const [branchCode, setBranchCode] = useState(branch.slice(0, 3));
  const [posting, setPosting] = useState(false);
  const [reportData, setReportData] = useState([]);

  const isIncome = reportType === "Income Report" || reportType === "Expense Report"? true:false;
  const isIncomeexp = reportType === "Income and Expense"? true:false;
  const isNewClient = reportType === "New and Closed Clients Detail"? true:false;

 
const handlechange=(e)=>{
 setReportType(e.target.value)
 setReportData([]);
}
  const generateReport = async () => {
    if(reportType===''){
   alert('You need to select a report type first.');
    }
    else{
    try {
      setPosting(true);
      
      const response = await axios.post(
        `${localhost}/generateIncomeandorexpensenewclientReport`,
        {
          reportType,
          fromDate,
          toDate,
          branchCode,
        }
      );
      setReportData(response.data || []);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Error generating report.");
    } finally {
      setPosting(false);
    }
  }

  };

  useEffect(() => {
    if (reportData.length > 0) {
      console.log(reportData);
      const container = document.getElementById("reportContainer");
      if (container) {
        const root = createRoot(container); // Initialize a root for the container
  
        if (isNewClient) {
          root.render(<NewAndClosedClients reportData={reportData} />);
        } else if (isIncomeexp) {
          root.render(<ProfitLossStatement reportData={reportData} />);
        } else if (isIncome) {
          root.render(<IncomeReport reportType={reportType} reportData={reportData} />);
        }
      }
    }
  }, [reportData, reportType]);


  return (
    <div>
      <h1>Report Generator</h1>
      <div>
        <label>Report Type:</label>
        <select value={reportType} onChange={handlechange}>
          <option value="">Select Report Type</option>
          <option value="Income and Expense">Income or Expense</option>
          <option value="New and Closed Clients Detail">New and Closed Clients Detail</option>
          <option value="Income Report">Income Report</option>
          <option value="Expense Report">Expense Report</option>
        </select>
      </div>
      <div>
        <label>From Date:</label>
        <input
          type="date"
          value={Dateformat(fromDate)}
          onChange={(e) => setFromDate(e.target.value)}
        />
      </div>
      {!isIncomeexp &&<div>
        <label>To Date:</label>
        <input
          type="date"
          value={Dateformat(toDate)}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>}
      <div>
        <label>Branch Code:</label>
        <input
          type="text"
          value={branchCode}
          onChange={(e) => setBranchCode(e.target.value)}
        />
      </div>
      <button onClick={generateReport}>
        {posting ? (
          <img
            src={loadingGif}
            alt="Loading..."
            style={{ width: "20px", height: "20px" }}
          />
        ) : (
          "Generate Report"
        )}
      </button>

      
      {/* Placeholder for dynamic rendering */}
      <div id="reportContainer"></div>
    </div>
  );
}

export default ReportControl;
