import React, {useState, useEffect} from 'react';
import {
  Text,
  FlatList,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  SafeAreaView,
  NativeModules,
  NativeEventEmitter,
  Image,
} from 'react-native';
import dummyContacts from '../../assets/data/contacts.json';
import {useNavigation} from '@react-navigation/core';
import TabsScreen from '../tabsScreen/index';

function ContactsScreen({route}): JSX.Element {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterContacts, setFilteredContacts] = useState(dummyContacts);
  const {PortSIPModule} = NativeModules;
  const eventEmitter = new NativeEventEmitter(PortSIPModule);

  const listenForInviteRingingEvent = () => {
    eventEmitter.addListener('onInviteIncomingEvent', event => {
      console.log('Incoming Call Event:', event);
      navigation.navigate('Incoming', {
        sessionId: event.sessionId,
        callerDisplayName: event.callerDisplayName,
      });
    });
    eventEmitter.addListener('onReferAccepted', event => {
      // Handle the "onReferAccepted" event data here
      const {sessionId} = event;
      console.log('Refer Accepted - Session ID:', sessionId);
    });

    // Listen to the "onReferRejected" event
    eventEmitter.addListener('onReferRejected', event => {
      // Handle the "onReferRejected" event data here
      const {sessionId, reason, code} = event;
      console.log(
        'Refer Rejected - Session ID:',
        sessionId,
        'Reason:',
        reason,
        'Code:',
        code,
      );
    });

    eventEmitter.addListener('onInviteFailure', event => {
      // Handle the "onInviteFailure" event data here
      const {sessionId, reason, code, sipMessage} = event;
      console.log(
        'Call Failure - Session ID:',
        sessionId,
        'Reason:',
        reason,
        'Code:',
        code,
        'SIP Message:',
        sipMessage,
      );
    });
  };

  useEffect(() => {
    const newContacts = dummyContacts.filter(contact =>
      contact.user_display_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );
    setFilteredContacts(newContacts);
  }, [searchTerm]);

  useEffect(() => {
    listenForInviteRingingEvent();
  });

  const callUser = user => {
    const number = user.user_name;
    PortSIPModule.makeCall(number, true, false)
      .then(sessionId => {
        navigation.navigate('Calling', {sessionId, phoneNumber: number});
      })
      .catch(error => {
        console.error('Call initiation failed:', error);
      });
  };

  return (
    <SafeAreaView style={styles.page}>
      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.searchInput}
      />

      <View style={styles.myProfile}>
        <Image
          style={styles.myImageProfile}
          source={require('../../assets/images/profile.png')}
        />
        <View style={styles.contactMyProfile}>
          <Text style={styles.myName}>{route.params.user.displayName}</Text>
          <Text style={styles.myPhone}>{route.params.user.userName}</Text>
        </View>
      </View>

      <FlatList
        data={filterContacts}
        renderItem={({item}) => (
          <Pressable style={styles.list} onPress={() => callUser(item)}>
            <Image
              style={styles.imageProfile}
              source={require('../../assets/images/profile.png')}
            />
            <Text style={styles.contactName}>{item.user_display_name}</Text>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <TabsScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 15,
    backgroundColor: 'black',
    height: '100%',
  },
  contactName: {
    fontSize: 18,
    marginVertical: 10,
    color: 'white',
  },
  initialize: {
    fontSize: 18,
    marginVertical: 10,
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  searchInput: {
    backgroundColor: '#353635',
    padding: 10,
    borderRadius: 5,
    marginTop: 35,
    color: 'white',
  },
  imageProfile: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  list: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  myProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  myName: {
    color: 'white',
    fontSize: 22,
  },
  myPhone: {
    color: 'white',
    fontSize: 18,
  },
  myImageProfile: {
    width: 70,
    height: 70,
  },
  contactMyProfile: {
    paddingLeft: 15,
  },
});

export default ContactsScreen;
