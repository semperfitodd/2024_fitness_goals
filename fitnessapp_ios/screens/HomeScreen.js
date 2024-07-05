import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todd Bernson's Fitness App</Text>
      <Button
        title="Progress"
        onPress={() => navigation.navigate('Progress')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f6f8',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#2c3e50',
  },
});

export default HomeScreen;
