import React, { useState } from 'react';
import axios from 'axios';
import loadingGif from './loading.gif'; // Your loading gif file

const DisbursementModal = ({ isOpen, onClose,CustNo,userid, products,AccountID ,localhost}) => {
  const [clientId, setClientId] = useState(CustNo);
  const [amount, setAmount] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [installmentCount, setInstallmentCount] = useState(1);
  const [schedule, setSchedule] = useState('');
  const [disbDate,setDisbDate]=useState();
  const [posting, setPosting] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searching2, setSearching2] = useState(false);
  const [monthCount, setMonthCount] = useState('');
  const [instalCount, setInstalCount] = useState('');
  const [adjInstalCount,setAdjInstalCount] = useState('');
  const [selectedInterestType,setSelectedInterestType]=useState('');
  const [isIndLN,setIsIndLN]=useState(false);
  const [checked, setChecked] = useState(false);
  const [adjustDefaultProductSettings,setAdjustDefaultProductSettings]=useState('Allow Default Product settings')
 
   //sort the product using id in alphabetical order
   // Sort alphabetically by 'id'
   products.sort((a, b) => a.id.localeCompare(b.id));
  // Function to close the modal
  const handleClose = () => {
    onClose();
  };
  const handleDateChange = async(e) => {
   setDisbDate(e.target.value)
  }
  const handleProductChange = async(e) => {
    setSelectedProduct(e.target.value)
    if(e.target.value.toUpperCase().includes('INDLN')){
      setIsIndLN(true);
      setAdjInstalCount('all');
    }else{
      setIsIndLN(false);
      setAdjInstalCount('Weekly');
    }
      
   }
 // Function to handle client ID search
 const handleClientSearch = () => {
    console.log(`Searching for client ID: ${clientId}`);
    // Add your search logic here
  };
  // Function to handle form submission
  const handleSubmit = () => {
    console.log({
      clientId,
      amount,
      selectedProduct,
      installmentCount,
    });
    // Add form submission logic here
  };

   // Format schedule data for tabular display
   const formattedSchedule = schedule? schedule.map(item => 
    `${item.installment.toString().padEnd(12)} ${item.date.toString().padEnd(12)} ${item.principalRepay.padEnd(12)} ${item.interest.padEnd(12)} ${item.balance.padEnd(12)} ${item.status.padEnd(12)} ${item.clientID.padEnd(12)}`
  ):'';

  const header = `Installment    Date    Principal    Interest     Balance     status     ClientID     \n`;
  const formattedText =schedule? header + formattedSchedule.join('\n'):'';


 
  const handleCalculateSchedule = async () => {
    try {
      // console.log( selectedProduct,amount,clientId);
      setSearching2(true);
      const response = await axios.post(`${localhost}/calculate-schedule`, {
        productID: selectedProduct,
        amount: parseFloat(amount.replace(/₦|,/g, '')),
        clientID: clientId,
        productSettings:adjustDefaultProductSettings,
        instalCount:instalCount,
        monthCount:monthCount,
        adjInstalCount:adjInstalCount,
        selectedInterestType:selectedInterestType,
        includeSaturday:checked
      });
      // console.log(response.data);
      // console.log(response.data.schedule);

      setSchedule(response.data.schedule)
      setSearching2(false);
      // setSchedule(response.data.schedule); // Sets the returned schedule from backend
    } catch (error) {
      console.error("Error calculating schedule", error);
      setSearching2(false);
    }
  };

  
  return (
    <div
      style={{
        display: isOpen ? 'block' : 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
      }}
    > <select
    value={adjustDefaultProductSettings}
    onChange={(e) => setAdjustDefaultProductSettings(e.target.value)}
    style={{ width: '100%' }}
  >
    <option value={'Allow Default Product settings'}>Allow Default Product settings</option>
    <option value={'Adjust Default Product settings'}> Adjust Default Product settings</option>
  </select>
  <label>Installment Count</label>
  <select
    value={adjInstalCount}
    onChange={(e) => setAdjInstalCount(e.target.value)}
    style={{ width: '100%' }}
  >
    <option value={'Weekly'} hidden={isIndLN } >Weekly</option>
    <option value={'BI-Weekly'} hidden={isIndLN }>BI-Weekly</option>
    <option value={'all'} hidden={!isIndLN}>all</option>
    <option value={'1'} hidden={!isIndLN}>1</option>
    <option value={'2'} hidden={!isIndLN}>2</option>
    <option value={'3'} hidden={!isIndLN}>3</option>
  </select>
  <select
    value={selectedInterestType}
    onChange={(e) => setSelectedInterestType(e.target.value)}
    style={{ width: '100%' }}
  >
    <option value={'Flat'}>Flat</option>
    <option value={'Reducing'}>Reducing</option>
    <option value={'EMI/EWI'}>EMI/EWI</option>
  </select>
  <div hidden={adjustDefaultProductSettings==='Allow Default Product settings'}>  <label> Enter Number of Instalments:
          <input
            type="text"
            value={instalCount}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="Enter No of Instalments"
            style={{ flex: 1 }}
          />
           </label> 
          <label> Enter Number of Months:
          <input
            type="text"
            value={monthCount}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="Enter No of Months"
            style={{ flex: 1 }}
          />
          </label>

          </div> 
          
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          width: '500px',
          boxSizing: 'border-box',
        }}
      >
        <h3>Disbursement Module</h3>

        {/* Client ID */}
        <div>
          <label>Client ID</label>
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="Enter Client ID"
            style={{ flex: 1 }}
          />
          <button
            onClick={handleClientSearch}
            style={{
              marginLeft: '10px',
              padding: '5px 10px',
              backgroundColor: '#007BFF',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            {searching? <img src={loadingGif} alt="Loading..." style={{ width: '7%', height: '7%' }} />:'Search'}
            
          </button>

        </div>

        {/* Amount */}
        <div>
          <label>Amount</label>
          <input
            type="text"
            value={`₦${Number(amount.replace(/₦|,/g, '')).toLocaleString()}`}
            onChange={(e)=>setAmount(e.target.value)}
            placeholder="Enter Amount"
            style={{ width: '100%' }}
          />
        </div>
        {/* Product */}
        <div>
          <label>Product: Includes Saturday<input style={{width:'10%'}} type="checkbox" checked={checked} onChange={() => setChecked(!checked)}/></label>
          <select
                value={selectedProduct}
                onChange={handleProductChange}
                style={{ width: '100%' }}
            >
           <option value="">Select a product</option>
          {products.map((product, index) => (
           product.name.includes('Savings') ?'':<option key={index} value={product.id}>
          {product.id} 
          </option>
            ))}
          </select>
        </div>
        <label>
        Date of Dusbursement:
        <input
          type="date"
          name="dod"
          value={disbDate}
          onChange={handleDateChange}
        />
      </label>
        {/* View Schedule Button */}
        <div>
          <button
            onClick={handleCalculateSchedule}
            style={{ marginTop: '10px' }}
          >
            {searching2? <img src={loadingGif} alt="Loading..." style={{ width: '7%', height: '7%' }} />:'View Schedule'}
           
          </button>
        </div>

        {/* Schedule Text */}
        {schedule && (
          <div>
            <textarea
              value={formattedText}
              readOnly
              style={{ width: '100%', height: '100px',overflow: 'auto', 
                whiteSpace: 'pre', }}
            />
          </div>
        )}

        {/* Submit Button */}
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleSubmit} style={{ width: '100%' }}>
            Submit
          </button>
        </div>

        {/* Close Button */}
        <div style={{ textAlign: 'right', marginTop: '10px' }}>
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default DisbursementModal;
