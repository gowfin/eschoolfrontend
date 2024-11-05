// App.js
import React from 'react';
import ChartComponentPie from './incomepiechart';

const Dispalychart = ({state}) => {
    const {branch}=state ||{};
    const {localhost}= state || 'localhost:3000';
    return (
        <div>
            <h1>Financial Dashboard</h1>
            <ChartComponentPie branch={branch.slice(0,3)} localhost={localhost} /> 
        </div>
    );
};

export default Dispalychart ;
