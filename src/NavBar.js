import {React,useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    FaChartBar, 
    FaRegChartBar, 
    FaUser, 
    FaFileAlt, 
    FaClipboardList, 
    FaSignOutAlt, 
    FaClipboardCheck, 
    FaProjectDiagram, 
    FaFileContract ,
    FaHome, 
    FaCogs, 
    FaTasks, 
    FaUsers, 
    FaMoneyBillWave, 
    FaChartPie, 
    FaHistory, 
    FaEnvelope, 
    FaInfoCircle, 
    FaLock 
} from 'react-icons/fa';import ChartComponent from './Chart/chart'
import PieChartComponent from './Chart/incomepiechart'


const NavBar = ({ setLoggedIn,state }) => {
    const navigate = useNavigate();
    const { branch, logindata, groups, biztype,userid,userrole,status } = state || {};
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isReportdownOpen, setIsReportdownOpen] = useState(false);
    const {localhost,companyname}= state || 'localhost:3005'
const [isDivVisible, setIsDivVisible] = useState(true);
//HIDE SESSION MGT AND WORKFLOW FOR NON-APPROVING OFFICERS
 const displayadminroles=userrole==='Administrator'||userrole==='Manager';
// const displayadminroles=false;

// Function to toggle the visibility
const toggleVisibility = () => {
    setIsDivVisible(!isDivVisible);
};

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

    return (
<div style={{ display: 'flex', backgroundColor: 'lemonchiffon', height: '100vh' }}>
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
                
                <h3>Navigation</h3>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    <li style={navItemStyle}><FaChartBar /> <Link to="/">Dashboard</Link></li>
                    <li style={navItemStyle} onClick={toggleReportdown}><FaFileAlt /> <Link to="/report">Report</Link></li>
                    <ul style={{ display: isReportdownOpen ? 'block' : 'none', paddingLeft: '20px' }}>
                        <li style={navItemStyle}><Link to="/report"><FaCogs/>Staff Perfirmance Report</Link></li>
                        <li style={navItemStyle}><Link to="/report2"><FaHistory/>Transaction report</Link></li>
                        <li style={navItemStyle}><Link to="/disbursement_rpt"><FaHistory/>Disbursement report</Link></li>
                        <li style={navItemStyle}><Link to="/fieldprintreport"><FaCogs/>FieldPrint</Link></li>                    </ul>
                    <li style={navItemStyle}><FaUser /> <Link to="/account">Account</Link></li>
                    <li style={navItemStyle}><FaClipboardList /> <Link to="/bulk">Bulk Posting</Link></li>
                    <li style={navItemStyle}><FaClipboardList /> <Link to="/group">Group Posting</Link></li>
                    <li style={navItemStyle}><FaUser /> <Link to="/client">Client</Link></li>
                    <li style={navItemStyle}><FaRegChartBar /> <Link to="/dispchart">Chart</Link></li>
                    <li style={navItemStyle} onClick={toggleDropdown}>
                        {displayadminroles && <span style={{ color: 'blue', textDecoration: 'underline' }}>< FaProjectDiagram/>Workflow</span>}
                        <ul style={{ display: isDropdownOpen ? 'block' : 'none', paddingLeft: '20px' }}>
                            <li style={navItemStyle}><Link to="/workflow/single">Single Transactions</Link></li>
                            <li style={navItemStyle}><Link to="/workflow/batch">Group/Batch/Mobile Trx</Link></li>
                            <li style={navItemStyle}><Link to="/workflow/disbursement">Pending Disbursement</Link></li>
                        </ul>
                    </li>
                    {displayadminroles && <li style={navItemStyle}><Link to="/admin/ManageSession"><FaFileContract/>Manage Session</Link></li>}
                </ul>
                <button onClick={handleLogout} style={{
                    marginTop: '20px',
                    backgroundColor: 'red',
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
                    <ChartComponent branch={branch.slice(0, 3)} localhost={localhost} /> 
                    <PieChartComponent branch={branch.slice(0, 3)} localhost={localhost} />
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
    backgroundColor: '#f5f5f5', // Change background on hover
};

export default NavBar;
