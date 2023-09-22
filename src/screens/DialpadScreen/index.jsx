import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  NativeModules,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import bg from '../../assets/images/bg-ios.jpg';
import Feather from 'react-native-vector-icons/Feather';
import TabsScreen from '../tabsScreen/index';
import {useNavigation} from '@react-navigation/core';

function DialpadScreen(): JSX.Element {
  const [phoneNumber, setPhoneNumber] = useState('');
  const {PortSIPModule} = NativeModules;
  const [sessionId, setSessionId] = useState();
  const navigation: any = useNavigation();

  const handleNumberPress = (number: string) => {
    setPhoneNumber(prevPhoneNumber => prevPhoneNumber + number);
  };

  const numberButtons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#'],
  ];
  const handleCallPress = () => {

    PortSIPModule.makeCall(phoneNumber, true, false)
      .then((sessionId: any) => {
        setSessionId(sessionId);
        navigation.navigate('Calling',{sessionId,phoneNumber});
      })
      .catch((error: any) => {
        console.error('Call initiation failed:', error);
      });
  };

  const removeNumber = () => {
    setPhoneNumber(phoneNumber.substring(0, phoneNumber.length - 1));
  };

  return (
    <ImageBackground source={bg} style={styles.bg} resizeMode="cover">
      <SafeAreaView>
        <TextInput
          style={styles.inputNumber}
          onChangeText={setPhoneNumber}
          value={phoneNumber}
        />
        <View>
          {numberButtons.map((row, rowIndex) => (
            <View
              key={rowIndex}
              style={{flexDirection: 'row', justifyContent: 'center'}}>
              {row.map(number => (
                <TouchableOpacity
                  key={number}
                  onPress={() => handleNumberPress(number)}>
                  <View style={styles.Button}>
                    <Text style={styles.buttonText}>{number}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
        <View style={styles.iconsContainer}>
          <TouchableOpacity
            style={styles.iconButtonContainer}
            onPress={handleCallPress}>
            <Ionicons name="md-call-outline" size={30} color={'white'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginLeft: 40}}
            onPress={() => removeNumber()}>
            <Feather name="delete" size={30} color={'white'} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <TabsScreen />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  inputNumber: {
    fontSize: 26,
    margin: 30,
    marginTop: 65,
    paddingLeft: 20,
    textAlign: 'center',
    color: 'white',
  },

  buttonText: {
    fontSize: 28,
    color: 'white',
    paddingLeft: 9,
    paddingRight: 9,
  },
  iconsContainer: {
    alignItems: 'center',
    marginVertical: 30,
    margin: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 70,
  },
  iconButtonContainer: {
    backgroundColor: 'green',
    padding: 18,
    borderRadius: 50,
  },
  Button: {
    marginTop: 15,
    backgroundColor: '#4a4a4a',
    margin: 10,
    padding: 18,
    borderRadius: 50,
  },
  bg: {
    height: '100%',
    paddingBottom: 25,
    backgroundColor: 'black',
  },
});

export default DialpadScreen;
