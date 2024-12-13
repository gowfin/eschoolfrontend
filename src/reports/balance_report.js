import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BalanceTable = ({state,setState}) => {
    const {localhost,companyname}=state;
    const [balances, setBalances] = useState({
        depositBalance: 0,
        loanBalance: 0,
        loanBalanceWithInterest: 0,
    });
    const formatter= new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
    const [loading, setLoading] = useState(true);

    useEffect(() => {
       
        // Fetch balances from the backend
        const fetchBalances = async () => {
            try {
                const response = await axios.get(`${localhost}/balances_report`);
                setBalances(response.data);
            } catch (error) {
                console.error('Error fetching balances:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBalances();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>{companyname.charAt(0).toUpperCase()+companyname.slice(1).toLowerCase()} Balances</h2>
            <table border="1" style={{ width: '100%', textAlign: 'left', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Balance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Deposit Balance</td>
                        <td>{formatter.format(balances.depositBalance.toFixed(2))}</td>
                    </tr>
                    <tr>
                        <td>Loan Balance</td>
                        <td>{formatter.format(balances.loanBalance.toFixed(2))}</td>
                    </tr>
                    <tr>
                        <td>Loan Balance with Interest</td>
                        <td>{formatter.format(balances.loanBalanceWithInterest.toFixed(2))}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default BalanceTable;
