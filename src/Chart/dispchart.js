// App.js
import React from 'react';
import ChartComponent from './chart';
import ChartComponentPie from './incomepiechart';

const Dispalychart = ({state}) => {
    const {branch}=state ||{};
    const {localhost}= state || 'localhost:3000';
    return (
        <div>
        <div>
            <h1>Disbursement and Mobilization</h1>
            <ChartComponent branch={branch.slice(0,3)} localhost={localhost} /> 
        </div>
        <div>
        <h1>Income and Expense</h1>
        <ChartComponentPie branch={branch.slice(0,3)} localhost={localhost} /> 
    </div>
    </div>
    );
};

export default Dispalychart ;
