import React from 'react';
import ContactsScreen from '../screens/ContactsScreen';
import CallingScreen from '../screens/CallingScreen';
import IncomingScreen from '../screens/IncomingCallSrceen';
import {NavigationContainer} from '@react-navigation/native';
import DialpadScreen from '../screens/DialpadScreen';
import LoginScreen from '../screens/LoginScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
function Navigation(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Group screenOptions={{headerShown: false}}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Contacts" component={ContactsScreen} />
          <Stack.Screen name="Incoming" component={IncomingScreen} />
          <Stack.Screen name="Calling" component={CallingScreen} />
          <Stack.Screen name="Dialpad" component={DialpadScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
