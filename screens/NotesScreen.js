import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, Pressable, Alert, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ListItem from "../components/ListItem";
import ResetAsyncStorageButton from '../components/ResetAsyncStorageButton';
import { NotesContext } from "../context/NotesContext";
import MasonryList from '@react-native-seoul/masonry-list';



const NotesScreen = ({ navigation, route }) => {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState('');
  const [direction, setDirection] = useState('down');
  const [selectedNotes, setSelectedNotes] = useState([]);
  const notesCtx = useContext(NotesContext);

  // useEffect(() => {
  //   // Set the initial value only if notes are not already set
  //   if (notes.length != notesCtx.notes.length || notes.length == 0) {
  //     setNotes(notesCtx.notes);
  //   }
  // }, [notesCtx.notes]);

  useEffect(() => {
    setNotes(notesCtx.notes);
  }, [notesCtx.notes]);

  // deletion logic: long press, select one/more
  // add conditional logic for the delete button
  // press delete, show alert to confirm
  // tweak context delete function to accept multiple
  // note deletion

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>All notes</Text>
          {direction == 'down' ? (
            <TouchableOpacity style={styles.arrow} onPress={() => setDirection('up')}>
              <MaterialCommunityIcons name="arrow-down-drop-circle" size={22} color="black" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.arrow} onPress={() => setDirection('down')}>
              <MaterialCommunityIcons name="arrow-up-drop-circle" size={22} color="black" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="file-search-outline"
            size={24}
            color="black"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={(searchTerm) => setText(searchTerm)}
            placeholder="Search notes"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* <FlatList
        data={notes.filter((note) =>
          note.title.toLowerCase().includes(text.toLowerCase()) || note.text.toLowerCase().includes(text.toLowerCase())
        )}
        renderItem={({ item }) => (
          <ListItem item={item} key={item.id} />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      /> */}

      <FlatList
        refreshing={false}
        onRefresh={false}
        showsVerticalScrollIndicator={false}
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem
            item={item}
            key={item.id}
            onPress={() => {
              if (item) {
                navigation.navigate("NoteEditScreen", item);
                console.log(`Item id: ${item.id}`);
              } else {
                navigation.navigate("NoteEditScreen");
              }
            }} />
        )}
      />

      <ResetAsyncStorageButton />

      <TouchableOpacity
        style={styles.addButtonContainer}
        onPress={() => navigation.navigate("NoteEditScreen")}
      >
        <MaterialCommunityIcons
          name="plus"
          size={32}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  headerContainer: {
    marginBottom: 16,
    marginTop: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  arrow: {
    marginLeft: 8,
    alignSelf: 'center'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F8FF',
    padding: 8,
    borderRadius: 8,
    marginTop: 8
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'blue',
    borderRadius: 50,
    padding: 12,
    elevation: 5,
  },
});

export default NotesScreen;
