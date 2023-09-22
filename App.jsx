import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import Navigation from './src/navigation';

function App(): JSX.Element {
  return (
    <>
      <StatusBar barStyle={'dark-content'} />
      <Navigation />
    </>
  );
}

const styles = StyleSheet.create({});

export default App;
