import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import {LineChart} from 'react-native-chart-kit';
import Orientation from 'react-native-orientation-locker';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import * as Keychain from 'react-native-keychain';
import {useNavigation} from '@react-navigation/native';
import styles from '../styles';

const ProgressScreen = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orientation, setOrientation] = useState('PORTRAIT');
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://fitness.bernsonfamily.net/totals',
        );
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

    const handleOrientationChange = orientation => {
      setOrientation(orientation);
    };

    Orientation.addOrientationListener(handleOrientationChange);

    const checkIfSignedIn = async () => {
      const token = await Keychain.getGenericPassword();
      if (token) {
        try {
          const userInfo = await GoogleSignin.signInSilently();
          setUser(userInfo);
        } catch (error) {
          console.error('Failed to sign in silently', error);
        }
      }
    };
    checkIfSignedIn();

    return () => {
      Orientation.removeOrientationListener(handleOrientationChange);
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      await Keychain.setGenericPassword('userToken', userInfo.idToken);
      setUser(userInfo);
    } catch (error) {
      console.error('Error signing in', error);
    }
  };

  const renderGraph = () => {
    if (!data || !data.Exercises) {
      return null;
    }

    const exerciseLabels = Object.keys(data.Exercises);
    const datasets = exerciseLabels.map((exercise, index) => {
      const details = data.Exercises[exercise];
      return {
        label: exercise,
        data: details['Daily Counts'].split(',').map(Number),
        color: (opacity = 1) => {
          switch (exercise) {
            case 'Pullup':
              return `rgba(255, 0, 0, ${opacity})`; // Red
            case 'Pushup':
              return `rgba(0, 255, 0, ${opacity})`; // Green
            case 'Squat':
              return `rgba(128, 0, 128, ${opacity})`; // Purple
            case 'HSPU':
              return `rgba(255, 215, 0, ${opacity})`; // Gold
            default:
              return `rgba(0, 0, 0, ${opacity})`; // Black
          }
        },
        strokeWidth: 2,
      };
    });

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    return (
      <LineChart
        data={{
          labels: [], // Remove the labels from the bottom
          datasets,
          legend: exerciseLabels, // Add legend
        }}
        width={screenHeight - 16} // Set width dynamically based on screen width with padding
        height={screenWidth - 100} // Set height dynamically based on screen height with padding
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
            r: '0', // Hide dots
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
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
    return <View style={{flex: 1, padding: 8}}>{renderGraph()}</View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Todd Bernson's 2024 Fitness Goals Dashboard
        </Text>
        <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
        <View style={styles.stats}>
          <Text style={styles.statText}>
            Current Day of Year: {data['Current Day of Year']}
          </Text>
          <Text style={styles.statText}>
            Percent Year Complete: {data['Percent Year Complete']}%
          </Text>
        </View>
      </View>

      {data.Exercises &&
        Object.entries(data.Exercises).map(([exercise, details]) => (
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

      <View style={styles.signInButtonContainer}>
        {!user ? (
          <Button
            title="Sign in with Google to Insert"
            onPress={signInWithGoogle}
          />
        ) : (
          <Button
            title="Go to Insert Page"
            onPress={() => navigation.navigate('Insert')}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default ProgressScreen;
