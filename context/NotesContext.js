import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const NotesContext = createContext({
  notes: [],
  addNote: (newNote) => { },
  removeNote: (id) => { },
  removeMultipleNotes: ([ids]) => { },
  updateNote: (editedNote, id) => { }
});

const insertToStorage = async (newNote) => {
  try {
    await AsyncStorage.setItem('notes', JSON.stringify(newNote));
  } catch (error) {
    console.error('Error writing note:', error);
  }
};

const deleteFromStorage = async (id) => {
  try {
    const currentNotes = await AsyncStorage.getItem('notes');
    if (currentNotes) {
      const updatedNotes = JSON.parse(currentNotes).filter(note => note.id !== id);
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    }
  } catch (error) {
    console.error('Error deleting note:', error);
  }
};

const deleteMultipleFromStorage = async (ids) => {
  try {
    const currentNotes = await AsyncStorage.getItem('notes');
    if (currentNotes) {
      const updatedNotes = JSON.parse(currentNotes).filter(note => !ids.includes(note.id));
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    }
  } catch (error) {
    console.error('Error deleting multiple notes:', error);
  }
};

const editToStorage = async (editedNote, id) => {
  try {
    const currentNotes = await AsyncStorage.getItem('notes');
    if (currentNotes) {
      const parsedNotes = JSON.parse(currentNotes);
      const index = parsedNotes.findIndex(note => note.id === id);
      if (index != -1) {
        parsedNotes[index] = editedNote;
        await AsyncStorage.setItem('notes', JSON.stringify(parsedNotes));
      }
    }
  } catch (error) {
    console.error('Error updating note:', error);
  }
}

const NotesContextProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);

  // fetch from async storage and fill state
  useEffect(() => {
    const getData = async () => {
      try {
        const readNotes = await AsyncStorage.getItem('notes');
        const notesList = readNotes != null ? JSON.parse(readNotes) : [];
        setNotes(notesList);
      } catch (error) {
        console.error('Error reading data:', error);
        return [];
      }
    };
    getData();
  }, []);

  function addNote(newNote) {
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    insertToStorage(updatedNotes);
  }

  function removeNote(id) {
    setNotes((currentNotes) => currentNotes.filter((note) => note.id !== id));
    deleteFromStorage(id);
  }

  function removeMultipleNotes(ids) {
    const multipleNotes = notes.filter(note => !ids.includes(note.id))
    setNotes(multipleNotes);
    deleteMultipleFromStorage(ids);
  }

  function updateNote(editedNote, id) {
    setNotes((currentNotes) => {
      const index = currentNotes.findIndex((note) => note.id === id);
      if (index != -1) {
        const updatedNotes = [...currentNotes];
        updatedNotes[index] = editedNote;
        return updatedNotes;
      }
      return currentNotes;
    })
    editToStorage(editedNote, id);
  }


  const value = {
    notes: notes,
    addNote: addNote,
    removeNote: removeNote,
    removeMultipleNotes: removeMultipleNotes,
    updateNote: updateNote
  }


  return (
    <NotesContext.Provider value={value} >
      {children}
    </NotesContext.Provider>
  );
}


export default NotesContextProvider;