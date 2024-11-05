// ChartComponent.js
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
// import { localhost } from '../env.js';
const {localhost}= state || 'localhost:3000'

// Register necessary components
Chart.register(CategoryScale, LinearScale, BarElement, Title);

const ChartComponent = ({ branch }) => {
    const [chartData, setChartData] = useState({ disbursement: [], mobilized: [] });
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${localhost}:5000/api/chart/${branch}`);
                setChartData(response.data);
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };

        fetchData();
    }, [branch]);

    const data = {
        labels: chartData.disbursement.map(item => item.MonthDisb),
        datasets: [
            {
                label: 'Disbursement',
                data: chartData.disbursement.map(item => item.disbursement),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Mobilized',
                data: chartData.mobilized.map(item => item.mobilized),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
            },
        ],
    };

    // Effect to create the chart instance
    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            // Destroy the existing chart instance if it exists
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            chartInstanceRef.current = new Chart(ctx, {
                type: 'bar',
                data: data,
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Loan Disbursement and Mobilization',
                        },
                    },
                },
            });
        }

        // Cleanup function to destroy chart on component unmount
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [data]);

    return (
        <div>
            <h2>Loan Disbursement and Mobilization</h2>
            <canvas ref={chartRef} />
        </div>
    );
};

export default ChartComponent;
