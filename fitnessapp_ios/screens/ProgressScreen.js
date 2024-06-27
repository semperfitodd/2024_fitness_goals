import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View, Dimensions } from 'react-native';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';
import Orientation from 'react-native-orientation-locker';
import styles from '../styles'; // Import styles from styles.js

const ProgressScreen = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orientation, setOrientation] = useState('PORTRAIT');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://fitness.bernsonfamily.net/totals');
        setData(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const handleOrientationChange = (orientation) => {
      setOrientation(orientation);
    };

    Orientation.addOrientationListener(handleOrientationChange);

    return () => {
      Orientation.removeOrientationListener(handleOrientationChange);
    };
  }, []);

  const renderGraph = () => {
    if (!data || !data.Exercises) return null;

    const exerciseLabels = Object.keys(data.Exercises);
    const datasets = exerciseLabels.map((exercise, index) => {
      const details = data.Exercises[exercise];
      return {
        label: exercise,
        data: details['Daily Counts'].split(',').map(Number),
        color: (opacity = 1) => `rgba(${index * 60}, ${index * 120}, ${index * 180}, ${opacity})`,
        strokeWidth: 2,
      };
    });

    return (
      <LineChart
        data={{
          labels: Array.from({ length: datasets[0].data.length }, (_, i) => i + 1),
          datasets,
        }}
        width={Dimensions.get('window').height} // Use height for width in landscape
        height={Dimensions.get('window').width - 100} // Adjusting the height to fit better
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#f4f6f8',
          backgroundGradientTo: '#f4f6f8',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(34, 202, 236, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(34, 202, 236, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#1e69de',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
          position: 'absolute', // Ensure the chart takes up the full screen
          top: 0,
          left: 0,
          width: Dimensions.get('window').height,
          height: Dimensions.get('window').width - 100,
          transform: [{ rotate: '90deg' }], // Rotate the chart to fit the landscape view
        }}
      />
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e69de" />
        <Text style={styles.loadingText}>Todd's 2024 Fitness Goals App</Text>
        <Text style={styles.footerText}>by Todd Bernson</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT') {
    return (
      <View style={styles.landscapeContainer}>
        <View style={styles.graphContainer}>{renderGraph()}</View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Todd Bernson's 2024 Fitness Goals Dashboard</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
        <View style={styles.stats}>
          <Text style={styles.statText}>Current Day of Year: {data['Current Day of Year']}</Text>
          <Text style={styles.statText}>Percent Year Complete: {data['Percent Year Complete']}%</Text>
        </View>
      </View>

      {data.Exercises && Object.entries(data.Exercises).map(([exercise, details]) => (
        <View key={exercise} style={styles.card}>
          <Text style={styles.exerciseName}>{exercise}</Text>
          <View style={styles.exerciseDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total:</Text>
              <Text style={styles.detailValue}>{details.Total}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Days Missed:</Text>
              <Text style={styles.detailValue}>{details['Days Missed']}</Text>
            </View>
          </View>
        </View>
      ))}

      <Text style={styles.rotateText}>Rotate to view graph</Text>
    </ScrollView>
  );
};

export default ProgressScreen;
