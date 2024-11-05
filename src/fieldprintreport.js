import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { utils, writeFile } from 'xlsx';
import loadingGif from './loading.gif'; 
import { FaFilePdf, FaFileExcel, FaPrint } from 'react-icons/fa';
// import { localhost } from './env.js';

const Report = ({ state, setState }) => {
  const {localhost}= state || 'localhost:3000';
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const branch=state.branch.slice(0,3);

  const  groupname='Individual';
  const  loanOfficer='Junior';
  const  compname='Blessed MFI';
  const  futureSavings='Future SAvings';
 const  disburDate='2024-01-30';
const weeksPaid=30000;
 const  unionPurseSavings='1000';
  const  custno='0020000014';
 const  loanid='123456912';
const  accountname='James Iruwa';
 const voluntarySavings='voluntarySavings';
const  regularSavings='regularSavings';


  const buttonStyle = (num = 0) => ({
    border: '2px solid #331818',
    boxShadow: '0 0 10px rgba(0, 50, 0, 0.1)',
    maxWidth: '50%',
    display: 'flex',
    marginRight: '1%',
    marginLeft: num === 1 ? '10%' : '1%',
    borderRadius: '30%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
    backgroundColor: num === 0 ? 'white' : num === 1 ? 'yellow' : 'red',
  });

  const buttonContainer = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '1%',
  };

  const printReport = () => {
    const reportContainer = document.querySelector('.report-container');
    const newWindow = window.open('', '_blank');
    
    newWindow.document.write(`
      <html>
        <head>
          <title>Print Report</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .report-table { width: 100%; border-collapse: collapse; }
            .report-table th, .report-table td { border: 1px solid #ddd; padding: 4px; }
            .report-table th { background-color: #f0f0f0; }
            @media print {
              body { font-size: 10px; } /* Adjust the font size for printing */
              .report-table th, .report-table td { padding: 2px; } /* Optional: Reduce padding for a more compact table */
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div>${reportContainer.innerHTML}</div>
        </body>
      </html>
    `);
    
    newWindow.document.close();
  };
  const handleDownloadPDF = () => {
    const doc = new jsPDF('l');
    doc.text('Daily Transaction Report', 10, 10);
    
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

    doc.save('Daily_Transaction_Report.pdf');
  };

  const handleDownloadExcel = () => {
    const workbook = utils.book_new();
    const worksheet = utils.json_to_sheet(data);
    utils.book_append_sheet(workbook, worksheet, 'Report');
    writeFile(workbook, 'Daily_Transaction_Report.xlsx');
  };
/// Set initial values for dates
useEffect(() => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  setStartDate(today);
  setEndDate(today);
}, []);
// useEffect(() => {
//   const fetchTransactions = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`http://localhost/transactionreports`, {
//         params: { startDate, endDate, branch } // Send parameters here
//       });
//       setData(response.data);
//     } catch (err) {
//       setError(err.response ? err.response.data.err : 'An error occurred');
//       console.error('Error fetching transactions:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchTransactions();
// }, [startDate, endDate]); 


