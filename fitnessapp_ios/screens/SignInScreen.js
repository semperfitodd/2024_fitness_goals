import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as Keychain from 'react-native-keychain';

const SignInScreen = ({ navigation }) => {
  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      await Keychain.setGenericPassword('userToken', userInfo.idToken);
      navigation.replace('Insert');
    } catch (error) {
      console.error('Error signing in', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in to access Insert</Text>
      <Button title="Sign in with Google" onPress={signInWithGoogle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default SignInScreen;
