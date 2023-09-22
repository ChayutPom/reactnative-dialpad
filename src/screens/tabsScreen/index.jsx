import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function ContactsScreen(): JSX.Element {
  const navigation: any = useNavigation();

  return (
    <View style={[styles.tab]}>
      <View style={styles.separator}></View>

      <View style={styles.tabRow}>
        <Pressable
          onPress={() =>
            navigation.navigate('Contacts', {
              user: {userName: '1080', displayName: '1080'},
            })
          }>
          <MaterialIcons name="contacts-outline" size={20} color={'white'} />
        </Pressable>
        <View style={{width: 1, height: '150%', backgroundColor: '#f0f0f0'}} />
        <Pressable onPress={() => navigation.navigate('Dialpad')}>
          <MaterialIcons name="dialpad" size={20} color={'white'} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#353635',
  },
  tab: {
    marginTop: 'auto',
    backgroundColor: 'black',
  },
  tabRow: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-around',
  },
});

export default ContactsScreen;
