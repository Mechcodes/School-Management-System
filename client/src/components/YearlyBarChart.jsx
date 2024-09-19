import React, { useState } from "react";
import { AgChartsReact } from "ag-charts-react";

const YearlyBarChart = ({ sum, fees }) => {
  const profit = fees - sum;

  const [options, setOptions] = useState({
    title: {
      text: "Yearly Profit Analysis",
      fontSize: 20,
      fontWeight: "bold",
      color: "#333",
    },
    subtitle: {
      text: "In Rupees",
      fontSize: 16,
      fontStyle: "italic",
      color: "#555",
    },
    data: [{
      quarter: "Total",
      SalaryofTeachers: 12 * sum,
      FeesReceived: 12 * fees,
      ProfitEarned: 12 * profit,
    }],
    series: [
      {
        type: "bar",
        xKey: "quarter",
        yKey: "SalaryofTeachers",
        yName: "Salary of Teachers",
        fill: "rgba(255, 99, 132, 0.6)",
        stroke: "rgba(255, 99, 132, 1)",
        shadow: true,
      },
      {
        type: "bar",
        xKey: "quarter",
        yKey: "FeesReceived",
        yName: "Fees Received",
        fill: "rgba(54, 162, 235, 0.6)",
        stroke: "rgba(54, 162, 235, 1)",
        shadow: true,
      },
      {
        type: "bar",
        xKey: "quarter",
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
          text: "Category",
          fontSize: 14,
          color: "#333",
        },
      },
      {
        type: "number",
        position: "left",
        title: {
          text: "Amount",
          fontSize: 14,
          color: "#333",
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
        color: "#333",
      },
    },
  });

  return (
    <div style={{ width: "70%", margin: "0 auto" }}> 
      <AgChartsReact options={options} />
    </div>
  );
};

export default YearlyBarChart;
