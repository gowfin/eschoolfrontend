import React, { useState } from 'react';
import axios from 'axios';

const TrialBalance = ({ state, setState }) => {
    const { localhost, companyname } = state;
    const [selectedDate, setSelectedDate] = useState(state.sesdate.slice(0,10));
    const [reportBranchCode, setReportBranchCode] = useState(state.branch.slice(0,3));
    const [skipZeroBalances, setSkipZeroBalances] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchData = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${localhost}/trialbalance`, {
                SelectedDate: selectedDate,
                ReportBranchcode: reportBranchCode,
                SkipZeroBalances: skipZeroBalances,
            });
            setData(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const calculateTotal = (column) => {
        return data.reduce((sum, row) => sum + (parseFloat(row[column]) || 0), 0);
    };

    return (
        <div>
            <h1>{companyname} Trial Balance Report</h1>
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
                <label>
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                                 Skip Zero Balances:
                     <input
                     type="checkbox"
                     checked={skipZeroBalances}
                     onChange={(e) => setSkipZeroBalances(e.target.checked)}
                     style={{ marginLeft: '5px' }} // Adds minimal space between checkbox and text
                    />
                    </span>
                </label>
                <button onClick={fetchData}>Fetch Data</button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {data.length > 0 && (
                <table border="1" style={{ marginTop: '20px', width: '100%' }}>
                    <thead>
                        <tr>
                            <th>CoaNbr</th>
                            <th>CoaName</th>
                            <th>Opening</th>
                            <th>Credit</th>
                            <th>Debit</th>
                            <th>YTD</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                <td>{row.CoaNbr}</td>
                                <td>{row.CoaName}</td>
                                <td>{formatter.format(row.Openning)}</td>
                                <td>{formatter.format(row.Credit)}</td>
                                <td>{formatter.format(row.Debit)}</td>
                                <td>{formatter.format(row.Openning + row.Debit - row.Credit)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr style={{fontWeight:'bold'}}>
                            <td colSpan="2"><strong>Totals:</strong></td>
                            <td>{formatter.format(calculateTotal('Openning'))}</td>
                            <td>{formatter.format(calculateTotal('Credit'))}</td>
                            <td>{formatter.format(calculateTotal('Debit'))}</td>
                            <td>{formatter.format(calculateTotal('Openning') + calculateTotal('Debit') - calculateTotal('Credit'))}</td>
                        </tr>
                    </tfoot>
                </table>
            )}
        </div>
    );
};

export default TrialBalance;