//////////////////////handle Display
const fetchTransactions = async () => {
  setLoading(true);
  try {
    const response = await axios.get(`${localhost}/transactionreports`, {
      params: { startDate, endDate, branch } // Send parameters here
    });
    setData(response.data);
  } catch (err) {
    setError(err.response ? err.response.data.err : 'An error occurred');
    console.error('Error fetching transactions:', err);
  } finally {
    setLoading(false);
  }
};
  const groupData = () => {
    const grouped = {};
    const grandTotal = {
      '010': 0,
      '001': 0,
      '011': 0,
      '002': 0,
      '005': 0,
      '065': 0,
    };

    data.forEach((row) => {
      const formattedValueDate = new Date(row.ValueDate).toISOString().slice(0, 10);
      const { PrimaryOfficerID, groupid, TranID, Amount } = row;

      if (!grouped[formattedValueDate]) {
        grouped[formattedValueDate] = {};
      }
      if (!grouped[formattedValueDate][PrimaryOfficerID]) {
        grouped[formattedValueDate][PrimaryOfficerID] = {};
      }
      if (!grouped[formattedValueDate][PrimaryOfficerID][groupid]) {
        grouped[formattedValueDate][PrimaryOfficerID][groupid] = {
          rows: [],
          subtotals: {
            '010': 0,
            '001': 0,
            '011': 0,
            '002': 0,
            '005': 0,
            '065': 0,
          },
        };
      }

      grouped[formattedValueDate][PrimaryOfficerID][groupid].rows.push(row);

      switch (row.TranID) {
        case '010':
        case 'R010':
          grouped[formattedValueDate][PrimaryOfficerID][groupid].subtotals['010'] += Amount;
          grandTotal['010'] += Amount;
          break;
        case '001':
        case 'R001':
          grouped[formattedValueDate][PrimaryOfficerID][groupid].subtotals['001'] += Amount;
          grandTotal['001'] += Amount;
          break;
        case '011':
        case 'R011':
          grouped[formattedValueDate][PrimaryOfficerID][groupid].subtotals['011'] += Amount;
          grandTotal['011'] += Amount;
          break;
        case '002':
        case 'R002':
          grouped[formattedValueDate][PrimaryOfficerID][groupid].subtotals['002'] += Amount;
          grandTotal['002'] += Amount;
          break;
        case '005':
        case 'R005':
          grouped[formattedValueDate][PrimaryOfficerID][groupid].subtotals['005'] += Amount;
          grandTotal['005'] += Amount;
          break;
      }
    });

    return { grouped, grandTotal };
  };

  const renderTableData = (groupedData) => {
    const { grouped, grandTotal } = groupData();
    return Object.entries(grouped).map(([valueDate, officerData]) => (
      <React.Fragment key={valueDate}>
        <tr>
          <td colSpan={12} style={{ fontWeight: 'bold' }}>{`Value Date: ${valueDate}`}</td>
        </tr>
        {Object.entries(officerData).map(([officerID, groupData]) => (
          <React.Fragment key={officerID}>
            <tr>
              <td colSpan={12} style={{ fontWeight: 'bold' }}>{`Officer: ${officerID}`}</td>
            </tr>
            {Object.entries(groupData).map(([group, groupDetails]) => (
              <React.Fragment key={group}>
                {groupDetails.rows.map((row, index) => (
                  <tr key={index}>
                    <td>{row.TranID}</td>
                    <td>{row.CustNo}</td>
                    <td>{row.AccountID}</td>
                    <td>{row.StmtRef}</td>
                    <td style={{ color: "green" }}>{row.TranID === '010' || row.TranID === 'R010' ? row.Amount.toLocaleString() : '0'}</td>
                    <td style={{ color: "green" }}>{row.TranID === '001' || row.TranID === 'R001' ? row.Amount.toLocaleString() : '0'}</td>
                    <td style={{ color: "green" }}>{row.TranID === '011' || row.TranID === 'R011' ? row.Amount.toLocaleString() : '0'}</td>
                    <td style={{ color: "green" }}>{row.TranID === '002' || row.TranID === 'R002' ? row.Amount.toLocaleString() : '0'}</td>
                    <td style={{ color: "green" }}>{row.TranID === '005' || row.TranID === 'R005' ? row.Amount.toLocaleString() : '0'}</td>
                    <td style={{ color: "green" }}>{row.TranID === '065' || row.TranID === 'R065' ? row.Amount.toLocaleString() : '0'}</td>
                    <td>{row.ValueDate.slice(0,10)}</td>
                  </tr>
                ))}
    
               
      
          
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
          
      </React.Fragment>
    ));
  };

  const renderTableTotal = (grandTotal) => (
    
      <table>
        <tbody>
          <tr>
           
            <td colSpan={4}><strong>Grand Total</strong></td>
            
            <td style={{ color: "green" }}>{grandTotal['010'].toLocaleString()}</td>
            <td style={{ color: "green" }}>{grandTotal['001'].toLocaleString()}</td>
            <td style={{ color: "green" }}>{grandTotal['011'].toLocaleString()}</td>
            <td style={{ color: "green" }}>{grandTotal['002'].toLocaleString()}</td>
            <td style={{ color: "green" }}>{grandTotal['005'].toLocaleString()}</td>
            <td style={{ color: "green" }}>{grandTotal['065'].toLocaleString()}</td>
            
          </tr>
        </tbody>
      </table>
    
  );

  const { grouped, grandTotal } = groupData();

  if (loading) {
    return <img src={loadingGif} alt="Loading..." style={{ width: '10%', height: '10%' }} />;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error.replace('mssql-70716-0.cloudclusters.net', 'Database server')}</div>;
  }
  
  const handleChange = (name, value) => {
    if (name === 'startDate') {
      setStartDate(value);
    } else if (name === 'endDate') {
      setEndDate(value);
    }
  };
  const datestyle={
    width:"120px",
    display: "block"
    
  };
  return (
    <div>
  <header>
    <h1>FIELD COLLECTION SHEET</h1>
    <p>Loan Officer's Name: <span>{groupname}</span></p>
    <p>Union Name: <span>{loanOfficer}</span></p>
    <p>Printed on: <span>{new Date().toLocaleDateString()}</span></p>
    <p>{compname}</p>
  </header>

  <main>
    <section>
      <h2>Summary</h2>
      <p>Future Savings: {futureSavings}</p>
      <p>Disburse Date: {disburDate}</p>
      <p>Weeks Paid: {weeksPaid}</p>
      {/* Add additional summary fields as needed */}
    </section>

    <section>
      <h2>Details</h2>
      <table>
        <thead>
          <tr>
            <th>Union Purse Savings</th>
            <th>Customer No.</th>
            <th>Loan ID</th>
            <th>Account Name</th>
            <th>Voluntary Savings</th>
            <th>Regular Savings</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{unionPurseSavings !== null ? `${custno} up` : custno}</td>
            <td>{loanid}</td>
            <td>{accountname?.toUpperCase()}</td>
            <td>{voluntarySavings}</td>
            <td>{regularSavings}</td>
          </tr>
          {/* Map additional rows as needed */}
        </tbody>
      </table>
    </section>
  </main>

  <footer>
    {/* Add footer content if applicable */}
  </footer>
</div>

  );
};

export default Report;
