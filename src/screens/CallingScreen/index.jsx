import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ImageBackground,
  NativeModules,
  NativeEventEmitter,
  Image,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather'; // You can use any icon library you prefer
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/core';
import bg from '../../assets/images/bg-ios.jpg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

function BouncingIcon() {
  const iconSize = 40;
  const iconScale = useSharedValue(1);

  const handlePress = () => {
    // Bounce the icon using withSpring
    iconScale.value = withSpring(0.8, undefined, () => {
      // After the bounce, scale back to the original size
      iconScale.value = withSpring(1);
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: iconScale.value}],
    };
  });

  return (
    <View style={{}}>
      <TouchableOpacity onPress={handlePress}>
        <Animated.View style={animatedStyle}>
          <Feather name="phone-call" size={iconSize} color="green" />
          {/* Replace "heart" with the icon name you want to use */}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

function CallingScreen({route}): JSX.Element {
  const {PortSIPModule} = NativeModules;
  const navigation = useNavigation();
  const eventEmitter = new NativeEventEmitter(PortSIPModule);
  const [timer, setTimer] = useState(0);
  const [isCount, setIsCount] = useState(false);

  const formattedTimer = () => {
    const minutes = Math.floor(timer / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (timer % 60).toString().padStart(2, '0');
    return seconds !== '00' ? `${minutes}:${seconds}` : '';
  };

  useEffect(() => {
    eventEmitter.addListener('onInviteConnected', event => {
      // Handle the "onInviteConnected" event data here
      const {sessionId} = event;
      setIsCount(true);
      console.log('Call Connected - Session ID:', sessionId);
    });
  });

  useEffect(() => {
    let interval;
    // Start the timer
    if (isCount) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isCount]);

  const onHangUp = () => {
    PortSIPModule.hangUp(Number(route.params.sessionId))
      .then(result => {
        console.log('Call hung up successfully:', result);
        setIsCount(false);
      })
      .catch(error => {
        console.error('Failed to hang up call:', error);
      });

    navigation.navigate('Contacts', {
      user: {userName: '1080', displayName: '1080'},
    });
  };

  return (
    <ImageBackground source={bg} style={styles.bg} resizeMode="cover">
      <View style={styles.contact}>
        <Text style={styles.name}>{route.params.phoneNumber}</Text>
        <Text style={styles.timerText}>{formattedTimer()}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.iconButton}>
          <Ionicons name="ios-camera-reverse" size={30} color={'white'} />
        </View>
        <View style={styles.iconButton}>
          <MaterialIcons name="camera-off" size={30} color={'white'} />
        </View>
        <View style={styles.iconButton}>
          <MaterialIcons name="microphone-off" size={30} color={'white'} />
        </View>
        <Pressable
          style={[styles.iconButton, {backgroundColor: 'red'}]}
          onPress={onHangUp}>
          <MaterialIcons name="phone-hangup" size={30} color={'white'} />
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  contact: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 50,
    marginBottom: 15,
  },
  phoneNumber: {
    fontSize: 24,
    color: 'white',
  },
  buttonContainer: {
    backgroundColor: '#333333',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 30,
    width: '100%',
  },
  iconButton: {
    backgroundColor: '#4a4a4a',
    padding: 10,
    borderRadius: 50,
  },
  bg: {
    flex: 1,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CallingScreen;
