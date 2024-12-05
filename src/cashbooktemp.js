import React, { useState, useEffect } from "react";

const DailyCashBook = ({ companyName, selectedDate }) => {
  const [cashData, setCashData] = useState({
    cashBalance: 0,
    prevCash: 0,
    totalReceipt: 0,
    totalPayment: 0,
    details: [],
  });

  const qCashbal = [
    {
      CoaNbr: "11102-002",
      CoaName: "Petty cash",
      Openning: -1084065,
      Credit: 11546650,
      Debit: 11659400,
    },
  ];

  const query1 = [
    { Amount: 206500, TranID: "001", CreditGL: "13114-002", DebitGL: "11102-002" },
    { Amount: 390000, TranID: "001", CreditGL: "13103-002", DebitGL: "11102-002" },
    // Add more rows as needed
  ];

  useEffect(() => {
    // Process `qCashbal`
    const { Openning, Credit, Debit } = qCashbal[0];
    let cashBalance = Openning + Debit - Credit;

    // Process `query1`
    let deposit = 0,
      repayment = 0,
      disbursement = 0,
      savingsWithdrawn = 0,
      income = 0,
      expenses = 0,
      bankWithdrawal = 0,
      bankDeposit = 0,
      totalReceipt = 0,
      totalPayment = 0;

    query1.forEach((entry) => {
      const { Amount, TranID, CreditGL, DebitGL } = entry;
      if (TranID.endsWith("002")) {
        deposit += Amount;
        totalReceipt += Amount;
      } else if (TranID.endsWith("001")) {
        repayment += Amount;
        totalReceipt += Amount;
      } else if (TranID.endsWith("010")) {
        disbursement += Amount;
        totalPayment += Amount;
      } else if (TranID.endsWith("005")) {
        savingsWithdrawn += Amount;
        totalPayment += Amount;
      } else if (TranID.endsWith("020")) {
        if (CreditGL.startsWith("11102") && DebitGL.startsWith("11")) {
          bankDeposit += Amount;
          totalPayment += Amount;
        } else if (CreditGL.startsWith("11102") && DebitGL.startsWith("4")) {
          expenses += Amount;
          totalPayment += Amount;
        } else if (DebitGL.startsWith("11102") && CreditGL.startsWith("11")) {
          bankWithdrawal += Amount;
          totalReceipt += Amount;
        } else if (DebitGL.startsWith("11102") && CreditGL.startsWith("3")) {
          income += Amount;
          totalReceipt += Amount;
        }
      }
    });

    const prevCash = cashBalance - totalReceipt + totalPayment;

    // Update state
    setCashData({
      cashBalance,
      prevCash,
      totalReceipt,
      totalPayment,
      details: [
        { label: "Repayment", value: repayment },
        { label: "Deposit", value: deposit },
        { label: "Income", value: income },
        { label: "Bank Withdrawal", value: bankWithdrawal },
        { label: "Disbursement", value: disbursement },
        { label: "Savings Withdrawn", value: savingsWithdrawn },
        { label: "Expenses", value: expenses },
        { label: "Bank Deposit", value: bankDeposit },
      ],
    });
  }, [qCashbal, query1]);

  return (
    <div>
      <h1>{`${companyName.toUpperCase()} DAILY CASH BOOK`}</h1>
      <p>Date: {selectedDate}</p>
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Transaction Type</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {cashData.details.map((detail, index) => (
            <tr key={index}>
              <td>{detail.label}</td>
              <td>{detail.value.toLocaleString(undefined, { style: "currency", currency: "NGN" })}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total Receipt</td>
            <td>{cashData.totalReceipt.toLocaleString(undefined, { style: "currency", currency: "NGN" })}</td>
          </tr>
          <tr>
            <td>Total Payment</td>
            <td>{cashData.totalPayment.toLocaleString(undefined, { style: "currency", currency: "NGN" })}</td>
          </tr>
          <tr>
            <td>Previous Cash in Hand</td>
            <td>{cashData.prevCash.toLocaleString(undefined, { style: "currency", currency: "NGN" })}</td>
          </tr>
          <tr>
            <td>Current Cash in Hand</td>
            <td>{(cashData.totalReceipt - cashData.totalPayment + cashData.prevCash).toLocaleString(undefined, { style: "currency", currency: "NGN" })}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default DailyCashBook;
