import React, { useState,useEffect } from 'react';
import './account.css'; // Your CSS file for styling
import axios from 'axios';
import loadingGif from './loading.gif'; // Your loading gif file
import { useLocation } from 'react-router-dom';
import  './menu.css';
// import { localhost } from './env.js';


const AccountPage = ({ state, setState }) => {
  const {localhost}= state || 'localhost:3000';
  const [searching, setSearching] = useState(false);
  const [searchingName, setSearchingName] = useState(false);
  const [pixPreview, setPixPreview] = useState(null);
  const [signPreview, setSignPreview] = useState(null);
  const [clientData, setClientData] = useState({ custno: '',accountid:'', accountname: '', groupid: '' });
  const [accountData, setAccountData] = useState([]);
  const [accountBal, setAccountBal] = useState([]);
  const [accountHistory, setAccountHistory] = useState([]);
  const [accountDetail, setAccountDetail] = useState([]);
  const [accountName, setAccountName] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [isHistoryOpen,setIsHistoryOpen]=useState('');
  const [isDetailOpen,setIsDetailOpen]=useState(false)
  const {branch,userid}=state|| {};
  const [dep, setDep] = useState(true);
  const [balance, setBalance] = useState([]);
  const [menuPosition, setMenuPosition] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [adjusting,setAdjusting]=useState(false);
  const Branchcode=branch.slice(0,3);
  const [accountNameTyped, setAccountNameTyped] = useState('');
  const [results, setResults] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const location = useLocation();
///search for custno from client creation
useEffect(() => {
  // Function to parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const custnoFromQuery = queryParams.get('custno') || '';
  
  // Set custno if it exists in the query parameters
  if (custnoFromQuery) {
    setClientData({ ...clientData,
     custno: custnoFromQuery});
  }
}, [location]);

  const handleSearchName = async () => {
    setSearchingName(true);
      if (accountNameTyped.length>2) {
          try {
              const response = await axios.get(`${localhost}/api/search/${accountNameTyped}`);
              setResults(response.data);
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      } else {
          setResults([]);
      }
      setSearchingName(false);
  };

  const handleSelect = (account) => {
      setSelectedAccount(account);
      // alert(selectedAccount.CustNo);
      setResults([]); // Clear results after selection
      
  };
  const handleDeselect = (account) => {
    setSelectedAccount('');
    // alert(selectedAccount.CustNo);
    setResults([]); // Clear results after selection
    
};


  const handleChange = (e) => {
    setSelectedAccount(null); //allow editing of CustNo textinput
    const { name, value } = e.target;
    setClientData((prev) => ({ ...prev, [name]: value }));
    
  };
  const closeHistory = (e) => {
    setIsHistoryOpen(false);
    setIsDetailOpen(false)
  };
 //////10 DIGIT CUSTNO FORMAT
const getIDFormat=( num )=>{
  //0020000001
  return   String(num).padStart(7, '0');
   
}



  const handleBlur=(e)=>{

    if(clientData.custno.length<10){
      setClientData({...clientData,custno:Branchcode+getIDFormat(clientData.custno)});
    }
  }
  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage("");
    setPixPreview ("");
    setSignPreview ("");
    setSearching(true);
    setError(null); // Reset error state
    //check for incomplete custno and complete them
    if(clientData.custno.length<10){
      setClientData({...clientData,custno:Branchcode+getIDFormat(clientData.custno)});
    }
  
    try {
      const { custno } = clientData;
      
      const response = await axios.post(`${localhost}/get_accounts`, { custno });

      const data = response.data; // Extract data from response
      console.log(data);
      
      const accountDataArray = data.map(item => item);
      
      setAccountData(accountDataArray);
      

      setClientData({
        ...clientData,
        Accountname: data[0]?.accountname || '', // Assuming accountname comes from the first item
        groupid: data[0]?.groupid || '', // Assuming groupid comes from the first item
      });

      setMessage('Search successful');
    } catch (error) {
      setError(error.message); // Handle errors
    } finally {
      setSearching(false);
    }
  };

  const handleHistory = async (accountid) => {
    console.log(accountid);
    
    setIsHistoryOpen(true);
  try {
  
    const custno= clientData.custno;
    const response = await axios.post(`${localhost}/get_history`, { custno,accountid });

    const data = response.data; // Extract data from response
    let bal=0;
    // //calculate running history from amount in data
     const dataWithRunningBal=data.map((item)=>{
      console.log(bal);
      
      const isAmountNegative = item.tranid === '005' || item.tranid === 'R001' || item.tranid === 'R002' || item.tranid === '059' || item.tranid === '010' || item.tranid === 'R010';
      bal = isAmountNegative ? bal - item.amount : bal + item.amount;
      item.Runningbal=bal;
      return item;
     })
     setAccountHistory(dataWithRunningBal);
     console.log(dataWithRunningBal);
      
    
    setMessage('Search successful');
  } catch (error) {
    setError(error.message); // Handle errors
    setMessage(error.message); 
  } finally {
    setSearching(false);
  }
};

const handleDetail = async (accountid,balance) => {
  setIsDetailOpen(true);
  setBalance(balance);
  // console.log("Account ID:", accountid);
  // setIsDetailOpen(true); // Open modal initially

  try {
    const custno = clientData.custno; // Ensure clientData is defined
    const response = await axios.post(`${localhost}/get_account_detail`, { custno, accountid });

    const data = response.data;
    const accountDetailArray = data.map(item => item); // Extract data

    setAccountDetail(accountDetailArray);
    console.log("Account Details:", accountDetailArray); // Log details
    console.log(isDetailOpen);
    setMessage('Search successful');
  } catch (error) {
    setError(error.message);
    console.error("Error fetching account details:", error); // Log error
  }
};
const handleVerifyBal = async (custno, LoanID, AccountID,loanbal, savBal, balance, accname, userid) => {
  
   const balToAdjustTo=LoanID ? loanbal:savBal;
   const positivebal=LoanID ? -balance:balance;
//  console.log(balance,balToAdjustTo);
  if (balance !== balToAdjustTo) {
    setAdjusting(true);
    try {
      const baldiff=positivebal-balToAdjustTo;
      // alert(baldiff);
      // console.log(custno, LoanID, AccountID,loanbal, savBal, balance, accname, userid);
      const response = await axios.post(`${localhost}/insert_balancediff`, { custno,LoanID,AccountID,balToAdjustTo,balance,baldiff,accname,userid });
     
      alert('Balance adjusted successfully')
    } catch (error) {
      setError(error.message); // Handle errors
      setMessage(error.message);
    } finally {
      setSearching(false);
      setAdjusting(false);
    }
  }
};
  const handleImages = async (e) => {
    // e.preventDefault();
    setMessage("");
    setSearching(true);
    
    setPixPreview ("");
    setSignPreview ("");
    setError(null); // Reset error state

    try {
      const { custno } = clientData;
      const response = await axios.post(`${localhost}/get_client`, { custno });

      const data = response.data; // Extract data from response
      //  The image is returned in the "pix" field as base64
const base64Pix = response.data.pix;
const base64Sign = response.data.sign;
    
// Format the base64 string for an image source
const pixSource=`data:image/png;base64,${base64Pix}`;
const signSource=`data:image/png;base64,${base64Sign}`
//Set Image source to be displayed
setPixPreview (pixSource);
setSignPreview (signSource);


     
      setMessage('Search successful');
    } catch (error) {
      setError(error.message); // Handle errors
      setMessage(error.message);
    } finally {
      setSearching(false);
    }
  };
  const handleDoubleClick = (e, item,itemtype) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setShowMenu(true);
    item.slice()==='3' ||itemtype.includes('LN') ? setDep(false):setDep(true);
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
  };
    return (
    <div className="account-page">
   

      <form>
      <div className="search-div">
        
        <input
                type="text"
                className='custno-input'
                value={accountNameTyped}
                onChange={(e) => setAccountNameTyped(e.target.value)}
                onKeyUp={handleSearchName}
                placeholder="Search account name"
                style={{maxWidth: '30%'}}
                onClick={handleDeselect}
            />{searchingName ? <img src={loadingGif} alt="Loading..." style={{ width: '30px', height: '30px' }} /> : <p onClick={handleDeselect}>Type to Search</p>}

            
            <input type="text"   placeholder="Enter custno and click search" onChange={handleChange} onBlur={handleBlur} value={selectedAccount ? selectedAccount.CustNo:clientData.custno} className="custno-input" name="custno" autoComplete="custno"/>
            </div>
          <div className="top-div">
          <ul  className="dropdown-menu" onBlur={''}>
                {results.map((customer,index) => (
                    <li key={index} onClick={() => handleSelect(customer)}>
                        {customer.CustNo+'-'+customer.accountName}
                    </li>
                ))}
            </ul>
          <div className="input-group">
            <div className="image-box"  onClick={handleImages} > <img src={pixPreview} alt="Photo" style={{ width: '100%', height: '100%',borderRadius: '10%',objectFit: 'cover', }} /></div>
          
            <div className="image-box"  onClick={handleImages} > <img src={signPreview} alt="Signature" style={{ width: '100%', height: '100%',borderRadius: '10%',objectFit: 'cover', }} /></div>
            
           
        
               <div></div>
            {message && <p className="message" style={{ color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
            <button className="search-btn" disabled={searching} onClick={handleSearch}>
              {searching ? <img src={loadingGif} alt="Loading..." style={{ width: '20px', height: '20px' }} /> : '🔍 Search'}
            </button>
          </div>
          <div className="input-group">
            <label>
              A/C NAME:
              <input type="text"  readOnly placeholder="Account Name" onChange={handleChange} value={clientData.Accountname} className="account-name-input" name="Accountname" />
            </label>
            <label>
              Group:
              <input  type="text" readOnly placeholder="Group Name" onChange={handleChange} value={clientData.groupid} className="group-name-input" name="groupid" />
            </label>
          </div>
        </div>
      </form>
      <div className="bottom-div">
        <table className="account-table" >
          <thead>
            <tr>
              <th>Account ID</th>
              <th>Account Name</th>
              <th>Balance</th>
              <th>Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
  {accountData.length > 0 ? (
    accountData.map((account, index) => {
      const balance = account.runningbal;
      const isNegative = balance < 0;
      return (
        <tr key={index} onDoubleClick={(e) => handleDoubleClick(e, account.accountid,account.productid)} onContextMenu={(e) => handleDoubleClick(e, account.accountid,account.productid)}>
          <td>{account.accountid}</td>
          <td>{account.accountname}</td>
          <td style={{ fontWeight: 'bold', color: isNegative ? 'red' : 'green' }}>
          {isNegative ?`₦${Math.abs(balance).toLocaleString()}` : `₦${balance.toLocaleString()}`}
          </td>
          <td>{account.productid}</td>
          <td>{account.status}</td>
          <td><button className="footer-button" onClick={() =>handleDetail(account.accountid,account.runningbal)}>More Details</button><button className="action-button" onClick={() => handleHistory(account.accountid)}>History</button></td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="6">No account data available</td>
    </tr>
  )}
</tbody>

        </table>
        {showMenu && (
  <div className="menu" style={{ top: menuPosition.y, left: menuPosition.x }} onMouseLeave={handleCloseMenu}>
    {dep && <p onClick={handleCloseMenu}>Deposit</p>}
    {dep && <p onClick={handleCloseMenu}>Withdrawal</p>}
    {dep && <p onClick={handleCloseMenu}>Transfer</p>}
    {!dep && <p onClick={handleCloseMenu}>Repayment</p>}
    {!dep && <p onClick={handleCloseMenu}>View Loan Schedule</p>}
    {!dep && <p onClick={handleCloseMenu}>See Guarantor</p>}
    <button onClick={handleCloseMenu}>Close</button>
  </div>
)}
         {/* Modal for Transaction History */}
      {isHistoryOpen && (
        <div className="modal" width="100%">
          <div className="modal-content">
            <h1>Transaction History </h1>
          <table className='table-history'>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Value Date</th>
            <th>Account ID</th>
            <th>Statement Reference</th>
            <th>Transaction Number</th>
            <th>Amount</th>
            <th>Running Balance</th>
            <th>Posted By</th>
          </tr>
        </thead>
        <tbody>
          {accountHistory.map((item, index) =>{
           
             const tranid = item.tranid;
            const isRunBalNegative = balance < 0;
             const isAmountNegative = tranid ==='005' || tranid === 'R001' || tranid === 'R002' || tranid === '059' ||tranid === '010' ||tranid === 'R010'; //loan reversal need -(-amount) to make it positive
            // tempbal=isAmountNegative ? balance-item.amount:balance+ item.amount;
            
            return(
            
            <tr key={index}>
              <td>{item.tranid}</td>
              <td>{item.ValueDate}</td>
              <td>{item.AccountID}</td>
              <td>{item.Stmtref}</td>
              <td>{item.transactionNbr}</td>
              <td style={{ fontWeight: 'bold', color: isAmountNegative ? 'red' : 'green' }}>{isAmountNegative ? `₦${Number(item.amount).toLocaleString()}` : `₦${item.amount.toLocaleString()}`}</td>
              <td style={{ fontWeight: 'bold', color: isRunBalNegative ? 'red' : 'green' }}>{`₦${item.Runningbal.toLocaleString()}`}</td>
              <td>{item.CreatedBy}</td>
            </tr>
          )}) }
          
        </tbody>
      </table>
      
            <button onClick={closeHistory}>Close</button>
          </div>
        </div>
      )}
  
  {isDetailOpen && (
        <div className="modal" style={{ width: '100%' }}>
          <div className="modal-content">
            <h1>Account Details</h1>
            <table className='table-history'>
              
              <tbody>
                {accountDetail.length > 0 ? (
                  accountDetail.map((item, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td>Account Number:</td>
                        <td>{item.AccountID?item.AccountID:item.LoanID}</td>
                      </tr>
                      <tr>
                        <td>Account Name:</td>
                        <td>{item.AccountName}</td>
                      </tr>
                      <tr>
                        <td>BVN:</td>
                        <td>{item.BVN}</td>
                      </tr>
                      <tr>
                        <td>Cust No:</td>
                        <td>{item.CustNo? item.CustNo:item.Custno}</td>
                      </tr>
                      <tr>
                        <td>Product ID:</td>
                        <td>{item.ProductID?item.ProductID:item.LoanProduct}</td>
                      </tr>
                      <tr>
                        <td>Group ID:</td>
                        <td>{item.GroupID}</td>
                      </tr>
                      <tr>
                        <td>Cleared Bal:</td>
                        <td>{`₦${balance.toLocaleString()}`}</td>
                      </tr>
                      <tr>
                        <td>Uncleared Bal:</td>
                        <td>{item.RunningBal?`₦${item.RunningBal.toLocaleString()}`:`₦${item.OutstandingBal.toLocaleString()}`}</td>
                      </tr>
                      <tr>
                        <td>Account Status:</td>
                        <td>{item.Status}</td>
                      </tr>
                      <tr>
                        <td>{item.DateCreated?'Date Opened':'Date Disbursed'}:</td>
                        <td>{item.DateCreated? item.DateCreated.slice(0,10): item.DisbursedDate.slice(0,10)}</td>
                      </tr>
                      <button style={{width:'20%'}}onClick={() =>handleVerifyBal(item.CustNo,item.LoanID,item.AccountID,item.OutstandingBal,item.RunningBal,balance,item.AccountName,userid)}>{adjusting ? <img src={loadingGif} alt="Loading..." style={{ width: '20px', height: '20px' }} />:'Verify bal'}</button>
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">No account details available.</td>
                  </tr>
                )}
     
              
              
          
         
          
        </tbody>
      </table>

            <button onClick={closeHistory}>Close</button>
          </div>
        </div>
      )}

      </div>
      <div className="footer-div">
        <div className="footer-stats">
          <p>Last Transaction Date: {new Date().toLocaleDateString()}</p>
          <div><button className="footer-button">Display History</button></div>
          <div><button className="footer-button">Change Account Status</button></div>
        </div>
      </div>
    </div>
    
  );
};

export default AccountPage;
