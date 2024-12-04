import React, { useState } from 'react';
import axios from 'axios';

const LoanOverdue = ({state,setState}) => {
    const {localhost,companyname}=state;
    const [selectedDate, setSelectedDate] = useState(state.sesdate.slice(0,10));
    const [reportBranchCode, setReportBranchCode] = useState(state.branch.slice(0,3));
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchData = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${localhost}/overduereport`, {
                SelectedDate: selectedDate,
                ReportBranchcode: reportBranchCode,
            });
            setData(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const calculateTotals = (column) => {
        return data.reduce((total, row) => total + (parseFloat(row[column]) || 0), 0).toFixed(2);
    };
    const formatter= new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
    return (
        <div>
            <h1>Loan Overdue Report</h1>
            <div>
                <label>
                    Selected Date:
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </label>
                <label>
                    Report Branch Code:
                    <input
                        type="text"
                        value={reportBranchCode}
                        onChange={(e) => setReportBranchCode(e.target.value)}
                    />
                </label>
                <button onClick={fetchData}>Fetch Data</button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {data.length > 0 && (
                <table border="1" style={{ marginTop: '20px', width: '100%' }}>
                    <thead>
                        <tr>
                            <th>Customer No</th>
                            <th>Loan ID</th>
                            <th>Disbursed Principal</th>
                            <th>Outstanding Balance</th>
                            <th>Disbursed Date</th>
                            <th>Account Name</th>
                            <th>Overdue with Interest</th>
                            <th>Overdue Principal Only</th>
                            <th>Principal Repaid</th>
                            <th>Loan Product</th>
                            <th>Group ID</th>
                            <th>Last Pay Date</th>
                            <th>Days Due</th>
                            <th>CSO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                <td>{row.CustNo}</td>
                                <td>{row.LoanID}</td>
                                <td>{formatter.format(parseFloat(row.DisbPrin).toFixed(2))}</td>
                                <td>{formatter.format(parseFloat(row.outstandingbal).toFixed(2))}</td>
                                <td>{row.disburseddate.slice(0, 10)}</td>
                                <td>{row.accountname}</td>
                                <td>{formatter.format(parseFloat(row.OVAPLusInt).toFixed(2))}</td>
                                <td>{formatter.format(parseFloat(row.OVAprinOnly).toFixed(2))}</td>
                                <td>{formatter.format(parseFloat(row.PrinRepaid).toFixed(2))}</td>
                                <td>{row.loanproduct}</td>
                                <td>{row.Groupid}</td>
                                <td>{row.lastPayDate.slice(0, 10)}</td>
                                <td>{row.daysDue}</td>
                                <td>{row.CSO}</td>
                            </tr>
                        ))}
                        <tr style={{fontSize:'10px',fontWeight:'bold'}}>
                            <td colSpan="2"><strong>Totals:</strong></td>
                            <td>{formatter.format(calculateTotals('DisbPrin'))}</td>
                            <td>{formatter.format(calculateTotals('outstandingbal'))}</td>
                            <td colSpan="2"></td>
                            <td>{formatter.format(calculateTotals('OVAPLusInt'))}</td>
                            <td>{formatter.format(calculateTotals('OVAprinOnly'))}</td>
                            <td>{formatter.format(calculateTotals('PrinRepaid'))}</td>
                            <td colSpan="5"></td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default LoanOverdue;
