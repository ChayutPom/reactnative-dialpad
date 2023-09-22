import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  NativeModules,
} from 'react-native';
import bg from '../../assets/images/bg-ios.jpg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/core';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

const Ring = ({delay}) => {
  const ring = useSharedValue(0);

  const ringStyle = useAnimatedStyle(() => {
    return {
      opacity: 0.8 - ring.value,
      transform: [
        {
          scale: interpolate(ring.value, [0, 1], [0, 4]),
        },
      ],
    };
  });
  useEffect(() => {
    ring.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: 4000,
        }),
        -1,
        false,
      ),
    );
  }, []);
  return <Animated.View style={[styles.ring, ringStyle]} />;
};

function IncomingScreen({route}): JSX.Element {
  const {PortSIPModule} = NativeModules;
  const navigation: any = useNavigation();

  const onAnswer = () => {
    PortSIPModule.answerCall(Number(route.params.sessionId), false)
      .then((sessionId: any) => {
        console.log('Call initiated successfully with sessionId:', sessionId);
        navigation.navigate('Calling', {sessionId: route.params.sessionId});
      })
      .catch((error: any) => {
        console.error('Call initiation failed:', error);
      });
  };
  const onDecline = () => {
    PortSIPModule.rejectCall(Number(route.params.sessionId), 480)
      .then(result => {
        console.log('result', result);
        navigation.navigate('Contacts', {
          user: {userName: '1080', displayName: '1080'},
        });
      })
      .catch(error => {
        console.error('Error rejecting call:', error);
      });
  };
  return (
    <ImageBackground source={bg} style={styles.bg} resizeMode="cover">
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}>
        <Ring delay={0} />
        <Ring delay={1000} />
        <Ring delay={2000} />
        <Ring delay={3000} />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={[styles.dot, styles.center]}>
            {[...Array(3).keys()].map(index => {
              return (
                <View
                  from={{opacity: 1}}
                  key={index}
                  style={[StyleSheet.absoluteFillObject, styles.dot]}
                />
              );
            })}
            <Feather name="phone-incoming" size={40} color="white" />
          </View>
        </View>
      </View>
      <View style={{top: -100}}>
        <Text style={styles.name}>Incoming</Text>
        <Text style={styles.phoneNumber}>{route.params.callerDisplayName}</Text>
      </View>
      <View style={[styles.row, {marginTop: 'auto'}]}>
        <View style={styles.iconsContainer}>
          <Ionicons name="alarm" color="white" size={30} />
          <Text style={styles.iconText}>Remind me</Text>
        </View>
        <View style={styles.iconsContainer}>
          <Entypo name="message" color="white" size={30} />
          <Text style={styles.iconText}>Message</Text>
        </View>
      </View>

      <View style={styles.row}>
        <TouchableOpacity onPress={onDecline} style={styles.iconsContainer}>
          <View style={styles.iconButtonContainer}>
            <Feather name="x" color="white" size={30} />
          </View>
          <Text style={styles.iconText}>Decline</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onAnswer} style={styles.iconsContainer}>
          <View
            style={[styles.iconButtonContainer, {backgroundColor: '#2e7bff'}]}>
            <Feather name="check" color="white" size={30} />
          </View>
          <Text style={styles.iconText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 80,
    marginBottom: 15,
  },
  phoneNumber: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  iconsContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  iconText: {
    color: 'white',
    marginTop: 10,
  },
  iconButtonContainer: {
    backgroundColor: 'red',
    padding: 18,
    borderRadius: 50,
  },
  dot: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: '#19b01b',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: 'green',
    borderWidth: 10,
  },
});

export default IncomingScreen;
