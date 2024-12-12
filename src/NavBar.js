import {React,useState,useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ExpenseModal from './ExpenseModal';
import IncomeModal from './incomeModal';
import BankModal from './bankModal';
import AssetModal from './assetModal';
import { 
    FaChartBar, 
    FaExchangeAlt,
    FaUserTie,
    FaRegChartBar, 
    FaUser, 
    FaFileAlt, 
    FaClipboardList, 
    FaSignOutAlt, 
    FaProjectDiagram, 
    FaFileContract ,
    FaCogs, 
    FaHistory,
    FaBalanceScale,
    FaExclamationCircle,
    FaMoneyCheckAlt,
    FaPiggyBank,
    FaHandHoldingUsd,
    FaFileInvoiceDollar,
    FaBook,
    FaUserFriends,
    FaUsers,
    FaUserPlus,
    FaMoneyBillAlt 
} from 'react-icons/fa';
import ChartComponent from './Chart/chart'
import PieChartComponent from './Chart/incomepiechart'
import GLStatement from './GLStatementModal';


const NavBar = ({ setLoggedIn,state,setIsNavbarShowing }) => {
    const navigate = useNavigate();
    const { branch, logindata, groups, biztype,userid,userrole,status,sesdate } = state || {};
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isReportdownOpen, setIsReportdownOpen] = useState(false);
    const {localhost,companyname}= state || 'localhost:3005'
    const [isDivVisible, setIsDivVisible] = useState(true);
    const [isFABOpen, setIsFABOpen] = useState(false);
    const [isExOpen,setIsExOpen]=useState(false);
    const [isIncOpen,setIsIncOpen]=useState(false);
    const [isBnkOpen,setIsBnkOpen]=useState(false);
    const [isAstOpen,setIsAstOpen]=useState(false);
    const [isGLOpen,setIsGLOpen]=useState(false);
    const [incomeList,setIncomeList]=useState([]);
    const [expenseList,setExpenseList]=useState([]);
    const [bankList,setBankList]=useState([]);
    const [assetList,setAssetList]=useState([]);
    const [glstatement,setGlstatement]=useState(false)
     // State to manage the hover effect

const [hoveredItem, setHoveredItem] = useState(null); 
    
//HIDE SESSION MGT AND WORKFLOW FOR NON-APPROVING OFFICERS
    const displayadminroles=userrole==='Administrator'||userrole==='Manager';
// const displayadminroles=false;
/////////////////DRAGGING FOR HANGING BUTTON/////////////
const [position, setPosition] = useState({ x: 170, y: 90 }); // Initial position
const [dragging, setDragging] = useState(false);
const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
const handleDragStart = (e) => {
    setDragging(true);
    // Determine whether the event is touch or mouse
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setStartDrag({
      x: clientX - position.x,
      y: clientY - position.y,
    });
  };

  const handleDrag = (e) => {
    if (!dragging) return;
    // Determine whether the event is touch or mouse
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    setPosition({
      x: clientX - startDrag.x,
      y: clientY - startDrag.y,
    });
  };

  const handleDragEnd = () => {
    setDragging(false);
  };
//////////////////////END OF DRAGGING CONST AND NETHOD
// Function to toggle the visibility
const toggleVisibility = () => {
    setIsDivVisible(!isDivVisible);
};
useEffect(() => { // This will clear all the state and logout the user when the user attempts a new login
  const params = new URLSearchParams(window.location.search);
  const compname = params.get("p");
  if(compname){
  setLoggedIn(false);
  localStorage.removeItem('appState'); // Clear saved app state
  localStorage.setItem('loggedIn', 'false'); // Update login state
  navigate(`/?p=${compname}`); // Redirect to the login page
  }
},[])

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  const toggleReportdown = () => {
    setIsReportdownOpen(!isReportdownOpen);
  };
    const handleLogout = () => {

        setLoggedIn(false);
        localStorage.removeItem('appState'); // Clear saved app state
        localStorage.setItem('loggedIn', 'false'); // Update login state
        navigate(`/?p=${companyname}`); // Redirect to the login page
    };
    const handleIncome = async() => {
      handleExModalClose();
      setIsIncOpen(true);
     
      // alert(branch);
      if(incomeList.length===0 || glstatement){
        const response = await axios.post(`${localhost}/getglincome`,{branch,glstatement:false})
        setIncomeList(response.data);
        response.data.length>0? setGlstatement(false):setGlstatement(true);
      }
      
  };
  const handleExpense = async() => {
    handleExModalClose();
    setIsExOpen(true);//hide income
   
     if(expenseList.length===0){
      const response = await axios.post(`${localhost}/getglexpense`,{branch})
      setExpenseList(response.data);
    
     }
    
};
const handleBank = async() => {
  handleExModalClose();
  setIsBnkOpen(true);
 
 
  if(bankList.length===0){
    const response = await axios.post(`${localhost}/getglbank`,{branch})
    setBankList(response.data);
   
  }
  
};
const handleAsset = async() => {
  handleExModalClose();
  setIsAstOpen(true);

  
  if(assetList.length===0){
    const response = await axios.post(`${localhost}/getglasset`,{branch})
    setAssetList(response.data);
    
  }
  
};
const handleGLStatement = async() => {
  handleExModalClose();
  setIsGLOpen(true);

  
  if(incomeList.length===0 || !glstatement){
    const response = await axios.post(`${localhost}/getglincome`,{branch,glstatement:true})
    setIncomeList(response.data);
    response.data.length>0? setGlstatement(true):setGlstatement(false);
    
  }
  
};
const handleExModalClose = () => {
 
  setIsExOpen(false); 
  setIsIncOpen(false);
  setIsBnkOpen(false); 
  setIsAstOpen(false); 
  setIsGLOpen(false); 
};

    return (
<div  style={{ display: 'flex', backgroundColor: 'lemonchiffon', height: '100%' }}>
            <div style={{
                width: '200px', 
                padding: '20px', 
                backgroundColor: '#F0FFF0', 
                border: '1px solid #ccc', 
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}>
                <button style={{
                    backgroundColor: 'gold',
                    maxWidth: '100%',
                    cursor: 'pointer',
                    border: 'none',
                    padding: '5px',
                    borderRadius: '30px',
                    transition: 'background-color 0.3s',
                }} 
                onClick={toggleVisibility}>
                    {isDivVisible ? 'Hide chart' : 'Show chart'} 
                </button>
      {expenseList.length!==0 &&isExOpen &&(<ExpenseModal
        isOpen={isExOpen}
        onClose={handleExModalClose}
        expenseList={expenseList}
        userid={userid}
        onSelectExpense={expenseList}
        localhost={localhost}
      />)}
      {incomeList.length!==0 && isIncOpen && <IncomeModal
        isOpen={isIncOpen}
        onClose={handleExModalClose}
        incomeList={incomeList}
        userid={userid}
        onSelectIncome={incomeList}
        localhost={localhost}
      />}

        {bankList.length!==0 && isBnkOpen && <BankModal
        isOpen={isBnkOpen}
        onClose={handleExModalClose}
        bankList={bankList}
        userid={userid}
        onSelectBank={bankList}
        localhost={localhost}
      />} 
      {assetList.length!==0 && isAstOpen && <AssetModal
        isOpen={isAstOpen}
        onClose={handleExModalClose}
        assetList={assetList}
        userid={userid}
        onSelectAsset={assetList}
        localhost={localhost}
      />}  
      {incomeList.length!==0 && isGLOpen && <GLStatement
        isOpen={isGLOpen}
        onClose={handleExModalClose}
        incomeList={incomeList}
        userid={userid}
        onSelectAsset={incomeList}
        localhost={localhost}
        sesdate={sesdate}
      />} 
                 <div style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        width: "80px",
        height: "80px",
        backgroundColor: "#DAA520",
        borderRadius: "50%", // Makes it fully rounded
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000, // Ensure it stays above other elements
      }} 
      onMouseDown={handleDragStart}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd} // Stop dragging if the mouse leaves the button
      onTouchStart={handleDragStart} // Support for touch devices
      onTouchMove={handleDrag} // Support for touch devices
      onTouchEnd={handleDragEnd} // Support for touch devices
      > 
                     <button style={{
          backgroundColor: "#DAA520",
          borderRadius: "50%",
          width: "100%",
          height: "100%",
          border: "none",
          outline: "none",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
          cursor: "pointer",
        }} onClick={() =>{setIsFABOpen(!isFABOpen);setIsExOpen(false);setIsIncOpen(false);}}>
                     <i className="fas fa-plus"></i> GL Posting
                </button>
             
                
                {isFABOpen && (
                <div style={{ 
                  position: 'absolute', 
                  bottom: '50px', 
                  left: '50%', 
                  transform: 'translateX(30%)', 
                  display: 'flex', 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  zIndex: 1000 
                }}
              > <button hidden={isIncOpen} style={{borderRadius:'50%'}}onClick={handleIncome}>{isIncOpen===false?'Income':"Running..."}</button>
                <button style={{borderRadius:'50%',backgroundColor:'#FF6666'}} onClick={handleExpense}>{isExOpen===false?'Expense':"Running..."}</button>
                <button style={{borderRadius:'50%',backgroundColor:'#AF6666'}}onClick={handleBank}>{isBnkOpen===false?'Bank':"Running..."}</button>
                <button style={{borderRadius:'50%',backgroundColor:'#BB6666'}}onClick={handleAsset}>{isAstOpen===false?'Asset':"Running..."}</button>
                <button style={{borderRadius:'50%',backgroundColor:'#CD222D'}}onClick={handleGLStatement}>{isGLOpen===false?'GL Statement':"Running..."}</button>
              
                </div>
                   )}
                </div>            
                <h3>Navigation</h3>
                <ul style={{ listStyleType: 'none', padding: 0 }} >
                    <li style={{...navItemStyle, ...( hoveredItem === "Dashboard" ? navItemHoverStyle : {})}}  onMouseEnter={() => setHoveredItem('Dashboard')}  onMouseLeave={() => setHoveredItem(null)}
               ><FaChartBar /> <Link to="/">Dashboard</Link></li>
                    <li style={{...navItemStyle, ...( hoveredItem === "report" ? navItemHoverStyle : {})}}  onMouseEnter={() => setHoveredItem('report')}  onMouseLeave={() => setHoveredItem(null)} onClick={toggleReportdown}><FaFileAlt /> <Link to="/report">Report</Link></li>
                    <ul style={{ display: isReportdownOpen ? 'block' : 'none', paddingLeft: '20px' }}>
                    <li style={{...navItemStyle, ...( hoveredItem === "cashbook" ? navItemHoverStyle : {})}}  onMouseEnter={() => setHoveredItem('cashbook')}  onMouseLeave={() => setHoveredItem(null)}><Link to="/cashbook"><FaBook color='#4CAF50'/> Daily Cash Book Analysis</Link></li>
                        <li style={{...navItemStyle, ...( hoveredItem === "report1" ? navItemHoverStyle : {})}}  onMouseEnter={() => setHoveredItem('report1')}  onMouseLeave={() => setHoveredItem(null)}><Link to="/report"><FaUserTie color='blue' />Staff Perfirmance Report</Link></li>
                        <li style={{...navItemStyle, ...( hoveredItem === "report2" ? navItemHoverStyle : {})}}  onMouseEnter={() => setHoveredItem('report2')}  onMouseLeave={() => setHoveredItem(null)}><Link to="/report2"><FaExchangeAlt color='green'/>Transaction report</Link></li>
                        <li style={{...navItemStyle, ...( hoveredItem === "disbursement_rpt" ? navItemHoverStyle : {})}}  onMouseEnter={() => setHoveredItem('disbursement_rpt')}  onMouseLeave={() => setHoveredItem(null)}><Link to="/disbursement_rpt"><FaHandHoldingUsd color='brown'/>Disbursement report</Link></li>
                        <li style={{...navItemStyle, ...( hoveredItem === "fieldprintreport" ? navItemHoverStyle : {})}}  onMouseEnter={() => setHoveredItem('fieldprintreport')}  onMouseLeave={() => setHoveredItem(null)}><Link to="/fieldprintreport"><FaFileInvoiceDollar color='gray'/>FieldPrint</Link></li>  
                        <li style={{...navItemStyle, ...( hoveredItem === "trialbalance" ? navItemHoverStyle : {})}}  onMouseEnter={() => setHoveredItem('trialbalance')}  onMouseLeave={() => setHoveredItem(null)}><Link to="/trialbalance"><FaBalanceScale color='orange'/>TrialBalance</Link></li> 
                        <li style={{...navItemStyle, ...( hoveredItem === "balance_report" ? navItemHoverStyle : {})}}  onMouseEnter={() => setHoveredItem('balance_report')}  onMouseLeave={() => setHoveredItem(null)}><Link to="/balance_report"><FaClipboardList/>Balance report</Link></li> 
                        <li style={{...navItemStyle, ...( hoveredItem === "overdue" ? navItemHoverStyle : {})}}  onMouseEnter={() => setHoveredItem('overdue')}  onMouseLeave={() => setHoveredItem(null)}><Link to="/overdue"><FaExclamationCircle color='red'/>Overdue</Link></li>                   </ul>
                        <li style={{...navItemStyle, ...( hoveredItem === "incomeorexpense" ? navItemHoverStyle : {})}}  onMouseEnter={() => setHoveredItem('incomeorexpense')}  onMouseLeave={() => setHoveredItem(null)}><Link to="/reportcontrol"><FaMoneyBillAlt color='orange'/>More Report...</Link></li> 
                    <li style={{...navItemStyle, ...( hoveredItem === "account" ? navItemHoverStyle : {})}}  onMouseEnter={() => setHoveredItem('account')}  onMouseLeave={() => setHoveredItem(null)}><FaMoneyCheckAlt color='green'/> <Link to="/account">Account</Link></li>
                    <li style={{...navItemStyle, ...( hoveredItem === "bulk" ? navItemHoverStyle : {})}}  onMouseEnter={() => setHoveredItem('bulk')}  onMouseLeave={() => setHoveredItem(null)}><FaClipboardList /> <Link to="/bulk">Bulk Posting</Link></li>
                    <li style={{...navItemStyle, ...( hoveredItem === "group" ? navItemHoverStyle : {})}}  onMouseEnter={() => setHoveredItem('group')}  onMouseLeave={() => setHoveredItem(null)}><FaUsers color="blue"/> <Link to="/group">Group Posting</Link></li>
                    <li style={{...navItemStyle, ...( hoveredItem === "groupmgt" ? navItemHoverStyle : {})}}  onMouseEnter={() => setHoveredItem('groupmgt')}  onMouseLeave={() => setHoveredItem(null)}><FaUserFriends  color="green"/> <Link to="/groupmgt">Group Management</Link></li>
                    <li style={{...navItemStyle, ...( hoveredItem === "client" ? navItemHoverStyle : {})}}  onMouseEnter={() => setHoveredItem('client')}  onMouseLeave={() => setHoveredItem(null)}><FaUserPlus /> <Link to="/client">Client</Link></li>
                    <li style={{...navItemStyle, ...( hoveredItem === "GLStatement" ? navItemHoverStyle : {})}}  onMouseEnter={() => setHoveredItem('GLStatement')}  onMouseLeave={() => setHoveredItem(null)}><FaRegChartBar /> <Link to="/GLStatement">GL Statement</Link></li>
                    <li style={{...navItemStyle, ...( hoveredItem === "dispchart" ? navItemHoverStyle : {})}}  onMouseEnter={() => setHoveredItem('dispchart')}  onMouseLeave={() => setHoveredItem(null)}><FaRegChartBar /> <Link to="/dispchart">Chart</Link></li>
                    <li style={{...navItemStyle, ...( hoveredItem === "workflow" ? navItemHoverStyle : {})}}  onMouseEnter={() => setHoveredItem('workflow')}  onMouseLeave={() => setHoveredItem(null)} onClick={toggleDropdown}>
                        {displayadminroles && <span style={{ color: 'blue', textDecoration: 'underline' }}>< FaProjectDiagram/>Workflow</span>}
                        <ul style={{ display: isDropdownOpen ? 'block' : 'none', paddingLeft: '20px' }}>
                            <li style={{...navItemStyle, ...( hoveredItem === "single" ? navItemHoverStyle : {})}}  onMouseEnter={() => setHoveredItem('single')}  onMouseLeave={() => setHoveredItem(null)}><Link to="/workflow/single">Single Transactions</Link></li>
                            <li style={{...navItemStyle, ...( hoveredItem === "batch" ? navItemHoverStyle : {})}}  onMouseEnter={() => setHoveredItem('batch')}  onMouseLeave={() => setHoveredItem(null)}><Link to="/workflow/batch">Group/Batch/Mobile Trx</Link></li>
                            <li style={{...navItemStyle, ...( hoveredItem === "disbursed" ? navItemHoverStyle : {})}}  onMouseEnter={() => setHoveredItem('disbursed')}  onMouseLeave={() => setHoveredItem(null)}><Link to="/workflow/disbursement">Pending Disbursement</Link></li>
                        </ul>
                    </li>
                    {displayadminroles && <li style={{...navItemStyle, ...( hoveredItem === "session" ? navItemHoverStyle : {})}}  onMouseEnter={() => setHoveredItem('session')}  onMouseLeave={() => setHoveredItem(null)}><Link to="/admin/ManageSession"><FaFileContract/>Manage Session</Link></li>}
                </ul>
                <button onClick={handleLogout} style={{
                    marginTop: '20px',
                    backgroundColor: '#FF6666',
                    color: 'white',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                }}>
                    <FaSignOutAlt /> Logout 
                </button>
            </div>

            {isDivVisible && (
                <div style={{ flex: 1, padding: '20px' }}>
                    <ChartComponent branch={branch&&branch.slice(0, 3)} localhost={localhost} /> 
                    <PieChartComponent branch={branch&&branch.slice(0, 3)} localhost={localhost} />
                </div>
            )}
        </div>

    );
};

// Styles for navigation items
const navItemStyle = {
    padding: '10px',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
};

// Applying hover effect with CSS
const navItemHoverStyle = {
    backgroundColor: '#AE45f5', // Change background on hover
};

export default NavBar;
