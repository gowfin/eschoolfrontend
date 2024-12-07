import React, { useState,useEffect } from 'react';
import axios from 'axios';
import loadingGif from './loading.gif'; // Your loading gif file


function GroupForm({state}) {
const [officers, setOfficers] = useState([]);
const [marketers, setMarketers] = useState([]);
const [loading, setLoading] = useState(false);
const [posting, setPosting] = useState(false);
const [searching, setSearching] = useState(false);
const [branch, setBranch] = useState(state.branch.slice(0,3));
const localhost=state.localhost;



const fetchUsers = async () => {
    
    try {
        setLoading(true);
        const branchCode=formData.branchCode;
        const response = await axios.post(`${localhost}/loanusers`, {
            branchCode,
        });
       
        setOfficers(response.data.officers || []);
        setMarketers(response.data.marketers || []);
    } catch (error) {
        console.error('Error fetching users:', error);
    }finally{setLoading(false);}
};

    const [formData, setFormData] = useState({
        groupID: '',
        groupName: '',
        groupVenue: '',
        meetingDay: '',
        primaryOfficerID: '',
        secondaryOfficerID: '',
        maxSize: '30',
        minSize: '1',
        branch: '',
        branchCode: state.branch.slice(0,3),
    });
    useEffect(() => {
        if (formData.branchCode) fetchUsers();
    },[formData.branchCode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        setFormData((prev) => ({
            ...prev,
            [name]: value,
             ...(name === 'groupID' && !prev.groupName && { groupName: `${value} Group` }), // Auto-fill groupName only if it's empty
             ...(name === 'branchCode' && { branch: value }),
            }));
    
        if (name === 'branchCode') setBranch(value); 
       
    };

    const handleSearch = async () => {
        try {
            setSearching(true);
            const response = await axios.post(`${localhost}/get-group`,{groupID:formData.groupID});
            const data=response.data;
            // alert(response.data.message);
            // Reset form
            setFormData({
                groupID: data.GroupID,
                groupName:data.GroupName,
                groupVenue: data.GroupVenue,
                meetingDay: data.MeetingDay,
                primaryOfficerID: data.PrimaryOfficerID,
                secondaryOfficerID: data.SecondaryOfficerID,
                maxSize: data.Maximumsize,
                minSize: data.MininumSize,
                branch: data.branch,
                branchCode: data.branch,
            });
        } catch (error) {
            
            alert(error);
            alert('An error occurred while fetching the data.');
        }finally{setSearching(false);}
    };
    const handleSubmit = async () => {
        try {
            setPosting(true);
            const response = await axios.post(`${localhost}/groupmgt`, formData);
            alert(response.data.message);
            // Reset form
            setFormData({
                groupID: '',
                groupName: '',
                groupVenue: '',
                meetingDay: '',
                primaryOfficerID: '',
                secondaryOfficerID: '',
                maxSize: '30',
                minSize: '1',
                branch: '',
                branchCode: branch,
            });
        } catch (error) {
            
            console.error(error);
            alert('An error occurred while saving the data.');
        }finally{setPosting(false);}
    };
if(loading){
    return(<div><label>Loading...</label><img src={loadingGif} alt="Loading..." style={{ width: '7%', height: '7%' }} /></div>
    )
}
    return (
        <div>
            <h2>Group Form</h2>
            <input
                type="text"
                name="groupID"
                placeholder="Group ID"
                value={formData.groupID}
                onChange={handleChange}
                style={{width:'30%'}}
                required
            />{formData.groupID.length>1 && <label onClick={handleSearch}> {searching? <img src={loadingGif} alt="Loading..." style={{ width: '5%', height: '3%' }} />:`🔍Search`}</label>}
            <input
                type="text"
                name="groupName"
                placeholder="Group Name"
                value={formData.groupID+' Group'}
                onChange={handleChange}
                style={{width:'85%'}}
            />
            <input
                type="text"
                name="groupVenue"
                placeholder="Group Venue"
                value={formData.groupVenue}
                onChange={handleChange}
                style={{width:'85%'}}
            />
            <select style={{width:'90%',marginRight:'10px'}} name="meetingDay" value={formData.meetingDay} onChange={handleChange}>
                <option value="">Select Meeting Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
            </select>
            <label>Primary Officer:</label>
                <select name='primaryOfficerID' style={{width:'90%'}} value={formData.primaryOfficerID} onChange={handleChange}required>
                    {officers.map((officer, index) => (
                        <option key={index} value={officer}>
                            {officer}
                        </option>
                    ))}
                </select>
                <label>Secondary Officer:</label>
                <select name='secondaryOfficerID' style={{width:'90%'}} value={formData.secondaryOfficerID} onChange={handleChange}>
                    {marketers.map((marketer, index) => (
                        <option key={index} value={marketer}>
                            {marketer}
                        </option>
                    ))}
                </select>
            <input
                type="number"
                name="maxSize"
                placeholder="Maximum Size"
                value={formData.maxSize}
                onChange={handleChange}
                style={{width:'85%'}}
            />
            <input
                type="number"
                name="minSize"
                placeholder="Minimum Size"
                value={formData.minSize}
                onChange={handleChange}
                style={{width:'85%'}}
            />
             <select style={{width:'90%'}} required name="branchCode" value={formData.branchCode} onChange={handleChange}>
                <option value={formData.branchCode}>{formData.branchCode}</option>
                <option value="002">002</option>
                <option value="003">003</option>
                <option value="004">004</option>
                <option value="005">005</option>
                <option value="006">006</option>
                <option value="007">007</option>
            </select>
            
            {formData.groupName!=='Group'&&formData.groupID.length>1 && formData.primaryOfficerID.length>1 && formData.branchCode.length>2 && <button onClick={handleSubmit}>{posting? <img src={loadingGif} alt="Posting..." style={{ width: '7%', height: '7%' }} />
            :'Submit'}</button>}
        </div>
    );
}

export default GroupForm;
