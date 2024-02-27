import React, {useEffect, useState} from 'react';
import firebaseConfig from './firebaseConfig';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import InsertForm from './InsertForm';
import axios from 'axios';
import {Line} from 'react-chartjs-2';
import './App.css';
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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
    const [user, setUser] = useState(null);

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
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && user.email === 'todd@bernsonfamily.com') {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        fetchData();

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider);
    };

    const handleSignOut = () => {
        signOut(auth);
    };

    const renderTable = () => {
        if (!data || !data.Exercises) return <p>No data available.</p>;

        const exercises = Object.entries(data.Exercises).map(([exercise, details]) => {
            const completedSinceStart = {
                'Pullup': 25177 + details.Total, // 2023 value for pullups
                'Pushup': 50354 + details.Total, // 2023 value for pushups
                'Squat': 'N/A', // Placeholder for squats
                'HSPU': 'N/A' // Placeholder for HSPU
            };

            return (
                <tr key={exercise}>
                    <td><b>{exercise}</b></td>
                    <td>{details.Total}</td>
                    <td>{details['Percent Exercise Complete']}%</td>
                    <td>{details['Yearly Goal']}</td>
                    <td>{details['Days Missed']}</td>
                    <td>{completedSinceStart[exercise]}</td>
                </tr>
            );
        });

        return (
            <table>
                <thead>
                <tr>
                    <th>Exercise</th>
                    <th>2024 Total</th>
                    <th>2024 % Complete</th>
                    <th>2024 Goal</th>
                    <th>Days Missed</th>
                    <th>Completed since Jan 1, 2023</th>
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
            labels: Array.from({length: datasets[0].data.length}, (_, i) => i + 1),
            datasets,
        };

        return <Line data={graphData}/>;
    };

    const formatDate = () => {
        const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
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
                {isLoading ? <p>Loading graph...</p> : error ?
                    <p>Error fetching data for graph.</p> : renderLineGraph()}
                {user ? (
                    <>
                        <InsertForm onSuccessfulInsert={fetchData}/>
                        <button onClick={handleSignOut}>Sign out</button>
                    </>
                ) : (
                    <button onClick={signInWithGoogle}>Sign in with Google</button>
                )}
            </header>
        </div>
    );
}

export default App;