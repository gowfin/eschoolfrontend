import React, { useState } from "react";
import axios from "axios";

const GLReportForm = () => {
  const [glCode, setGlCode] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3005/gl-report", {
        glCode,
        startDate,
        endDate,
      });
      console.log(response.data); // Handle or display the result
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        GL Code:
        <select value={glCode} onChange={(e) => setGlCode(e.target.value)}>
          <option value="">Select GL Code</option>
          <option value="GL1234567">GL1234567 - Account 1</option>
          <option value="GL2345678">GL2345678 - Account 2</option>
        </select>
      </label>
      <label>
        Start Date:
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </label>
      <label>
        End Date:
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </label>
      <button type="submit">Generate Report</button>
    </form>
  );
};

export default GLReportForm;
