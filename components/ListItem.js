import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

const monthsDict = {
  "Jan": "January", "Feb": "February", "Mar": "March", "Apr": "April",
  "May": "May", "Jun": "June", "Jul": "July", "Aug": "August",
  "Sep": "September", "Oct": "October", "Nov": "November", "Dec": "December"
};


const ListItem = ({ item }) => {
  return (
    <TouchableOpacity onPress={() => console.log(`Pressed note with id ${item.id}`)
    }>
      <View style={styles.noteContainer}>
        <Text style={styles.item}>{item.title}</Text>
        <Text style={styles.item}>{monthsDict[item.time.month]} {item.time.day}</Text>
        <Text style={styles.item}>{item.text}</Text>
      </View>
    </TouchableOpacity >
  );
};


const styles = StyleSheet.create({
  noteContainer: {
    flexDirection: 'column',
    margin: 15,
    borderRadius: 16,
    padding: 6,
    backgroundColor: '#F3F8FF'
  },
  item: {
    margin: 6
  }
});


export default ListItem;
