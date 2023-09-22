import React, {useState, useEffect} from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  SafeAreaView,
  View,
  TouchableOpacity,
  NativeModules,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import Feather from 'react-native-vector-icons/Feather';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
function AnimatedLogo() {
  const logoScale = useSharedValue(1);

  const logoScaleStart = () => {
    logoScale.value = logoScale.value === 1 ? 0.8 : 1;
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: logoScale.value}],
    };
  });

  useEffect(() => {
    logoScaleStart();
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Animated.View style={animatedStyle}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={{width: 150, height: 150}}
        />
      </Animated.View>
    </View>
  );
}
function LoginScreen(): JSX.Element {
  const navigation = useNavigation();
  const [isDisabled, setIsDisabled] = useState(false);
  const [initializeStatus, setInitializeStatus] = useState('');
  const {PortSIPModule} = NativeModules;
  const [formData, setFormData] = useState({
    userName: '',
    displayName: '',
    authName: '',
    password: '',
    userDomain: '',
    SIPServer: '',
    SIPServerPort: '', // Replace with your SIP server port
    localSIPPort: '',
    dnsServers: '',
  });

  const onInputChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  const inputFields = [
    {name: 'userName', label: 'UserName', placeholder: 'Enter UserName'},
    {
      name: 'displayName',
      label: 'DisplayName',
      placeholder: 'Enter DisplayName',
    },
    {name: 'authName', label: 'AuthName', placeholder: 'Enter AuthName'},
    {
      name: 'password',
      label: 'Password',
      placeholder: 'Enter Password',
      secureTextEntry: true,
    },
    {name: 'userDomain', label: 'UserDomain', placeholder: 'Enter UserDomain'},
    {name: 'SIPServer', label: 'SIPServer', placeholder: 'Enter SIPServer'},
    {
      name: 'SIPServerPort',
      label: 'SIPServerPort',
      placeholder: 'Enter SIPServerPort',
      keyboardType: 'numeric',
    },
    {
      name: 'localSIPPort',
      label: 'LocalSIPPort',
      placeholder: 'Enter LocalSIPPort',
      keyboardType: 'numeric',
    },
    {name: 'dnsServers', label: 'DNSServers', placeholder: 'Enter DNSServers'},
  ];

  const onInit = () => {
    PortSIPModule.initialize(formData)
      .then((response: any) => {
        console.log(response); // Successfully initialized and registered
        navigation.navigate('Contacts', {user: formData});
        setInitializeStatus(response);
      })
      .catch((error: any) => {
        setInitializeStatus(error);
        console.error(error); // Error message if initialization or registration fails
      });
  };

  return (
    <SafeAreaView style={styles.bg}>
      <AnimatedLogo />
      <View>
        {inputFields.map(field => (
          <View style={styles.rowInput} key={field.name}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              value={formData[field.name]}
              onChangeText={value => onInputChange(field.name, value)}
              style={styles.input}
              placeholder={field.placeholder}
              secureTextEntry={field.secureTextEntry}
              keyboardType={field.keyboardType}
            />
          </View>
        ))}
      </View>
      <TouchableOpacity
        onPress={onInit}
        style={[
          styles.appButtonContainer,
          isDisabled && styles.appButtonDisabled,
        ]}
        disabled={isDisabled}>
        <Text style={styles.appButtonText}>register</Text>
      </TouchableOpacity>
      <Text style={{color: 'white', textAlign: 'center', marginTop: 20}}>
        {initializeStatus}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: 'black',
    height: '100%',
  },
  input: {
    backgroundColor: '#353635',
    padding: 10,
    borderRadius: 5,
    color: 'white',
    width: 220,
  },
  rowInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'center',
  },
  label: {
    color: 'white',
    fontWeight: 'bold',
    width: 120,
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: '#43995a',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 20,
    marginHorizontal: 90,
  },
  appButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
});

export default LoginScreen;
