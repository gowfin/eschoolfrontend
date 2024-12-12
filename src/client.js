import React, { useState,useEffect } from "react";
import {  useNavigate } from 'react-router-dom';
import axios from "axios";
import './client.css'
import loadingGif from './loading.gif'; // Your loading gif file

import imageCompression from 'browser-image-compression';
// import { localhost } from './env.js';



const CustomerCreationForm = ({ state, setState }) => {
const {localhost}= state || 'localhost:3000';
const navigate = useNavigate(); 
const [pixPreview, setPixPreview] = useState(null);
const [signPreview, setSignPreview] = useState(null);
const [loading, setLoading] = useState(false); // Loading state
const [searching, setSearching] = useState(false);
const [message,setMessage]=useState("");
const [updating,setUpdating]=useState(false);
const [buttontitle,setButtontitle]=useState('Submit');

/////////////////FOR DEFAULT ACCS
 const [selectedProduct, setSelectedProduct] = useState('');
const [isRadioSelected, setIsRadioSelected] = useState(false);
////////////////////////////////////////////////////////////////////


const { branch, logindata, groups, biztype,userid,userrole,status,products } = state || {};

const biztypes=biztype.split(',');
const grouplist=groups;
const Branchcode=branch.slice(0,3);
// console.log(`Branchcode: ${Branchcode}`);
const formatDate = (dateString) => {
  const date = new Date(dateString); // Converts string to Date object
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2);  // Ensures 2 digits for month
  const day = (`0${date.getDate()}`).slice(-2);         // Ensures 2 digits for day
  return `${year}-${month}-${day}`;
}
useEffect(() => {
  setFormData(prevFormData => {
      const updatedFormData = {
          ...prevFormData,
          branchCode: selectedProduct,
      };
      console.log('Updated branchCode:', updatedFormData.branchCode); // Log the updated value
      return updatedFormData;
  });
}, [selectedProduct]);


const handleRadioChange = () => {
  setIsRadioSelected(!isRadioSelected);
  if(!isRadioSelected){
    const firstSavingsProduct = products.find(item => item.name.includes("Savings"));
    setSelectedProduct(firstSavingsProduct.name);
   console.log(formData);
  }

   
};

const handleSelectChange = (event) => {
  const selectedValue = event.target.value; // Get the selected value
  console.log('ProductID:',selectedValue);
  setSelectedProduct(selectedValue);
       

  
  console.log(formData.branchCode); 
};

//////////////////////////////////////////////////////
const handleBlur=(e)=>{

  if(formData.custno.length<10){
    setFormData({...formData,custno:Branchcode+getIDFormat(formData.custno)});
  }
}
  const handleSearch = (e) => {
    e.preventDefault();
 
    //Clear the message
    setMessage("");
    //clear the client form first
    setFormData({...formData,
      // custno: "",
      firstname: "",
      lastname: "",
      middlename: "",
      gender: "",
      qualification: "",
      biztype: "",
      bizAddress: "",
      homeAddress: "",
      groupID: "",
      phone: "",
      email: "",
      pix: null,
      sign: null,
      status: "",
      branchCode: "",
      bvn: "",
      nuban: "",
      dob: "",
      maritalStatus: ""
  });
  //Clear the images
  setPixPreview ("");
setSignPreview ("");
 // set the search gif running
    setSearching(true);
    const custno=formData.custno;
    const response= axios.post(`${localhost}/get_client`, {custno})
    .then(response => {
     
      const data = response.data; // Extract data from response
      
      if(data.status==='failed'){
        setMessage(data.err)
      }else if(data.status==='Customer number not found.'){
        setMessage(data.status);
        setSearching(false);
      }
      else{
//  The image is returned in the "pix" field as base64
const base64Pix = response.data.pix;
const base64Sign = response.data.sign;
    
// Format the base64 string for an image source
const pixSource=`data:image/png;base64,${base64Pix}`;
const signSource=`data:image/png;base64,${base64Sign}`
//Set Image source to be displayed
setPixPreview (pixSource);
setSignPreview (signSource);

     setMessage(data.status);
      
       setSearching(false); // Set loading to false once request is successful
       
       //check for null values for Marital Status
       const maritalStatus = data.Marital_status ? data.Marital_status.toUpperCase() : 'none';
         setFormData({
      ...formData,
      custno: data.Custno,
      firstname: data.firstname,
      lastname: data.lastname,
      middlename: data.middlename,
      gender: data.Gender,
      qualification: data.qualification,
      biztype: data.Biztype,
      bizAddress: data.BizAddress,
      homeAddress: data.Homeaddress,
      groupID: data.GroupID,
      phone: data.Phone,
      email: data.email,
      pix: data.pix,
      sign: data.sign,
      status: data.Status,
      branchCode: data.Branchcode,
      bvn: data.BVN,
      nuban: data.Nuban,
      dob: formatDate(data.DOB),
      maritalStatus:maritalStatus
    });

    setUpdating(true);
    setButtontitle("Update");
    setMessage('successful');
  }
    })
    .catch(error => {
      console.log(error);
      setSearching(false);
      console.log(response.data);
    });
 
    
  };
