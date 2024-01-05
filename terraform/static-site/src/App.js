import React, { useEffect, useState } from 'react';
import InsertForm from './InsertForm';
import { initializeAnalytics } from './GoogleAnalytics'; // Import the function
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import './App.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = '/totals';

function App() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define fetchData function
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL);
      setData(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    initializeAnalytics();
  }, []);

  const renderTable = () => {
    if (!data || !data.Exercises) return <p>No data available.</p>;

    const exercises = Object.entries(data.Exercises).map(([exercise, details]) => (
        <tr key={exercise}>
          <td><b>{exercise}</b></td>
          <td>{details.Total}</td>
          <td>{details['Percent Exercise Complete']}%</td>
          <td>{(details['Ahead of Schedule']).toFixed(2)}%</td>
          <td>{details['Yearly Goal']}</td>
          <td>{details['Days Missed']}</td>
        </tr>
    ));

    return (
        <table>
        <thead>
        <tr>
          <th>Exercise</th>
          <th>Total Completed</th>
          <th>Percent Complete</th>
          <th>Ahead of Schedule</th>
          <th>Yearly Goal</th>
          <th>Days Missed</th>
        </tr>
        </thead>
          <tbody>
          {exercises}
        </tbody>
      </table>
    );
  };

  const renderLineGraph = () => {
    if (!data || !data.Exercises) return <p>No graph data available.</p>;

    const datasets = Object.entries(data.Exercises).map(([exercise, details], index) => ({
      label: exercise,
      data: details['Daily Counts'].split(',').map(Number),
      borderColor: `hsl(${index * 137}, 70%, 50%)`,
      fill: false,
    }));

    const graphData = {
      labels: Array.from({ length: datasets[0].data.length }, (_, i) => i + 1),
      datasets,
    };

    return <Line data={graphData} />;
  };

  const formatDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Todd Bernson's 2024 Fitness Goals Dashboard</h1>
        <h2>{formatDate()}</h2>
        <p>Current Day of Year: {data?.['Current Day of Year']}</p>
        <p>Percent Year Complete: {data?.['Percent Year Complete']}%</p>
        {isLoading ? <p>Loading...</p> : error ? <p>Error fetching data.</p> : renderTable()}
        {isLoading ? <p>Loading graph...</p> : error ? <p>Error fetching data for graph.</p> : renderLineGraph()}
        <InsertForm onSuccessfulInsert={fetchData} />
      </header>
    </div>
  );
}

export default App;
