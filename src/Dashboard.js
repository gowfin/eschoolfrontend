import React from 'react';
import { getOrgName  } from './orgname.js';

const Dashboard = ({ state, setState }) => {
 
    const { branch, logindata, groups, biztype,userid,userrole,status,localhost,companyname,sesdate } = state || {};
    return (
      
      <div>
  <div
    className='title'
    style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'green',
        margin: '1px 0',
    }}
  >
    <h2>{getOrgName(companyname)}</h2>
    
  </div>
  <h3 style={{color:'gold'}}>Welcome back {userid} . You logged in as {userrole}.</h3>
  <h3 style={{color:'purple'}}>{branch} Your Session date is {sesdate&&sesdate.slice(0,10)}</h3>
      <div 
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/Resource/gland.jpg)`,
      backgroundSize: 'cover', // Ensure the image covers the div
      backgroundPosition: 'center top', // Start from the top and center it horizontally
      height: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginTop: '-100px', // Move content up
      zIndex: 1, // Set a low z-index for background
      color: 'green',
      clipPath: 'inset(30% 0 0 0)', // Crop the top 20%
      position: 'relative',
        }}
      >
     
  </div>

            </div>
       

    );
};

export default Dashboard;
