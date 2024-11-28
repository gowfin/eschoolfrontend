


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import loadingGif from './loading.gif'; // Your loading gif file
import './bulk.css';
// import { localhost } from './env.js';

const Bulk = ({state}) => {
    const {localhost}= state ;
    const [code, setCode] = useState('');
    const [loans, setLoans] = useState([]);
    const [deposits, setDeposits] = useState([]); // State for deposits
    const [searching, setSearching] = useState(false);
    const [posting, setPosting] = useState(false);
    const [message, setMessage] = useState('');
    const [repayAmounts, setRepayAmounts] = useState({});
    const [depositAmounts, setDepositAmounts] = useState({});
    const [selectedRow, setSelectedRow] = useState(null);
    const {products,userid} =state||{};
    

    useEffect(() => {
        const storedCode = localStorage.getItem('groupCode');
        // console.log('the product:',products);
   
        if (storedCode) {
            setCode(storedCode);
        }
    }, []);
//Handle table select by clicking
const handleRowClick = (id) => {
    setSelectedRow(id); // Set the selected row ID
};
    const fetchLoans = async () => {
        try {
            setSearching(true);
            setMessage('');
            const response = await axios.post(`${localhost}/getfieldprintpostinggroup`, { code });
           const data = response.data;
         
            // Combine products and data when they are both available
    const combinedloan = data.map(loan=> {
        const matchingProduct = products.find(product =>
            loan.LoanProduct && product.id && 
            loan.LoanProduct.trim() === product.id.trim(),
           
        );
  
        return {
          ...loan,
          outstandingbal: loan.OutstandingBal,
          custno: loan.CustNo,
          name:loan.AccountName,
          code: matchingProduct ? matchingProduct.code : null
        };
      }).filter(item => item.code !== null); // Filter out items without a code
     setLoans(combinedloan);

     const combineddeposit = data.map(loan=> {
        const matchingProduct = products.find(product =>
            loan.ProductID.slice(0,3).trim()+'SAVGS' === product.id.trim(),
          
        );
  
        return {
          ...loan,
          code: matchingProduct ? matchingProduct.code : null
        };
      }).filter(item => item.code !== null); // Filter out items without a code
    
     setDeposits(combineddeposit);
            // setLoans(combined.filter(item => item.code !== null));
            console.log('loan:',loans);
            console.log('deposit',deposits);
            localStorage.setItem('groupCode', code);
        } catch (error) {
            console.error('Error fetching loans:', error);
            setMessage(error.message);
        }
        setSearching(false);
    };

    

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
           
                fetchLoans();
             
        }
    };

   
    const handleRepayAmountChange = (loanID, value) => {
                setRepayAmounts((prev) => ({ ...prev, [loanID]: value }));
            };
