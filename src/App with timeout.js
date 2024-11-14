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

const INACTIVITY_TIMEOUT = 120 * 60 * 1000; // 15 minutes in milliseconds

// Helper function to set item with expiration
const setItemWithExpiration = (key, value, expirationInMinutes) => {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + expirationInMinutes * 60 * 1000,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

// Helper function to get item with expiration check
const getItemWithExpiration = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
};

const App = () => {
  const [state, setState] = useState(() => {
    const savedState = getItemWithExpiration('appState');
    return savedState ? savedState : {};
  });

  const [loggedIn, setLoggedIn] = useState(() => {
    return getItemWithExpiration('loggedIn') === 'true';
  });

  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal state
  const [branches, setBranches] = useState([]); // State for branches
  const [modalIsOpen, setModalIsOpen] = useState(false); // Set individual workflow to load automatically
  
  // Logout function for inactivity
  const handleLogout = () => {
    const {companyname}=state.companyname;
    console.log(companyname);
    setLoggedIn(false);
    setState({});
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('appState');
    window.location.href = `/?p=${companyname}`; // Redirect to login or home page
  };

  // Set up inactivity timer
  useEffect(() => {
    let inactivityTimer;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        handleLogout(); // Log the user out after 15 minutes of inactivity
      }, INACTIVITY_TIMEOUT);
    };

    // Listen for any user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('mousedown', resetTimer);
    window.addEventListener('touchstart', resetTimer);

    // Initialize the timer on component mount
    resetTimer();

    // Clean up event listeners on component unmount
    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('mousedown', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
    };
  }, []);

  // Persist `loggedIn` state with expiration
  useEffect(() => {
    setItemWithExpiration('loggedIn', loggedIn.toString(), 15); // Expiration is 15 minutes
  }, [loggedIn]);

  // Persist `appState` state with expiration
  useEffect(() => {
    setItemWithExpiration('appState', JSON.stringify(state), 15); // Expiration is 15 minutes
  }, [state]);

  return (
    <Router>
      <div style={{ display: 'flex' }}>
        {loggedIn && <NavBar setLoggedIn={setLoggedIn} state={state} />}
        <div style={{ padding: '20px', flex: 1 }}>
          <Routes>
            {!loggedIn ? (
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
                <Route path="/report" element={<Report state={state} setState={setState} />} />
                <Route path="/report2" element={<Report2 state={state} setState={setState} />} />
                <Route path="/disbursement_rpt" element={<DisbursementDetail state={state} setState={setState} />} />
                <Route path="/fieldprintreport" element={<FieldPrint state={state} setState={setState} />} />
                <Route path="/account" element={<Account state={state} setState={setState} />} />
                <Route path="/client" element={<Client state={state} setState={setState} />} />
                <Route path="/dispchart" element={<Chart state={state} setState={setState} />} />
                <Route path="/workflow/batch" element={<WorkflowBatch state={state} setState={setState} />} />
                <Route path="/admin/managesession" element={<ManageSession state={state} setState={setState} />} />
                <Route path="/bulk" element={<Bulk state={state} />} />
                <Route path="/group" element={<Group state={state} />} />
                <Route path="/workflow/single" element={<Single state={state} modalIsOpen={true} setModalIsOpen={setModalIsOpen} />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
