import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { utils, writeFile } from 'xlsx';
import loadingGif from './loading.gif'; 
import { FaFilePdf, FaFileExcel, FaPrint } from 'react-icons/fa';
// import { localhost } from './env.js';

const Report = ({ state, setState }) => {
  const {localhost,sesdate}= state;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  

  const buttonStyle = (num = 0) => ({
    border: '2px solid #331818',
    boxShadow: '0 0 10px rgba(0, 50, 0, 0.1)',
    maxWidth: num === 0 ||num === 2 ? '50%':'50%',
    display: 'flex',
    marginRight: '1%',
    marginLeft: num === 1 ?'10%':'1%',
    borderRadius: '30%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
    backgroundColor: num === 0 ? 'white' : num === 1 ?'yellow':'red',
  });
  const buttonContainer= {
    display: 'flex',
    flexDirection: 'row', /* Align buttons vertically */
    alignItems: 'center', /* Center align buttons horizontally */
    marginTop: '1%' /* Space between the buttons and the table */
  }
  //function to write the report-container div in a new window for printing
  const printReport = () => {
    const reportContainer = document.querySelector('.report-container');
    const newWindow = window.open('', '_blank');
    
    newWindow.document.write(`
      <html>
        <head>
          <title>Print Report</title>
          <style>
            /* Add any styles you need for printing here */
            body { font-family: Arial, sans-serif; }
            .report-table { width: 100%; border-collapse: collapse; }
            .report-table th, .report-table td { border: 1px solid #ddd; padding: 8px; }
            .report-table th { background-color: #f0f0f0; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div>${reportContainer.innerHTML}</div>
        </body>
      </html>
    `);
    
    newWindow.document.close(); // Close the document for writing
  };
  
  const handleDownloadPDF = () => {
    const doc = new jsPDF('l');
    doc.text('Staff Performance Report', 10, 10);
    
    const columns = [
      { header: 'Branch', dataKey: 'Branch' },
      { header: 'Primary Officer ID', dataKey: 'primaryofficerid' },
      { header: 'Loan Balance', dataKey: 'Loanbal' },
      { header: 'Deposit Balance', dataKey: 'DepositBal' },
      { header: 'Disbursement', dataKey: 'disbursement' },
      { header: 'Mobilized', dataKey: 'mobilized' },
      { header: 'Overdue Interest', dataKey: 'OVAPLusInt' },
      { header: 'Overdue Principal Only', dataKey: 'OVAprinOnly' },
      { header: 'Borrower', dataKey: 'borrower' },
      { header: 'New Client', dataKey: 'newclient' },
      { header: 'Closed Client', dataKey: 'closedclient' },
      { header: 'New Borrower', dataKey: 'NBorrower' },
      { header: 'Full Payment', dataKey: 'fullpay' },
      { header: 'BOD', dataKey: 'BOD' },
      { header: 'PAR', dataKey: 'PAR' },
    ];

    doc.autoTable({
      head: [columns.map(col => col.header)],
      body: data.map(item => columns.map(col => item[col.dataKey])),
      startY: 20,
    });

    doc.save('Staff_Performance_Report.pdf');
  };

  const handleDownloadExcel = () => {
    const workbook = utils.book_new();
    const worksheet = utils.json_to_sheet(data);
    utils.book_append_sheet(workbook, worksheet, 'Report');
    writeFile(workbook, 'report.xlsx');
  };

  useEffect(() => {
    setLoading(true);
    const fetchTransactions = async () => {
      try {
        const response = await axios.post(`${localhost}/get_staffreport`,{sesdate});
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response ? err.response.data.err : 'An error occurred');
        console.error('Error fetching transactions:', err);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="report-container">
      {loading ? (
        <img src={loadingGif} alt="Loading..." style={{ width: '10%', height: '10%' }} />
      ) : error ? (
        <div style={{ color: 'red' }}>{error.replace('mssql-70716-0.cloudclusters.net','Database server')}</div>
      ) : (
        <>
          <h1 style={{ color: "Gray", textAlign: 'center' }}>Staff Performance Report  <span style={{fontSize:'1rem'}}><weak>As At {sesdate.slice(0,10)}</weak></span></h1>
          <table className="report-table">
            <thead>
              <tr style={{ color: "grey", fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
                {/* Table Headers */}
                <th>Branch</th>
                <th>Primary Officer ID</th>
                <th>Loan Balance</th>
                <th>Deposit Balance</th>
                <th>Disbursement</th>
                <th>Mobilized</th>
                <th>Overdue Interest</th>
                <th>Overdue Principal Only</th>
                <th>Borrower</th>
                <th>Savers</th>
                <th>New Client</th>
                <th>Closed Client</th>
                <th>New Borrower</th>
                <th>Full Payment</th>
                <th>BOD</th>
                <th>PAR</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={row.primaryofficerid}> {/* Use a unique key if available */}
                  <td>{row.Branch}</td>
                  <td>{row.primaryofficerid}</td>
                  <td style={{ color: "red" }}>{row.Loanbal.toLocaleString()}</td>
                  <td>{row.DepositBal.toLocaleString()}</td>
                  <td>{row.disbursement.toLocaleString()}</td>
                  <td style={{ color: "green" }}>{row.mobilized.toLocaleString()}</td>
                  <td>{row.OVAPLusInt.toLocaleString()}</td>
                  <td>{row.OVAprinOnly.toLocaleString()}</td>
                  <td>{row.borrower.toLocaleString()}</td>
                  <td>{row.saver.toLocaleString()}</td>
                  <td>{row.newclient.toLocaleString()}</td>
                  <td>{row.closedclient.toLocaleString()}</td>
                  <td>{row.NBorrower.toLocaleString()}</td>
                  <td>{row.fullpay.toLocaleString()}</td>
                  <td>{row.BOD.toLocaleString()}</td>
                  <td>{row.PAR}%</td>
                </tr>
              ))}
              {/* Total Row */}
              <tr style={{ fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
                <td>Total</td>
                <td></td>
                <td>{Math.round(data.reduce((sum, row) => sum + row.Loanbal, 0)).toLocaleString()}</td>
                <td>{Math.round(data.reduce((sum, row) => sum + row.DepositBal, 0)).toLocaleString()}</td>
                <td>{Math.round(data.reduce((sum, row) => sum + row.disbursement, 0)).toLocaleString()}</td>
                <td>{Math.round(data.reduce((sum, row) => sum + row.mobilized, 0)).toLocaleString()}</td>
                <td>{Math.round(data.reduce((sum, row) => sum + row.OVAPLusInt, 0)).toLocaleString()}</td>
                <td>{Math.round(data.reduce((sum, row) => sum + row.OVAprinOnly, 0)).toLocaleString()}</td>
                <td>{Math.round(data.reduce((sum, row) => sum + row.borrower, 0)).toLocaleString()}</td>
                <td>{Math.round(data.reduce((sum, row) => sum + row.saver, 0)).toLocaleString()}</td>
                <td>{Math.round(data.reduce((sum, row) => sum + row.newclient, 0)).toLocaleString()}</td>
                <td>{Math.round(data.reduce((sum, row) => sum + row.closedclient, 0)).toLocaleString()}</td>
                <td>{Math.round(data.reduce((sum, row) => sum + row.NBorrower, 0)).toLocaleString()}</td>
                <td>{Math.round(data.reduce((sum, row) => sum + row.fullpay, 0)).toLocaleString()}</td>
                <td>{Math.round(data.reduce((sum, row) => sum + row.BOD, 0)).toLocaleString()}</td>
                <td>{data.length > 0 ? (Math.round(data.reduce((sum, row) => sum + row.PAR, 0) / data.length)).toFixed(2) + '%' : '0%'}</td>
              </tr>
            </tbody>
          </table>
          <div className="button-container" style={buttonContainer}>
            {/* <button style={buttonStyle(1)} onClick={() => window.print()}><FaPrint style={{ marginRight: '5px' }} /> Print ReportPrint Report</button>
            <button className="input-button" style={buttonStyle(2)} onClick={handleDownloadPDF}><FaFilePdf style={{ marginRight: '5px' }} />Download PDF</button>
            <button className="input-button" style={buttonStyle(0)} onClick={handleDownloadExcel}> <FaFileExcel style={{ marginRight: '5px' }} />Download Excel</button>
              */}
          <FaPrint style={buttonStyle(1)} onClick={printReport}/>Print Report
          <FaFilePdf style={buttonStyle(2)} onClick={handleDownloadPDF}/>Download PDF
          <FaFileExcel style={buttonStyle(0)} onClick={handleDownloadExcel}/>Download Excel

          </div> 
        </>
      )}
    </div>
  );
};

export default Report;