const handleDepositAmountChange = (AccountID, value) => {
                setDepositAmounts((prev) => ({ ...prev, [AccountID]: value }));
            };
            const sumValues = (data) => {
                return Object.values(data).reduce((total, value) => {
                    // Remove commas and parse to float

                    const numericValue =value? parseFloat(value.replace(/,/g, '')): 0;
            
                    // Check if numericValue is a valid number
                    if (!isNaN(numericValue)) {
                        return total + numericValue; // Add to total if valid number
                    } else {
                        return total; // Return total unchanged if not a valid number
                    }
                }, 0);
            };
            const handlePosting=async()=>{
            setPosting(true);
            setMessage('');
            // Merging for deposit
        const depositToPost = deposits.reduce((acc, item) => {
         const accountValue = depositAmounts[item.AccountID];
           if (accountValue && accountValue !== "0" && accountValue.trim() !== "") {
               acc.push({
                 ...item,
                 accountValue // Add the corresponding value from user entry
               });
         }
          return acc;
         }, []);
            // Merging for repayment
            //First remove duplicate loanID

            const repayToPost = loans.reduce((acc, item) => {
            const accountValue = repayAmounts[item.loanID];
            const loanExists = acc.some(existingItem => existingItem.loanID === item.loanID);

            if (accountValue && accountValue !== "0" && accountValue.trim() !== "" && !loanExists) {
             acc.push({
            ...item,
            accountValue // Add the corresponding value
            });
                }

                return acc;
            }, []);
            console.log("Deposit to Post:",depositToPost);
            console.log("---------------------------------");
            console.log("Repayment Amount:",repayToPost);
            setMessage('');
                // Replace this with your actual API call to fetch deposits
                try {
                    setSearching(true);
                    // setMessage('');
                    const response = await axios.post(`${localhost}/postbulkdepositsrepayments`, { depositToPost,repayToPost,code,userid }); 
                    const result = response.data;
                     console.log(result);
                   setMessage('Deposit and loans posted successfully');
                } catch (error) {
                    console.error('Error fetching deposits:', error);
                    setMessage(error.message);
                    
                }
               
           
            setPosting(false);
            setSearching(false);

            // reset depositAmounts
            setDepositAmounts((prev) => {
                const newAmounts = { ...prev };
                Object.keys(newAmounts).forEach(AccountID => {
                    newAmounts[AccountID] = 0; // Set each value to 0
                });
                return newAmounts;
            });
            // reset RepayAmounts 
                setRepayAmounts((prev) => {
                    const newAmounts = { ...prev };
                    Object.keys(newAmounts).forEach(loanID => {
                        newAmounts[loanID] = 0; // Set each value to 0
                    });
                    return newAmounts;
                });
          
            }
    return (
        <div>
            {message && <p className="msg" style={{ color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
            {searching ? <div><img src={loadingGif} alt="Loading..." style={{ width: '7%', height: '7%' }} />Searching</div> : ''}

            <h1>Group Transaction Management</h1>


            <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter Group Code"
                autoComplete="on"
            />

             
                <div>
                    <button onClick={fetchLoans}>Find Group Loans</button>
                    <table>
                        <thead>
                            <tr>
                                <th>ClientID</th>
                                <th>AccountID</th>
                                <th>ClientName</th>
                                <th>Product</th>
                                <th>DepBalance</th>
                                <th>DepositAmount</th>
                                <th>LoanID</th>
                                <th>LoanProduct</th>
                                <th>LoanBalance</th>
                                <th>instalment</th>
                                <th>Repay Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loans.map((loan, index) => {
                                // Check the previous loan's LoanID
                            const prevLoanID = index > 0 ? loans[index - 1].loanID : null;
                            const displayLoanID = loan.loanID === prevLoanID ? '' :  loan.loanID;
                            const displayOutstandingBal = loan.loanID === prevLoanID ? '':loan.OutstandingBal ;
                            const displayLoanProduct = loan.loanID === prevLoanID ?  '':loan.LoanProduct ;
                            const displayinstalment = loan.loanID === prevLoanID ? '':loan.instalment ; 
                            const displayamount = loan.loanID === prevLoanID ? true : false; 
                            // const prevLoanID = index > 0 ? loans[index - 1].loanID : null;
                            // const displayLoanID =  loan.loanID ;
                            // const displayOutstandingBal = loan.OutstandingBal ;
                            // const displayLoanProduct = loan.loanID ;
                            // const displayinstalment = loan.loanID ; 
                            // const displayamount =  false; 
                            
                                 return(
                                <tr key={index} onClick={() => handleRowClick(index)}
                                onFocus={() => handleRowClick(index)}
                                style={{
                                   
                                    backgroundColor: selectedRow === index ? 'rgba(144, 238, 144, 0.5)' : 'transparent', // Light transparent green
                                }}>
                                    <td>{loan.CustNo}</td>
                                    <td>{loan.AccountID}</td>
                                    <td>{loan.AccountName}</td>
                                    <td>{loan.ProductID}</td>
                                    <td>{loan.RunningBal}</td>
                                    <td><input
                                            type="text"
                                            className="deposit-input"
                                            value={depositAmounts[loan.AccountID] || ''}
                                            onFocus={(e) => e.target.value = deposits[loan.AccountID] || ''}
                                            onBlur={(e) => {
                                                
                                                const value = parseFloat(e.target.value.replace(/,/g, ''));
                                                e.target.value = isNaN(value) ? '' : value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                                handleDepositAmountChange(loan.AccountID, e.target.value);
                                            }}
                                            onChange={(e) => {
                                                
                                                const inputValue = e.target.value.replace(/,/g, '');
                                                handleDepositAmountChange(loan.AccountID, inputValue);
                                            }}
                                            placeholder="Enter amount"
                                        /></td>
                                     <td>{displayLoanID}</td>
                                     <td>{displayLoanProduct}</td>
                                     <td>{displayOutstandingBal}</td>
                                     <td>{displayinstalment}</td>
                                     
                                    
                                    <td>
                                        <input
                                            type="text"
                                            className="repay-input"
                                            hidden={displayamount}
                                            value={repayAmounts[loan.loanID] || ''}
                                            onFocus={(e) => e.target.value = repayAmounts[loan.loanID] || ''}
                                            onBlur={(e) => {
                                                const value = parseFloat(e.target.value.replace(/,/g, ''));
                                                e.target.value = isNaN(value) ? '' : value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                                handleRepayAmountChange(loan.loanID, e.target.value);
                                            }}
                                            onChange={(e) => {
                                               
                                                const inputValue = e.target.value.replace(/,/g, '');
                                                handleRepayAmountChange(loan.loanID, inputValue);
                                            }}
                                            placeholder="Enter amount"
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
                 
            <div style={styles.container}>
            <label style={styles.label}>Analysis</label>
            <h2 style={styles.heading}>Total Deposit: {sumValues(depositAmounts).toFixed(2)}</h2>
            <h2 style={styles.heading1}>Total Repayment: {sumValues(repayAmounts).toFixed(2)}</h2>
            <h2 >Total Collection: {parseFloat(sumValues(depositAmounts).toFixed(2))+parseFloat(sumValues(repayAmounts).toFixed(2))}<button onClick={handlePosting}>{posting ? <div><img src={loadingGif} alt="Loading..." style={{ width: '1em', height: '1em' }} />Searching</div> : 'Submit to Workflow'}
            </button></h2> 
        </div>
        </div>
    );

    
};
const styles = {
    container: {
        fontSize: '0.7em', // Adjusted font size for better readability
        border: '2% double gray', // Double border
        padding: '2px', // Padding inside the box
        borderRadius: '12px', // Rounded corners
        backgroundColor: '#f9f9f9', // Light background color
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
        margin: '20px auto', // Centered with margin
        maxWidth: 'auto', // Max width for the container
    },
    label: {
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '10px',
    },
    heading: {
        margin: '5px 0',
        color: '#90EE90', // Dark color for text
       
    },
    heading1: {
        margin: '5px 0',
        color: '#FA8072', 
        
    }
};
export default Bulk;
