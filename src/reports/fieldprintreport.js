import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
// import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { FaFilePdf, FaEye, FaPrint } from 'react-icons/fa';
import loadingGif from '../loading.gif'; 
import './fieldprintreport.css';
const Report = ({ state, setState }) => {
  const localhost = state?.localhost;
  const branch = state?.branch.slice(0, 3) || '002';
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [groupname, setGroupname] = useState('Individual');
  const [officer, setOfficer] = useState('');
  const [meetingDay, setMeetingDay] = useState('');
  

  const companyname = state.companyname;
 

const handleExportToPDF = () => {
  const mainContent = document.querySelector('main');
  
  if (!mainContent) return;

  const doc = new jsPDF('landscape', 'mm', 'a4'); // Landscape mode for wider tables
   // Add custom text
   doc.setFontSize(13); // Set font size
   doc.setTextColor(255, 215, 0); // Gold color for the title
   doc.text(`[Gowfin]         ${companyname} FIELD COLLECTION SHEET`, 10, 10);
 
   doc.setFontSize(10); // Smaller font for the additional details
   doc.setTextColor(0, 0, 0); // Black color
   doc.text(
     `Loan Officer's Name: 'CSO', Union Name: ${groupname}, Printed on: ${new Date().toLocaleDateString()}`, 
     10, 
     20
   );
 
 

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
    startY: 26, // Start table below the top margin
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

  ////Function sanitize the field print
  function RemoveDuplicate(data) {
    // Create Sets to track unique custno-Lnid pairs and savings values
    const seen = new Set();
    const seenSavings = {};

    // Define the list of savings fields to track
    const savingsFields = [
        'Regular Savings',
        'Voluntary Savings',
        'Future Savings',
        'MyPikin Savings',
        'Daily Savings' ,
        'DASCA Savings',
        'Fixed Savings',
        'Staff Savings',
        // Add Daily Savings here
    ];

    // Create the purged data array
    const purgeddata = data.filter(item => {
        const uniqueKey = `${item.custno}-${item.Lnid || item.Lnid2}`; // Use custno and Lnid as unique key

        // Check if the custno-Lnid pair has been seen before
        if (seen.has(uniqueKey)) {
            // Zero out duplicate savings values
            for (let key of savingsFields) { // Iterate over all savings fields
                const value = item[key];

                // If the value is not null and has been seen before, set it to 0
                if (value !== null && seenSavings[key] && seenSavings[key].has(value)) {
                    item[key] = 0; // Set duplicate savings to 0
                } else if (value !== null) {
                    // Otherwise, add the value to the seen set for that savings field
                    if (!seenSavings[key]) {
                        seenSavings[key] = new Set(); // Initialize the Set for the key if it doesn't exist
                    }
                    seenSavings[key].add(value); // Add the value to the set of seen savings values
                }
            }
            return true; // Keep the item, but with updated savings values
        }

        // If the custno-Lnid pair has not been seen, add it to the seen set
        seen.add(uniqueKey);

        // Zero out duplicate savings for this item if applicable
        for (let key of savingsFields) { // Iterate over all savings fields
            const value = item[key];
            if (value !== null && seenSavings[key] && seenSavings[key].has(value)) {
                item[key] = 0; // Set duplicate savings to 0
            } else if (value !== null) {
                if (!seenSavings[key]) {
                    seenSavings[key] = new Set(); // Initialize the Set for the key if it doesn't exist
                }
                seenSavings[key].add(value); // Add the value to the set of seen savings values
            }
        }

        return true; // Keep the first item for unique custno-Lnid pair
    });

    return purgeddata; // Return the purged data array
}


  
  const fetchFieldPrint = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${localhost}/getfieldprint`, {
        groupname,
        branch,
      });
      //eliminating duplicate records based on custno and Lnid, while zeroing out duplicate savings values leave out only the first:
      const purgeddata=response.data.records.length>0?RemoveDuplicate(response.data.records):[];
      // console.log('Data without duplicate:');
      // console.log(purgeddata );

      setData(purgeddata || []);
      setOfficer(response.data.officer);
      setMeetingDay(response.data.meetingDay);
      setError(response.data.records.length > 0 ? 'Fetch successful' : `${groupname} not found.`);
    } catch (err) {
      setError(err.response?.data?.records?.error || 'An error occurred while fetching data.');
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
            font-size: 10px; /* Reduce font size to fit more columns */
          }
          th, td {
            border: 1px solid black;
            padding: 2px; /* Reduce padding to save space */
            text-align: left;
          }
          @page {
            size: landscape; /* Set page orientation to landscape */
            margin: 5mm; /* Adjust margins for better fitting */
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
      <div style={{width:'5%',display: 'flex', gap: '2px',direction:'row'}}><button style={{color:"#007bff",backgroundColor: 'transparent'}} onClick={fetchFieldPrint}>
        {loading ? <img src={loadingGif} alt="Loading..." style={{ width: '30px', height: '30px' }} /> :'View'}<FaEye/>
      </button> <button  style={{color:"#28a745",backgroundColor: 'transparent'}} onClick={handlePrint}><FaPrint/></button> <button style={{color:"#d32f2f",backgroundColor: 'transparent'}} onClick={handleExportToPDF}><FaFilePdf/></button></div>

      {error && <p style={{ color: error.includes('successful') ? 'green' : 'red' }}>{error}</p>}
      <main>
      <span style={{color: 'gold',whiteSpace: 'pre' }}><strong><tab/>{'\t'}{state.companyname} FIELD COLLECTION SHEET</strong></span>
        <p>
          <strong>Loan Officer's Name:</strong> {officer}, <strong>Union Name:</strong> {groupname} <strong> Meeting Day:</strong> {meetingDay}  <span style={{color:'brown',margin:'10%'}}>{'                           '}Printed on: {new Date().toLocaleDateString()}</span>
        
        </p>

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
            <td style={{ padding: '2px' }}>{row.phone || ''}{row.phone && row.Gphone ? <br /> : ''}{row.Gphone || ''}{row.Gphone && row.Gphone2 ? <br /> : ''}{row.Gphone2 || ''}</td>
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
        
      </main>
    </div>
  );
  
};

 export default Report;
