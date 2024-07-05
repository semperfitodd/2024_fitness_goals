import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import * as Keychain from 'react-native-keychain';
import HomeScreen from './screens/HomeScreen';
import ProgressScreen from './screens/ProgressScreen';
import InsertScreen from './screens/InsertScreen';
import SignInScreen from './screens/SignInScreen';

const Stack = createNativeStackNavigator();

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: '563495771993-ju3shfmbkkf0lq891f2fuptst7vog9c6.apps.googleusercontent.com',
    });

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
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Progress">
        <Stack.Screen name="Progress" component={ProgressScreen} />
        <Stack.Screen name="Insert" component={InsertScreen} />
        {!user ? (
          <Stack.Screen name="SignIn" component={SignInScreen} />
        ) : null}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
