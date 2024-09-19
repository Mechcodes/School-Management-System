import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChartExample } from "../components/Chart";
import Loading from "../components/Loading";

function ClassAnalytics() {
    const { name } = useParams();
    const [classData, setClassData] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/class/getByName/${name}`,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                  },
            });
            const data = await response.json();
            setClassData(data);
        } catch (error) {
            // Handle error
        }
    }

    if (!classData) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loading />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 flex flex-col md:flex-row gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 shadow-lg flex-1">
                <h1 className="text-4xl font-bold mb-4 text-blue-700">Class Analytics</h1>
                <p className="mb-2 text-blue-600"><span className="font-semibold">Name:</span> {classData.name}</p>
                <p className="mb-2 text-blue-600"><span className="font-semibold">Year:</span> {classData.year}</p>
                <p className="mb-2 text-blue-600"><span className="font-semibold">Total Students:</span> {classData.currentCapacity}</p>
                <p className="mb-2 text-blue-600"><span className="font-semibold">Max Capacity:</span> {classData.maxCapacity}</p>
                <p className="mb-2 text-blue-600"><span className="font-semibold">Teacher Name:</span> {classData.teacher.name}</p>
                <p className="mb-2 text-blue-600"><span className="font-semibold">Students:</span></p>
                <ul className="list-disc pl-5">
                    {classData.students.map((student, index) => (
                        <li key={student._id} className="mb-2 text-blue-500">{index + 1}. {student.name}</li>
                    ))}
                </ul>
            </div>
            <div className="flex-1 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 shadow-lg flex justify-center items-center">
                <ChartExample data={classData} />
            </div>
        </div>
    );
}

export default ClassAnalytics;
