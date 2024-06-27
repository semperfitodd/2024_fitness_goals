import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import HomeScreen from './screens/HomeScreen';
import ProgressScreen from './screens/ProgressScreen';
import InsertScreen from './screens/InsertScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Progress" component={ProgressScreen} />
        <Stack.Screen name="Insert" component={InsertScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
