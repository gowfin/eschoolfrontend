import React from "react";

const ProfitLossStatement = ({ reportData }) => {

  
  const calculateSummary = (data) => {
    const summary = { I: [], E: [] };
    let totalIncome = 0;
    let totalExpense = 0;
    let yTDIncome = 0;
    let yTDExpense = 0;
   
  
    data.forEach((item) => {
      
      if (item.CoaType === "I" && !item.CoaHeader) {
        summary.I.push(item);
        totalIncome += item.Monthly;
        yTDIncome += item.Yearly
      } else if (item.CoaType === "E" && !item.CoaHeader) {
        summary.E.push(item);
        totalExpense += item.Monthly;
        yTDExpense += item.Yearly
      }
    });
    

    return { summary, totalIncome, totalExpense,yTDIncome,yTDExpense, profitOrLoss: totalIncome + totalExpense, YTD:yTDIncome + yTDExpense};
  };

  const { summary, totalIncome, totalExpense,yTDIncome,yTDExpense, profitOrLoss: netProfitOrLoss,YTD } = calculateSummary(reportData);

  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" });
    return amount < 0 ? `(${formatter.format(Math.abs(amount))})` : formatter.format(amount);
  };
  return (
    <div>
      <h1>Profit and Loss Statement</h1>

      {/* Income Section */}
      <h2>Income</h2>
      <table>
        <thead>
          <tr>
            <th>CoaNbr</th>
            <th>Description</th>
            <th>Monthly</th>
            <th>YTD</th>
          </tr>
        </thead>
        <tbody>
          {summary.I.map((item, index) => (
            <tr key={index}>
              <td>{item.CoaNbr}</td>
              <td>{item.CoaName}</td>
              <td>{formatCurrency(item.Monthly)}</td>
              <td>{formatCurrency(item.Yearly)}</td>
            </tr>
          ))}
        </tbody>
        
      </table>
      <p>Total Income Monthly: {formatCurrency(totalIncome)} Monthly: {formatCurrency(yTDIncome)}</p>

      {/* Expense Section */}
      <h2>Expenses</h2>
      <table>
        <thead>
          <tr>
            <th>CoaNbr</th>
            <th>Description</th>
            <th>Monthly</th>
            <th>YTD</th>
          </tr>
        </thead>
        <tbody>
          {summary.E.map((item, index) => (
            <tr key={index}>
              <td>{item.CoaNbr}</td>
              <td>{item.CoaName}</td>
              <td>{formatCurrency(item.Monthly)}</td>
              <td>{formatCurrency(item.Yearly)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Total Monthly Expense: {formatCurrency(totalExpense)} Yearly: {formatCurrency(yTDExpense)}</p>
      {/* <footer>
          <tr>
            <td colSpan='2'>Total Income Monthly: {formatCurrency(totalIncome)}</td>
            <td > Net {netProfitOrLoss >= 0 ? "Loss" : "Profit"}: {formatCurrency(netProfitOrLoss)}</td>
            <td >Yearly {YTD >= 0 ? "Loss" : "Profit"}: {formatCurrency(YTD)}</td>

          </tr>
        </footer> */}
      {/* Profit or Loss */}
      <h3>
        Net {netProfitOrLoss >= 0 ? "Loss" : "Profit"}: {formatCurrency(netProfitOrLoss)} Yearly {YTD >= 0 ? "Loss" : "Profit"}: {formatCurrency(YTD)}
      </h3>
    </div>
  );
};

export default ProfitLossStatement;
