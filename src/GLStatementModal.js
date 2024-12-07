import React, { useState } from "react";
import axios from "axios";
import "./GLReportModal.css"; // Optional: for custom styling
import loadingGif from './loading.gif'; // Your loading gif file


const GLReportModal = ({ isOpen, onClose, incomeList,localhost,userid  }) => {
  const [glCode, setGlCode] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${localhost}/gl-report`, {
        glCode,
        startDate,
        endDate,
      });
      console.log(response.data); // Handle or display the result
    } catch (err) {
      console.error(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Generate GL Report</h2>
        <form onSubmit={handleSubmit}>
          <label>
            GL Code:
            <select value={glCode} onChange={(e) => setGlCode(e.target.value)}>
            <option value="">-- Select an income --</option>
            {incomeList.length!==0 && incomeList.map((income, index) => (
            <option key={index} value={income}>{income}</option>
            ))}
        </select>
          </label>
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
          <button type="submit">Generate Report</button>
        </form>
      </div>
    </div>
  );
};

export default GLReportModal;
