import React from "react";

const NewAndClosedClients = ({ reportData }) => {
  // Helper function to group by COATYPE and calculate totals
  const formatDateForInput = (date) => {
    if (!date) return ''; // Return an empty string for invalid or empty input

    // Check if date is already in the correct format
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
    }

    const d = new Date(date);
    if (isNaN(d.getTime())) {
        return ''; // Return an empty string for invalid date objects
    }

    return d.toISOString().split('T')[0]; // Format as yyyy-MM-dd
};

    // Helper function to calculate totals

const calculateTotals =(data) => {
  const summary = {};
  const primaryOfficerTotals = {};
  let grandMale = 0;
  let grandFemale = 0;

  data.forEach((item) => {
    const { PrimaryOfficerID, groupname, Gender } = item;

    // Initialize PrimaryOfficerID in summary
    if (!summary[PrimaryOfficerID]) {
      summary[PrimaryOfficerID] = {};
      primaryOfficerTotals[PrimaryOfficerID] = 0; // Initialize client count
    }

    // Initialize groupname under PrimaryOfficerID
    if (!summary[PrimaryOfficerID][groupname]) {
      summary[PrimaryOfficerID][groupname] = { total: 0, Gender: {} };
    }

    // Increment group total
    summary[PrimaryOfficerID][groupname].total++;
    primaryOfficerTotals[PrimaryOfficerID]++; // Increment Primary Officer total

    // Increment Gender count under groupname
    if (!summary[PrimaryOfficerID][groupname].Gender[Gender]) {
      summary[PrimaryOfficerID][groupname].Gender[Gender] = 0;
    }
    summary[PrimaryOfficerID][groupname].Gender[Gender]++;

    // Update grand totals for genders
    if (Gender === "Male") grandMale++;
    if (Gender === "Female") grandFemale++;
  });

  return { summary, grandMale, grandFemale, primaryOfficerTotals };
};

const {
  summary: totals,
  grandMale,
  grandFemale,
  primaryOfficerTotals,
} = calculateTotals(reportData);

// Calculate grand total
const grandTotal = Object.values(primaryOfficerTotals).reduce((sum, count) => sum + count, 0);

  const totalPrimaryOfficers = Object.keys(totals).length;
  return (
    <div style={{ padding: "20px" }}>
      <h2>New and Closed Clients details</h2>
      
      <h3>Summary</h3>
          <table
            border="1"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr>
                <th>Primary Officer</th>
                <th>Group Name</th>
                <th>Total</th>
                <th>Gender Breakdown</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(totals).map(([officer, groups]) =>
                Object.entries(groups).map(([groupname, details]) => (
                  <tr key={`${officer}-${groupname}`}>
                    <td>{officer}</td>
                    <td>{groupname}</td>
                    <td>{details.total}</td>
                    <td>
                      {Object.entries(details.Gender).map(
                        ([gender, count]) => `${gender}: ${count} `
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
    
          <h3>Grand Totals</h3>
          <p>Total New Clients: {grandTotal}</p>
          <p>Total Primary Officers: {totalPrimaryOfficers}</p>
          <p>Grand Total Male: {grandMale}</p>
          <p>Grand Total Female: {grandFemale}</p>
          <h3>Total Clients Per Primary Officer</h3>
          <ul>
            {Object.entries(primaryOfficerTotals).map(([officer, count]) => (
              <li key={officer}>
                {officer}: {count}
              </li>
            ))}
          </ul>
          <tr><span>Details:</span></tr>
      <table
        border="1"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
        }}
      >
        <thead>
          <tr>
            <th>Customer No</th>
            <th>Client Name</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Date Created</th>
            <th>Status</th>
            <th>Group Name</th>
            <th>Primary Officer</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((item, index) => (
            <tr key={index}>
              <td>{item.Custno}</td>
              <td>{item.ClientName}</td>
              <td>{item.Gender}</td>
              <td>{item.Phone || "N/A"}</td>
              <td>{item.DateCreated&&item.DateCreated.slice(0,10)}</td>
              <td>{item.Status}</td>
              <td>{item.groupname}</td>
              <td>{item.PrimaryOfficerID}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    )
 
};

export default NewAndClosedClients;
