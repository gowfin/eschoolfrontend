import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css"; 
import loadingGif from './loading.gif';
import { getLocalhost  } from './env.js';
import { getOrgName  } from './orgname.js';




const Login = ({ setLoggedIn, state, setState, isModalOpen, setIsModalOpen, branches,setBranches }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState({});
  const [companyname, setCompanyname] = useState('');
  const [localhost,setLocalhost]=useState('');
  const [licenseExpired,setLicenseExpired]=useState(true);
  const [sesdate,setSesdate]=useState('');

  
    useEffect(() => {
      setMessage('Processing ... Wait...');
      const params = new URLSearchParams(window.location.search);
      const compname = params.get("p");
      setCompanyname(compname);
  
      const firstPart = window.location.origin;
      if (compname) {
        setLocalhost(getLocalhost(compname));
        console.log('Localhost URL:', localhost);
        console.log('Company Name:', compname);
      }
  
      // Redirect to the main URL without parameters
      if (companyname) {
        // localStorage.clear();
        window.location.href = firstPart;
      }
    }, []); // Empty dependency array to run only on mount

    useEffect(() => {
      setMessage('Wait...loading your settings');
      const checkLicense = async () => {
                try {
          
          const response = await axios.post(`${localhost}/checklicense`);
          setMessage(response.data.message);
          setSesdate(response.data.sesdate);
          
          if (
            response.data.message === 'License has expired. Please renew' || 
            response.data.message === 'Error occurred while checking license'
          ) {
            setLicenseExpired(true);
          } else {
            setLicenseExpired(false);
          }
        } catch (error) {
          setMessage(error.response?.data?.message || 'Error occurred while checking license.');
          setLicenseExpired(true); // Assume expired in case of error
        }
      };
      const newLocalhost =  getLocalhost(companyname); // Wait for the async function to resolve
      setLocalhost(newLocalhost); // Update the state

      checkLicense();
    },[localhost],[companyname]);
    
  
/////////////////////////////////////
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const closeModal = (selectedBranch) => {
    
    if (selectedBranch) {
      setLoggedIn(true);
      setState(prevState => ({
        ...prevState,
        branch: selectedBranch,
        sesdate:sesdate
        
      }));
      setLoggedIn(true); // Update login state
      navigate('/Dashboard', { state: { ...state} });
    }
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (username.length > 0 && password.length > 0) {
      try {
        setLoading(true);
        const response = await axios.post(`${localhost}/login`, {
          username,
          password,
        });
        setLoading(false);
        const data = response.data;

        setState(data); // Update state
       

        if (response.data.status === 'successful') {
          setMessage("Login successful");
          console.log(sesdate);
          // Fetch branch details here
          await fetchBranchDetails();

          if (data.branch.includes(",")) {
            const branchList = data.branch.split(',');
            setBranches(branchList); // Set branches
            setIsModalOpen(true); // Open the modal
            // navigate('/modal', { state: { ...state } });
          } else {
            navigate('/Dashboard', { state: { ...state } });
            setLoggedIn(true); // Update login state
          }
        } else {
          setMessage(response.data.status + ' or Invalid credentials');
        }
      } catch (err) {
        setLoading(false);
        setMessage(err.response ? err.response.data.message : 'An unexpected error occurred');
      }
    } else {
      setMessage("No Username or password entered");
    }
  };

  const fetchBranchDetails = async () => {
    setLoading(true);
    try {
      //Load groups from backend
      const resgrp = await axios.post(`${localhost}/get_groups`);
      const groupArray = resgrp.data.map(grp => grp.groupid);

      const resbiztype = await axios.post(`${localhost}/get_biztype`);
      const biztypeArray = resbiztype.data.map(item => item.bizName).join(",\n");
      //Load Products from backend
      const response = await fetch(`${localhost}/products`);
      const data= await response.json();
      console.log(data);
     
          setProducts(data);
         

      setState(prevState => ({
        ...prevState,
        groups: groupArray,
        biztype: biztypeArray,
        products:data,
        localhost:localhost,
        companyname:companyname,
        sesdate:sesdate
        
      }));
    } catch (err) {
      console.log(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="image-section">
        <img src={`${process.env.PUBLIC_URL}/Resource/login.PNG`} alt="Login" />
      </div>
      <div className="form-section">
        <header className="company-header">
          <h1><strong>{getOrgName(companyname)}</strong></h1>
        </header>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
        <div className="password-field">
          <input
           style={{width:'110%', margin:'10px',padding:'16px',fontSize:'16px'}}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
      
          </div>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              style={{width:'110%', margin:'10px',padding:'16px',fontSize:'16px'}}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" onClick={togglePasswordVisibility} className="toggle-password">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {!licenseExpired && <button type="submit" hidden={licenseExpired} disabled={loading} className="fancy-button">
            {loading ? (
              <img src={loadingGif} alt="Loading..." style={{ width: '20px', height: '20px' }} />
            ) : (
              "Login"
            )}
          </button>}
        </form>
        {message && <p className="message" style={{
          color: message.includes('successful') ? 'green' : 'red',
        }}>{message}</p>}
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Select a Branch</h2>
              <ul>
                {branches.map((branchItem) => (
                  <li key={branchItem.substring(0, 3)}>
                    <button onClick={() => closeModal(branchItem)}>
                      {branchItem}
                    </button>
                  </li>
                ))}
              </ul>
              <button onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
          </div>
        )}
        <footer className="footer">
          <p>© 2024 Gowfin Softwares</p>
        </footer>
      </div>
    </div>
  );
};

export default Login;
