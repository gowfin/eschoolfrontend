import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import NavBar from './NavBar';
import Dashboard from './Dashboard';
import Client from './client';
import Account from './account';
import Report from './report';
import Report2 from './report2';
import FieldPrint from './fieldprintreport';
import WorkflowBatch from './workflow/batch';
import Chart from './Chart/dispchart';
import ManageSession from './admin/ManageSession';
import Single from './workflow/single';
import Bulk from './bulk';
import Group from './group';
import DisbursementDetail from './disbursement_rpt';
import TrialBalance from './trialbalance';
import Overdue from './overdue';
import BalanceReport from './balance_report';
import CashBook from './cashbook';


const App = () => {
  const [state, setState] = useState(() => {
    const savedState = localStorage.getItem('appState');
    return savedState ? JSON.parse(savedState) : {};
  });

  const [loggedIn, setLoggedIn] = useState(() => {
    const storedLoggedIn = localStorage.getItem('loggedIn');
    return storedLoggedIn === 'true';
  });

  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal state
  const [branches, setBranches] = useState([]); // State for branches
  const [modalIsOpen, setModalIsOpen] = useState(false); //set individual workflow to load automatically
  const [isNavbarShowing,setIsNavbarShowing]=useState(true);
  // Persist login state across page reloads
  useEffect(() => {
    localStorage.setItem('loggedIn', loggedIn.toString());
  }, [loggedIn]);

  // Persist state across page reloads
  useEffect(() => {
    console.log(state);
    localStorage.setItem('appState', JSON.stringify(state));
  }, [state]);

  
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        {loggedIn && isNavbarShowing&&<NavBar setLoggedIn={setLoggedIn} state={state} setIsNavbarShowing={setIsNavbarShowing} />}
        <div style={{ padding: '20px', flex: 1 }}>
          <Routes>
            {!loggedIn ?  
            
            (
              <Route 
                path="/" 
                element={
                  <Login 
                    setLoggedIn={setLoggedIn} 
                    state={state} 
                    setState={setState} 
                    isModalOpen={isModalOpen} 
                    setIsModalOpen={setIsModalOpen} 
                    branches={branches}
                    setBranches={setBranches} 
                  />
                } 
              />
            ) : (
              <>
                <Route path="/" element={<Dashboard state={state} setState={setState} />} />
                <Route path="/cashbook" element={<CashBook state={state} setState={setState} />} />
                <Route path="/report" element={<Report state={state} setState={setState} />} />
                <Route path="/report2" element={<Report2 state={state} setState={setState} />} />
                <Route path="/disbursement_rpt" element={< DisbursementDetail state={state} setState={setState} />} />
                <Route path="/balance_report" element={< BalanceReport state={state} setState={setState} />} />
                <Route path="/overdue" element={< Overdue state={state} setState={setState} />} />
                <Route path="/trialbalance" element={< TrialBalance state={state} setState={setState} />} />
                <Route path="/fieldprintreport" element={<FieldPrint state={state} setState={setState} />} />
                <Route path="/account" element={<Account state={state} setState={setState} />} />
                <Route path="/client" element={<Client state={state} setState={setState} />} />
                <Route path="/dispchart" element={<Chart state={state} setState={setState} />} />
                <Route path="/workflow/batch" element={<WorkflowBatch state={state} setState={setState} />} />
                <Route path="/admin/managesession" element={<ManageSession  state={state} setState={setState}/>} />
                <Route path="/bulk" element={<Bulk state={state}/>} />
                <Route path="/group" element={<Group state={state}/>} />
                <Route path="/workflow/single" element={<Single state={state} modalIsOpen={true} setModalIsOpen={setModalIsOpen}/>} />

              </>
            )}     
          </Routes>
          {loggedIn&& (
              <div
                style={{
                  position: "fixed",
                  top: "0",
                  left: "0",
                  width: "5%",
                  height: "20px",
                  borderRadius:'50%',
                  backgroundColor: "#333",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor:'pointer',
                  zIndex: 999}}>
                 <i
                  style={{
                    fontSize: "10px",
                    color: "#fff",
                  }}
                  onClick={()=>{setIsNavbarShowing(!isNavbarShowing)}}
                >{isNavbarShowing?'hide NavBar':'Show NavBar'}</i></div>)}
        </div>
      </div>
    </Router>
  );
};

export default App;

