import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_ENDPOINT = '/insert';

const InsertForm = ({ onSuccessfulInsert }) => {
    const [exerciseData, setExerciseData] = useState({
        date: '',
        pullups: 0,
        pushups: 0,
        squats: 0
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // Track submission status

    useEffect(() => {
        setExerciseData(exerciseData => ({
            ...exerciseData,
            date: getCurrentLocalDate()
        }));
    }, []);

    const handleInputChange = (e) => {
        setExerciseData({ ...exerciseData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Set submitting status to true
    try {
        const response = await axios.post(API_ENDPOINT, exerciseData);

        if (response.status === 200) {
            setSuccessMessage('Record successfully inserted!');
            if (typeof onSuccessfulInsert === 'function') {
                onSuccessfulInsert();
            }
        } else {
            setSuccessMessage('Failed to insert record.');
        }
    } catch (error) {
        console.error('Error submitting data:', error);
        setSuccessMessage('Failed to insert record.');
    }
    setIsSubmitting(false); // Reset submitting status
};


    return (
    <div className="insert-form">
        <h3>Insert New Records</h3>
        <form onSubmit={handleSubmit}>
            <label><span>Date:</span><input type="date" name="date" value={exerciseData.date} onChange={handleInputChange} /></label>
            <label><span>Pull-ups:</span><input type="number" name="pullups" value={exerciseData.pullups} onChange={handleInputChange} /></label>
            <label><span>Push-ups:</span><input type="number" name="pushups" value={exerciseData.pushups} onChange={handleInputChange} /></label>
            <label><span>Squats:</span><input type="number" name="squats" value={exerciseData.squats} onChange={handleInputChange} /></label>
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
        </form>
        {successMessage && <p>{successMessage}</p>}
    </div>
);
};

function getCurrentLocalDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export default InsertForm;