const [formData, setFormData] = useState({
    custno: "new customer",
    firstname: "",
    lastname: "",
    middlename: "",
    gender: "",
    qualification: "",
    biztype: "",
    bizAddress: "",
    homeAddress: "",
    groupID: "",
    phone: "",
    email: "",
    pix: "0x00000000",
    sign: "0x00000000",
    status: "",
    branchCode: "",
    bvn: "",
    nuban: "",
    dob: "1900-01-01",
    maritalStatus: ""
  });
  


// Handle input change
const handleChange = async(e) => {
  const { name, value, files } = e.target;
  
  if (files && files.length > 0) {
    const file = files[0];
    const fileType = file.type; //GET FILE TYPE TO CHECK IF IT IS FROM DB OR UPLOADED

if (fileType.startsWith('image/')) {

    // Define compression options
  const options = {
    maxSizeMB: 0.1, // Maximum size in MB
    maxWidthOrHeight: 150, // Maximum width/height
    useWebWorker: true, // Use multi-threading for better performance
  };
// Compress the image 
const compressedFile = await imageCompression(file, options);
    // Convert file to binary
    const reader = new FileReader();
    reader.onloadend = () => {
      const arrayBuffer = reader.result;
      const byteArray = new Uint8Array(arrayBuffer);
      const hexString = byteArray.reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '');
      
      // Update formData with binary representation of the file
      setFormData((prevFormData) => ({ ...prevFormData, [name]: hexString }));
    };
    reader.readAsArrayBuffer(compressedFile);
    //  console.log('Original File Size:',file.name, file.size / 1024, 'KB');
    //  console.log('Compressed File Size:', compressedFile.name,compressedFile.size / 1024, 'KB');
     };
    // Optionally set preview for images
    const previewUrl = URL.createObjectURL(file);
    if (name === 'pix') {
      setPixPreview(previewUrl);
      console.log(value);

    } else if (name === 'sign') {
      setSignPreview(previewUrl);
      console.log(value);
    }
  } else {
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }
};
//////10 DIGIT CUSTNO FORMAT
const getIDFormat=( num )=>{
  //0020000001
  return   String(num).padStart(7, '0');
   
}

   
   // Handle form submission
   const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setMessage('');
      setLoading(true); // Set loading state to true when form is submitted
  
      const url = buttontitle === 'Submit'
        ? `${localhost}/register_client`
        : `${localhost}/update_client`;
  
      let updatedFormData = { ...formData }; // Start with a copy of current formData
  
      if (buttontitle === 'Submit') {
        const response = await axios.post(`${localhost}/get_lastclientID`);
        const num = response.data.num;
        const sevenDigitCusnoWithoutBranchCode = getIDFormat(num);
        const newCustno = `${Branchcode}${sevenDigitCusnoWithoutBranchCode}`;
        console.log(newCustno);
  
        // Update the custno directly in the copied form data
        updatedFormData.custno = newCustno;
        
      }
  
      // Proceed with the main POST request
      const response = await axios.post(url, { formData: updatedFormData });
      setLoading(false); // Set loading to false once request is successful
    
      if(isRadioSelected){
        const response2 = await axios.post(`${localhost}/createAccount`, { formData: updatedFormData });
        const feedback= await response2.data
        // console.log(feedback,isRadioSelected);
         // Navigate to account page with query parameter
         navigate(`/account?custno=${updatedFormData.custno}`);

      }
      buttontitle === 'Submit'
        ? setMessage(`Client registered successfully (${updatedFormData.custno})!`)
        : setMessage("Client updated successfully!");
  
      // Clear the client form
      setFormData({
        firstname: "",
        lastname: "",
        middlename: "",
        gender: "",
        qualification: "",
        biztype: "",
        bizAddress: "",
        homeAddress: "",
        groupID: "",
        phone: "",
        email: "",
        pix: null,
        sign: null,
        status: "",
        branchCode: "",
        bvn: "",
        nuban: "",
        dob: "",
        maritalStatus: ""
      });
  
      // Clear the images
      setPixPreview("");
      setSignPreview("");
  
      // Reset button title
      setButtontitle('Submit');
  
    } catch (error) {
      setMessage(error.message);
      setLoading(false); // Set loading to false on error
    }
  };
  



  return (
    <form onSubmit={handleSubmit}>
      <label>
      {message && <p className="message" style={{
      color: message.includes('successful') ? 'green' : 'red',
    }}>{message}</p>}
      <div className="input-with-button">
        Customer No:
        <input
          type="text"
          name="custno"
          style={{width:'300px'}}
          maxLength="10"
          value={formData.custno}
          onBlur={handleBlur}
          onChange={handleChange}
          required
          
        />
    
      {/*  Button with Loading State */}
      <button className="search-btn" disabled={searching} onClick={handleSearch}>
        {searching ? (
          <img src={loadingGif} alt="Loading..." style={{ width: '20px', height: '20px' }} />
        ) : (
        `🔍Search` 
        )}
      
      </button>
      </div>
      </label>

      <label>
      <span className="required-asterisk" style={{color:"red"}}>*</span>First Name:
        <input
          type="text"
          name="firstname"
          maxLength="50"
          value={formData.firstname}
          onChange={handleChange}
          required
        />
      </label>
      {pixPreview && (
      <div>
    <img src={pixPreview} alt="Profile Preview" style={{ width: '100px', height: '100px' }} />
    </div>
   )}
   {signPreview && (
  <div>
    <img src={signPreview} alt="Signature Preview" style={{ width: '100px', height: '50px' }} />
  </div>
   )}
      <label>
      <span className="required-asterisk" style={{color:"red"}}>*</span>Last Name:
        <input
          type="text"
          name="lastname"
          maxLength="50"
          value={formData.lastname}
          onChange={handleChange}
          required
        />
         
      </label>

      <label>
        Middle Name:
        <input
          type="text"
          name="middlename"
          maxLength="50"
          value={formData.middlename}
          onChange={handleChange}
        />
      </label>

      <label>
      <span className="required-asterisk" style={{color:"red"}}>*</span>Gender:
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </label>

      <label>
      <span className="required-asterisk" style={{color:"red"}}>*</span>Qualification:
        <select name="qualification" value={formData.qualification} onChange={handleChange}>
          <option value="">Select Qualification</option>
          <option value="SSCE">SSCE</option>
          <option value="ND">ND</option>
          <option value="HND">HND</option>
          <option value="B.Sc">B.Sc</option>
          <option value="M.Sc">M.Sc</option>
        </select>
      </label>

      <label>
      <span className="required-asterisk" style={{color:"red"}}>*</span> Business Type:
        <select name="biztype" value={formData.biztype} onChange={handleChange} required>
        {biztypes.map((biz,index) =>(
        <option key={index} value={biz}>
          {biz} 
     </option>))}
        </select>
      </label>

      <label>
        Business Address:
        <input
          type="text"
          name="bizAddress"
          maxLength="50"
          value={formData.bizAddress}
          onChange={handleChange}
        />
      </label>

      <label>
      <span className="required-asterisk" style={{color:"red"}}>*</span>Home Address:
        <input
          type="text"
          name="homeAddress"
          maxLength="50"
          value={formData.homeAddress}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Group ID:
        <select name="groupID" value={formData.groupID} onChange={handleChange}>
          {grouplist.map((group,index) =>(
          <option key={index} value={group}>
      {group}
    </option>))}
        </select>
      </label>

      <label>
        Phone:
        <input
          type="text"
          name="phone"
          maxLength="50"
          value={formData.phone}
          onChange={handleChange}
        />
      </label>

      <label>
        Email:
        <input
          type="email"
          name="email"
          maxLength="50"
          value={formData.email}
          onChange={handleChange}
        />
      </label>

      <label>
        Profile Picture:
        {pixPreview && (
  <div>
    <h4>Profile Picture Preview:</h4>
    <img src={pixPreview} alt="Profile Preview" style={{ width: '100px', height: '100px' }} />
  </div>
)}
        <input
          type="file"
          name="pix"
          accept="image/*"
          onChange={handleChange}
        />   
      </label>

      <label>
        Signature:
        {signPreview && (
    <div>
    <h4>Signature Preview:</h4>
    <img src={signPreview} alt="Signature Preview" style={{ width: '100px', height: '100px' }} />
    </div>
   )}
        <input
          type="file"
          name="sign"
          accept="image/*"
          onChange={handleChange}
        />
      </label>

      <label>
        Status:
        <select name="status" value={formData.status} onChange={handleChange} required>
          <option value="">Select Status</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Closed">Closed</option>
        </select>
      </label>
{/*--------------------Default accounts------------------ */}

              <label style={{ display: 'flex', alignItems: 'center' }}>
              <input
               type="radio"
               style={{ width: '10%', marginRight: '5px' }} // Adjust margin as needed
               checked={isRadioSelected}
              onClick={handleRadioChange}
              />
              Select default account?
              </label>
                    
            {isRadioSelected && (
                <select onChange={handleSelectChange}  name="branchCode">
                    {products.filter(product => !product.id.includes('LN')).map((product,index) => (
                        <option key={index} value={product.name.replace('accounts','').replace('savings','')}>
                            {product.name}
                        </option>
                    ))}
                </select>
            )}
        

        {/*---------------------------------------------*/}
     

      <label>
        BVN:
        <input
          type="text"
          name="bvn"
          maxLength="12"
          value={formData.bvn}
          onChange={handleChange}
          // required
        />
      </label>

      <label>
        NUBAN:
        <input
          type="text"
          name="nuban"
          maxLength="11"
          value={formData.nuban}
          onChange={handleChange}
          // required
        />
      </label>

      <label>
        Date of Birth:
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />
      </label>

      <label>
        Marital Status:
        <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} required>
          <option value="">Select Marital Status</option>
          <option value="SINGLE">SINGLE</option>
          <option value="MARRIED">MARRIED</option>
          <option value="DIVORCED">DIVORCED</option>
          <option value="WIDOW">WIDOW</option>
          <option value="WIDOWER">WIDOWER</option>
          <option value="none">none</option>
        </select>
      </label>

      {/* Submit Button with Loading State */}
      <button type="submit" disabled={loading} >
        {loading ? (
          <img src={loadingGif} alt="Loading..." style={{ width: '20px', height: '20px' }} />
        ) : (
          `${buttontitle}`
        )}
      </button>
      <div>
     
      {message && <p className="message" style={{
      color: message.includes('successful') ? 'green' : 'red',
    }}>{message}</p>}
   
    </div>
    </form>

    
  );
};
export default CustomerCreationForm;
