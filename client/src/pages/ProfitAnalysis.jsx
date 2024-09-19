import React, { useState, useEffect } from 'react';
import ToggleGroup from '../components/ToggleGroup';
import MonthlyBarChart from '../components/MonthlyBarChart';
import YearlyBarChart from '../components/YearlyBarChart';
import Loading from '../components/Loading';
import { Paper, Typography, Divider } from '@mui/material';
import { teal, deepOrange } from '@mui/material/colors';

function ProfitAnalysis() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [data2, setData2] = useState(null);
    const [chartType, setChartType] = useState('month');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/teacher/getTeacherSalariesSum`);
            const response2 = await fetch(`/api/student/getStudentFeesSum`);
            const data = await response.json();
            const data2 = await response2.json();
            setData(data.sum);
            setData2(data2.sum);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChartTypeChange = (event, newChartType) => {
        setChartType(newChartType);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loading />
            </div>
        ); 
    }

    return (
        <div className="p-6 bg-gradient-to-r from-teal-100 to-blue-100 min-h-screen">
            <Paper elevation={3} className="p-6 bg-white rounded-lg shadow-lg">
                <Typography variant="h4" color={teal[800]} className="font-bold mb-4">
                    Profit Analysis
                </Typography>
                <Divider style={{ backgroundColor: deepOrange[500] }} className="mb-4" />
                <ToggleGroup value={chartType} onChange={handleChartTypeChange} />
                <div className="mt-6">
                    {chartType === 'month' ? (
                        <MonthlyBarChart sum={data} fees={data2} />
                    ) : (
                        <YearlyBarChart sum={data} fees={data2} />
                    )}
                </div>
            </Paper>
        </div>
    );
}

export default ProfitAnalysis;
