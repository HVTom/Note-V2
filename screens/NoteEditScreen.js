import React, { useState, useEffect, useContext, useCallback } from "react";
import { View, Text, TouchableOpacity, TextInput, Alert, Share, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NotesContext } from "../context/NotesContext";


const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const NoteEditScreen = ({ navigation }) => {
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [time, setTime] = useState({ day: 0, month: '', hour: 0, minutes: 0 });
  const [text, setText] = useState('');

  const notesCtx = useContext(NotesContext);
  const route = useRoute();

  const getFormattedTime = () => {
    const date = new Date();
    const month = months[date.getMonth()];
    const formattedTime = {
      day: date.getDate(),
      month: month,
      hour: date.getHours(),
      minutes: date.getMinutes(),
    };

    return formattedTime;
  }

  useEffect(() => {
    setTime(getFormattedTime());

    if (route.params) {
      const { id, title, time, text } = route.params || {};
      setId(id || '');
      setTitle(title || '');
      setTime(time || getFormattedTime());
      setText(text || '');
    } else {
      const randomNumber = Math.floor(Math.random() * 1000000);
      setId(randomNumber.toString());
    }
  }, [route.params]);


  const updateNote = () => {
    const editedNote = {
      id: id,
      title: title,
      time: getFormattedTime(),
      text: text
    }

    notesCtx.updateNote(editedNote, id);
    console.log('Note updated through context:', editedNote);
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setTime(getFormattedTime());
            if (route.params) {
              updateNote();
            } else {
              saveNote();
            }
            navigation.navigate("NotesScreen");
          }}
          style={{ marginRight: 16 }}
        >
          <MaterialCommunityIcons
            name="sticker-check-outline"
            size={24} color="black" />
        </TouchableOpacity>
      )
    });
  }, [navigation, title, text]);

  async function saveNote() {
    try {
      const formattedTime = getFormattedTime();

      if (title.trim() !== '' || text.trim() !== '') {
        const newNote = { id, title, time: formattedTime, text };
        notesCtx.addNote(newNote);
        console.log('Note added through context:', newNote); // Log the updated notes
      } else {
        console.log('Note not saved: Title and text empty.');
        console.log(`Timestamp: ${formattedTime.day} ${formattedTime.month}, ${formattedTime.hour}:${formattedTime.minutes < 10 ? '0' : ''}${formattedTime.minutes}`);
      }
    } catch (error) {
      console.log('Error saving note: ', error);
    }
  }


  const shareNote = async (text) => {
    try {
      await Share.share({
        message: `${title}\n${text}`
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };



  async function deleteNote(id) {
    try {
      Alert.alert('', 'Delete this note?', [
        {
          text: 'CANCEL',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'DELETE',
          onPress: () => {
            notesCtx.removeNote(id);
            navigation.goBack();
          }
        },
      ]);
    } catch (error) {
      console.log('Error deleting note: ', error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TextInput
          value={title}
          onChangeText={setTitle}
          style={styles.titleText}
          placeholder="Title"
        />
        <Text style={styles.timeText}>{time.day} {time.month}, {time.hour}:{time.minutes < 10 ? '0' : ''}{time.minutes}</Text>
      </View>
      <TextInput
        value={text}
        onChangeText={setText}
        style={styles.noteText}
        multiline={true}
      />
      <View style={styles.commandBar}>
        <TouchableOpacity onPress={() => shareNote(text)}>
          <MaterialCommunityIcons
            name="share-variant-outline"
            size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteNote(id)}>
          <MaterialCommunityIcons
            name="delete-outline"
            size={28} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //padding: 16
  },
  headerContainer: {
    marginBottom: 16,
    padding: 16
  },
  titleText: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 8
  },
  timeText: {
    fontSize: 12
  },
  noteText: {
    flex: 1,
    fontSize: 16,
    padding: 16,
    textAlignVertical: 'top',
    //borderColor: 'black',
    //borderWidth: 1
  },
  commandBar: {
    width: '100%',
    height: '10%',
    //borderColor: 'black',
    //borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  }
});

export default NoteEditScreen;
