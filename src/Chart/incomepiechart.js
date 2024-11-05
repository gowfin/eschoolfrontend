// PieChartComponent.js
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
// import { localhost } from '../env.js';


// Register necessary components
Chart.register(ArcElement, Tooltip, Legend);

const PieChartComponent = ({ branch,localhost }) => {
    const [chartData, setChartData] = useState({ income: 0, expense: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${localhost}/incomechart/${branch}`);
                setChartData(response.data);
            } catch (error) {
                console.error('Error fetching finance data:', error);
            }
        };

        fetchData();
    }, [branch]);

    const data = {
        labels: ['Income', 'Expense'],
        datasets: [
            {
                data: [chartData.income, chartData.expense],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            },
        ],
    };

    return (
        <div>
            <h2>Income vs Expense</h2>
            <Pie data={data} />
        </div>
    );
};

export default PieChartComponent;
