import React from "react";

const IncomeReport = ({reportType, reportData }) => {

const totalAmount = reportData.reduce((sum, item) => sum + item.Amount, 0);
  return (
    <div style={{ padding: "20px" }}>
    <h2 style={{ color: reportType === "Income Report" ? "green" : "red" }}>
      {reportType}
    </h2>
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
          <th>Date Effective</th>
          <th>Transaction ID</th>
          <th>Description</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {reportData.map((item, index) => (
          <tr key={index}>
            <td>{item.DateEffective.slice(0, 10)}</td>
            <td>{item.TranID}</td>
            <td>{item.stmtref}</td>
            <td
              style={{
                color: reportType === "Income Report" ? "green" : "red",
              }}
            >
              {item.Amount.toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td
            colSpan="3"
            style={{ fontWeight: "bold", textAlign: "right" }}
          >
            Total:
          </td>
          <td
            style={{
              color: reportType === "Income Report" ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {totalAmount.toFixed(2)}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>

    )
 
};

export default IncomeReport;
