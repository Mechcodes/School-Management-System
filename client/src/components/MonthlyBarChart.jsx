import React, { useState } from "react";
import { AgChartsReact } from "ag-charts-react";

const MonthlyBarChart = ({ sum, fees }) => {
  const profit = fees - sum;

  const [options, setOptions] = useState({
    title: {
      text: "Monthly Profit Analysis",
      fontSize: 18,
      fontWeight: "bold",
    },
    subtitle: {
      text: "In Rupees",
      fontSize: 14,
      fontStyle: "italic",
    },
    data: [{
      month: "Total",
      SalaryofTeachers: sum,
      FeesReceived: fees,
      ProfitEarned: profit,
    }],
    series: [
      {
        type: "bar",
        xKey: "month",
        yKey: "SalaryofTeachers",
        yName: "Salary of Teachers",
        fill: "rgba(255, 99, 132, 0.6)",
        stroke: "rgba(255, 99, 132, 1)",
        shadow: true,
      },
      {
        type: "bar",
        xKey: "month",
        yKey: "FeesReceived",
        yName: "Fees Received",
        fill: "rgba(54, 162, 235, 0.6)",
        stroke: "rgba(54, 162, 235, 1)",
        shadow: true,
      },
      {
        type: "bar",
        xKey: "month",
        yKey: "ProfitEarned",
        yName: "Profit Earned",
        fill: "rgba(75, 192, 192, 0.6)",
        stroke: "rgba(75, 192, 192, 1)",
        shadow: true,
      }
    ],
    axes: [
      {
        type: "category",
        position: "bottom",
        title: {
          text: "Month",
          fontSize: 14,
        },
      },
      {
        type: "number",
        position: "left",
        title: {
          text: "Amount",
          fontSize: 14,
        },
      }
    ],
    tooltip: {
      enabled: true,
      format: "{value} Rupees",
      fontSize: 12,
      borderWidth: 1,
      borderColor: "#ddd",
      backgroundColor: "#fff",
    },
    legend: {
      position: "bottom",
      item: {
        fontSize: 14,
      },
    },
  });

  return (
    <div style={{ width: "70%", margin: "0 auto" }}> 
      <AgChartsReact options={options} />
    </div>
  );
};

export default MonthlyBarChart;
