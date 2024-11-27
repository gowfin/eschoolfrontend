import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { utils, writeFile } from 'xlsx';
import loadingGif from './loading.gif'; 
import './fieldprintreport.css'
const Report = ({ state, setState }) => {
  const localhost = state?.localhost || 'http://localhost:3005';
  const branch = state?.branch.slice(0, 3) || '002';
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [groupname, setGroupname] = useState('Individual');

  const compname = state.compname;
  const loanOfficer = '';

const handleExportToPDF = () => {
  const mainContent = document.querySelector('main');
  
  if (!mainContent) return;

  const doc = new jsPDF('landscape', 'mm', 'a4'); // Landscape mode for wider tables

  // Extract table data
  const table = mainContent.querySelector('table');
  const headers = Array.from(table.querySelectorAll('thead th')).map((th) => th.innerText);
  const rows = Array.from(table.querySelectorAll('tbody tr')).map((tr) => 
    Array.from(tr.querySelectorAll('td')).map((td) => td.innerText)
  );

  // Use autoTable to generate the table
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 10, // Start table below the top margin
    styles: {
      fontSize: 8, // Adjust font size for fitting content
      cellPadding: 0, // Minimize padding for more space
      lineWidth: 0.1, // Add thin table borders
      lineColor: [0, 0, 0], // Black table borders
    },
    columnStyles: {
      3: { cellWidth: 30 }, // Adjust width for the Name column (index 1)
    },
    tableWidth: 'auto', // Automatically fit to page width
    margin: { left: 1, right: 1}, // Minimize margins for more space
  });

  // Save the PDF
  doc.save('field-collection-sheet.pdf');
};

  
  
  const fetchFieldPrint = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${localhost}/getfieldprint`, {
        groupname,
        branch,
      });
      setData(response.data || []);
      setError(response.data.length > 0 ? 'Fetch successful' : `${groupname} not found.`);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  const calculateLoanBal = (row) => {
    const loanProducts = {
      REGLN6: row.Regln6,
      REGLN7: row.Regln7,
      REGLN8: row.Regln8,
      FARMLN6: row.FARMLN6,
      DAILYLN: row.DAILYLN,
      DAILYLN1: row.DAILYLN1,
      DAILYLN2: row.DAILYLN2,
      INDLN1: row.INDLN1,
      INDLN2: row.INDLN2,
      INDLN3: row.INDLN3,
      INDLN4: row.INDLN4,
      INDLN5: row.INDLN5,
      INDLN6: row.INDLN6,
      BasicLN: row.BasicLN,
      SocLN1: row.SocLN1,
      SocLN2: row.SocLN2,
      SocLN3: row.SocLN3,
      SocLN4: row.SocLN4,
      SocLN5: row.SocLN5,
      SocLN6: row.SocLN6,
      SocLN7: row.SocLN7,
      SocLN8: row.SocLN8,
      SocLN9: row.SocLN9,
      SocLN10: row.SocLN10,
      SocLN11: row.SocLN11,
      SocLN12: row.SocLN12,
      BSLLN1: row.BSLLN1,
      BSLLN2: row.BSLLN2,
      BSLLN3: row.BSLLN3,
      BSLLN4: row.BSLLN4,
      BSLLN5: row.BSLLN5,
      BSLLN6: row.BSLLN6,
      BSLLN7: row.BSLLN7,
      BSLLN8: row.BSLLN8,
      BSLLN9: row.BSLLN9,
      BSLLN10: row.BSLLN10,
      BSLLN11: row.BSLLN11,
      BSLLN12: row.BSLLN12,
      MIDTMLN: row.MIDTMLN,
      SPELN: row.SPELN,
    };
    return loanProducts[row.Loanproduct] || 0;
  };
  const ff = (number) => {
    return number.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
// Calculate column totals
const calculateTotals = () => {
  const totals = {};
  const moneyColumns = [
    'Regular Savings',
    'Voluntary Savings',
    'Daily Savings',
    'Union Purse Savings',
    'disbursed',
    'repaid',
    'instalment',
    'overdue',
    'Expected',
  ];

  moneyColumns.forEach((key) => {
    totals[key] = data.reduce((sum, row) => sum + (row[key] || 0), 0);
  });

  return totals;
};

const totals = calculateTotals();
const handlePrint = () => {
  const mainContent = document.querySelector('main').outerHTML; // Get only the main content
  const printWindow = window.open('', '_blank'); // Open a new window
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Print</title>
      <style>
        @media print {
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
          }
          table {
            width: 100%; /* Make the table fit the page width */
            border-collapse: collapse;
            font-size: 8px; /* Reduce font size to fit more columns */
          }
          th, td {
            border: 1px solid black;
            padding: 2px; /* Reduce padding to save space */
            text-align: left;
          }
          @page {
            size: landscape; /* Set page orientation to landscape */
            margin: 10mm; /* Adjust margins for better fitting */
          }
        }
      </style>
    </head>
    <body>${mainContent}</body>
    </html>
  `);
  printWindow.document.close(); // Close the document to trigger rendering
  printWindow.focus(); // Focus on the print window
  printWindow.print(); // Trigger the print dialog
  printWindow.close(); // Close the print window after printing
};


  return (
    <div>
      <input
        type="text"
        value={groupname}
        onChange={(e) => setGroupname(e.target.value)}
        placeholder="Type group name here and click the View button"
      />
      <div style={{width:'10%'}}><button onClick={fetchFieldPrint}>
        {loading ? <img src={loadingGif} alt="Loading..." style={{ width: '30px', height: '30px' }} /> : 'View'}
      </button> <button onClick={handlePrint}>Print</button> <button onClick={handleExportToPDF}>Export to PDF</button></div>

      {error && <p style={{ color: error.includes('successful') ? 'green' : 'red' }}>{error}</p>}
      <main>
      <span style={{color: 'gold'}}>{state.companyname} FIELD COLLECTION SHEET</span>
        <p>
          <strong>Loan Officer's Name:</strong> {loanOfficer}, <strong>Union Name:</strong> {groupname}  Printed on: {new Date().toLocaleDateString()}
        </p>
         <section>

          <table className="report-table" aria-label="Field Collection Report" >
     <thead>
        <tr>
          <th style={{ padding: '2px'  }}>S/N</th>
          <th style={{ padding: '2px'  }}>CustNo.</th>
           <th style={{ padding: '2px' }}>LoanID</th>
           <th style={{ padding: '2px'  }} >Name</th>
          <th style={{ padding: '2px' }}>RegAmt</th>
           <th style={{ padding: '2px' }}>VolAmt</th>
          <th style={{ padding: '2px' }}>DlyAmt</th>
          <th style={{ padding: '2px' }}>UnPAmt</th>
          <th style={{ padding: '2px' }}>RegSBal</th>
          <th style={{ padding: '2px' }}>VolSBal</th>
          <th style={{ padding: '2px' }}>DlySBal</th>
           <th style={{ padding: '2px' }}>UnPurBal</th>
           <th style={{ padding: '2px' }}>TotalSavgs</th>
          <th style={{ padding: '2px' }}>DateDisb</th>
          <th style={{ padding: '2px' }}>DisbAmt</th>
           <th style={{ padding: '2px' }}>LnProduct</th>
           <th style={{ padding: '2px' }}>LoanBal</th>
           <th style={{ padding: '2px' }}>Duratn</th>
          <th style={{ padding: '2px' }}>PaymtCnt</th>
           <th style={{ padding: '2px' }}>Repaid</th>
           <th style={{ padding: '2px' }}>instal</th>
           <th style={{ padding: '2px' }}>Overdue</th>
          <th style={{ padding: '2px' }}>Amount</th>
          <th style={{ padding: '2px' }}>expected</th>
          <th style={{ padding: '2px' }}>Phone</th>
        </tr>
      </thead>       <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td style={{ padding: '2px', textAlign: 'center' }}>{index + 1}</td>
            <td style={{ padding: '2px' }}>{row.custno}</td>
            <td style={{ padding: '2px' }}>{row.Lnid}</td>
            <td style={{ padding: '2px' }}>{row.Accountname?.toUpperCase()}</td>
            <td style={{ padding: '2px' }}>{''}</td>
            <td style={{ padding: '2px' }}>{''}</td>
            <td style={{ padding: '2px' }}>{''}</td>
            <td style={{ padding: '2px' }}>{''}</td>
            <td style={{ padding: '2px' }}>{row['Regular Savings']? ff(row['Regular Savings']): 0}</td>
            <td style={{ padding: '2px' }}>{row['Voluntary Savings']?ff(row['Voluntary Savings']) : 0}</td>
            <td style={{ padding: '2px' }}>{row['Daily Savings']?ff(row['Daily Savings']) : 0}</td>
            <td style={{ padding: '2px' }}>{row['Union Purse Savings']?ff(row['Union Purse Savings']) : 0}</td>
            <td style={{ padding: '2px' }}>
                    {['Voluntary Savings', 'Regular Savings', 'Daily Savings', 'Union Purse Savings']
                      .reduce((sum, key) => sum + (row[key] || 0), 0)}
            </td>
            <td style={{ padding: '2px' }}>{row.disburseddate}</td>
            <td style={{ padding: '2px' }}>{row.disbursed?ff(row.disbursed):0}</td>
            <td style={{ padding: '2px' }}>{row.Loanproduct}</td>
            <td style={{ padding: '2px' }}>{row.disbursed>0 && row.instalment>0 ?  ff(-parseFloat(calculateLoanBal(row)?.toFixed(2))):''}</td>
            <td style={{ padding: '2px' }}>{row.disbursed>0 && row.instalment>0 ? (Math.floor(row.disbursed/row.instalment)):''}</td>
            <td style={{ padding: '2px' }}>{ row.disbursed>0 && row.instalment>0 ?Math.floor((row.repaid+1)/row.instalment):0}</td>
            <td style={{ padding: '2px' }}>{row.disbursed>0 && row.instalment>0 ? ff(parseFloat(row.repaid?.toFixed(2))):''}</td>
            <td style={{ padding: '2px' }}>{row.instalment? ff(row.instalment):0}</td>
            <td style={{ padding: '2px' }}>{row.overdue>0? ff(row.overdue):0}</td>
            <td style={{ padding: '2px' }}>{''}</td>
            <td style={{ padding: '2px' }}>{row.Expected>0? ff(row.Expected):0}</td>
            <td style={{ padding: '2px' }}>{row.phone|| ''+"\n"+row.Gphone|| ''+"\n"+row.Gphone2|| '' }</td>
                </tr>
              ))}
 {/* Totals Row */}
 <tr>
 <td colSpan="8" style={{ fontWeight: 'bold', textAlign: 'right' }}>
   Totals:
 </td>
 <td>{ff(totals['Regular Savings'])}</td>
 <td>{ff(totals['Voluntary Savings'])}</td>
 <td>{ff(totals['Daily Savings'])}</td>
 <td>{ff(totals['Union Purse Savings'])}</td>
 <td>{ff(totals['Regular Savings']+totals['Voluntary Savings']+totals['Daily Savings']+totals['Union Purse Savings'])}</td>
 <td colSpan="1"></td>
 <td>{ff(totals['disbursed'])}</td>
 <td colSpan="1"></td>
 <td>{ff(totals['disbursed']-totals['repaid'])}</td>
 <td colSpan="2"></td>
 <td>{ff(totals['repaid'])}</td>
 <td colSpan="1"></td>
 <td>{ff(totals['overdue'])}</td>
 <td colSpan="1"></td>
 <td>{ff(totals['Expected'])}</td>
 <td></td>
</tr>

            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
  
};

 export default Report;
