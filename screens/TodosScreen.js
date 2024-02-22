import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, TextInput, Modal, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Alert, ScrollView, FlatList
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TodosScreen = () => {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [direction, setDirection] = useState("down");
  const [important, setImportant] = useState("relaxed");
  const [commandVis, setCommandVis] = useState("hidden");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [scheduledDateTime, setScheduledDateTime] = useState(null);

  const textInputRef = useRef(null);

  const formatDate = (date) => {
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const formatTime = (time) => {
    const options = {
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(time).toLocaleTimeString("en-US", options);
  };

  useEffect(() => {
    if (commandVis === "shown" && textInputRef.current) {
      textInputRef.current.focus(); // focus the input when displayed
    }
  }, [commandVis]);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem("todos");
      if (storedTodos !== null) {
        const parsedTodos = JSON.parse(storedTodos).map(todo => ({
          ...todo,
          date: new Date(todo.date), // Convert string to Date
          time: new Date(todo.time), // Convert string to Date
        }));
        setTodos(parsedTodos);
      }
    } catch (error) {
      console.log("Error fetching to-dos. Error:", error);
    }
  };


  const saveTodos = async (updatedTodos) => {
    try {
      await AsyncStorage.setItem("todos", JSON.stringify(updatedTodos));
    } catch (error) {
      console.error("Error saving todos to AsyncStorage:", error);
    }
  };

  const removeTodo = (id) => {
    Alert.alert('', 'Delete todo ?', [
      {
        text: 'CANCEL',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK', onPress: () => {
          const updatedTodos = todos.filter((todo) => todo.id !== id);
          setTodos(updatedTodos);
          saveTodos(updatedTodos);
        }
      },
    ]);

  };

  const addTodo = async () => {
    if (text.trim() !== "") {
      const newTodo = {
        id: Date.now().toString(),
        text,
        important,
        date: date.toISOString(), // Convert Date to string
        time: time.toISOString(), // Convert Date to string
      };
      const updatedTodos = [...todos, newTodo];

      console.log("Saved todo: ", newTodo);
      // Save updated todos to AsyncStorage
      try {
        await AsyncStorage.setItem("todos", JSON.stringify(updatedTodos));
      } catch (error) {
        console.error("Error saving todos to AsyncStorage:", error);
      }

      setTodos(updatedTodos);

      // Reset input fields and close the modal only if there is no scheduled date and time
      if (!scheduledDateTime) {
        setText("");
        setDate(new Date());
        setTime(new Date());
        setIsModalVisible(false);
      }
    }
  };



  const handleOkPress = () => {
    addTodo();
    setCommandVis("shown");
  };


  const renderScheduledDateTime = () => {
    if (scheduledDateTime) {
      const formattedDate = formatDate(scheduledDateTime.date);
      const formattedTime = formatTime(scheduledDateTime.time);
      return (
        <View style={styles.scheduledContainer}>
          <Text style={styles.scheduledText}>
            Scheduled for: {formattedDate}, {formattedTime}
          </Text>
        </View>
      );
    }
    return null;
  };

  // separate todos based on importance
  const normalTodos = todos.filter((todo) => todo.important !== 'important');
  const importantTodos = todos.filter((todo) => todo.important === 'important')




  return (
    <TouchableWithoutFeedback
      style={{ flex: 1, flexGrow: 1 }}
      onPress={() => {
        setText("");
        setCommandVis("hidden");
        setScheduledDateTime(null);
      }}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>All to-dos</Text>
            {direction == "down" ? (
              <TouchableOpacity
                style={styles.arrow}
                onPress={() => setDirection("up")}
              >
                <MaterialCommunityIcons
                  name="arrow-down-drop-circle"
                  size={22}
                  color="black"
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.arrow}
                onPress={() => setDirection("down")}
              >
                <MaterialCommunityIcons
                  name="arrow-up-drop-circle"
                  size={22}
                  color="black"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>


        {commandVis == "hidden" ? (
          ""
        ) : (
          <View style={styles.commandBar}>
            <View style={styles.inputContainer}>
              <TextInput
                ref={textInputRef}
                style={styles.input}
                value={text}
                onChangeText={(input) => setText(input)}
                placeholder="To-do"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
              />
            </View>
            <View style={styles.rowContainer}>
              <View style={styles.iconsContainer}>
                <TouchableOpacity
                  onPress={() => setIsModalVisible(true)}
                  style={styles.icon}
                >
                  <MaterialCommunityIcons
                    name="alarm-plus"
                    size={28}
                    color="black"
                  />
                </TouchableOpacity>
                {important == "relaxed" ? (
                  <TouchableOpacity
                    onPress={() => setImportant("important")}
                    style={styles.icon2}
                  >
                    <MaterialCommunityIcons
                      name="exclamation-thick"
                      size={28}
                      color="grey"
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => setImportant("relaxed")}
                    style={styles.icon2}
                  >
                    <MaterialCommunityIcons
                      name="exclamation-thick"
                      size={28}
                      color="red"
                    />
                  </TouchableOpacity>
                )}
              </View>
              <View
                style={[
                  styles.saveContainer,
                  { backgroundColor: text ? "blue" : "#9BABB8" },
                ]}
              >
                <TouchableOpacity disabled={!text}
                  onPress={() => {
                    handleOkPress();
                    setText('')
                    setScheduledDateTime(null);
                    setImportant('relaxed')
                    setCommandVis('hidden');
                  }}>
                  <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {scheduledDateTime ? (
          <View style={styles.scheduledContainer}>
            <Text style={styles.scheduledText}>
              Scheduled for: {formatDate(scheduledDateTime.date)}, {formatTime(scheduledDateTime.time)}
            </Text>
          </View>
        ) : null}

        <ScrollView>
          {/*normal*/}
          <View style={styles.todoListContainer}>
            <Text style={styles.section}>Normal</Text>
            {normalTodos.map((todo) => (
              <View key={todo.id} style={styles.todoItem}>
                <Text style={styles.todoText}>{todo.text}</Text>
                <Text style={styles.todoText}>
                  {formatDate(todo.date)}, {formatTime(todo.time)}
                </Text>

                <TouchableOpacity onPress={() => removeTodo(todo.id)}>
                  <MaterialCommunityIcons
                    name="delete-outline"
                    size={24}
                    color="red"
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/*important*/}
          <View style={styles.todoListContainer}>
            <Text style={styles.section}>Important</Text>
            {importantTodos.map((todo) => (
              <View key={todo.id} style={styles.todoItem}>
                <Text> <MaterialCommunityIcons
                  name="exclamation-thick"
                  size={28}
                  color="red"
                /></Text>
                <Text style={styles.todoText}>{todo.text}</Text>
                <Text style={styles.todoText}>
                  {formatDate(todo.date)}, {formatTime(todo.time)}
                </Text>

                <TouchableOpacity onPress={() => removeTodo(todo.id)}>
                  <MaterialCommunityIcons
                    name="delete-outline"
                    size={24}
                    color="red"
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            setIsModalVisible(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={{ fontSize: 16 }}>{formatDate(date)} - {formatTime(time)}</Text>
              <View style={styles.dateTimeInputs}>
                <Text style={styles.modalText}>Year - Month - Day</Text>
                <View style={styles.dateInputContainer}>
                  {/* Year input */}
                  <TextInput
                    style={styles.inputs}
                    placeholder="Year"
                    keyboardType="numeric"
                    value={date.getFullYear().toString()}
                    onChangeText={(input) => {
                      const newDate = new Date(date);
                      newDate.setFullYear(parseInt(input, 10) || 0);
                      setDate(newDate);
                    }}
                  />
                  {/* Month input */}
                  <Text>-</Text>
                  <TextInput
                    style={styles.inputs}
                    placeholder="Month"
                    keyboardType="numeric"
                    value={(date.getMonth() + 1).toString()}
                    onChangeText={(input) => {
                      const newDate = new Date(date);
                      newDate.setMonth((parseInt(input, 10) || 1) - 1);
                      setDate(newDate);
                    }}
                  />
                  {/* Day input */}
                  <Text>-</Text>
                  <TextInput
                    style={styles.inputs}
                    placeholder="Day"
                    keyboardType="numeric"
                    value={date.getDate().toString()}
                    onChangeText={(input) => {
                      const newDate = new Date(date);
                      newDate.setDate(parseInt(input, 10) || 1);
                      setDate(newDate);
                    }}
                  />
                </View>
                <Text style={styles.modalText}>Hour : Minutes</Text>
                <View style={styles.timeInputContainer}>
                  {/* Hour input */}
                  <TextInput
                    style={styles.inputs}
                    placeholder="Hour"
                    keyboardType="numeric"
                    value={time.getHours().toString()}
                    onChangeText={(input) => {
                      const newTime = new Date(time);
                      newTime.setHours(parseInt(input, 10) || 0);
                      setTime(newTime);
                    }}
                  />
                  <Text style={{ fontSize: 18 }}>:</Text>
                  {/* Minute input */}
                  <TextInput
                    style={styles.inputs}
                    placeholder="Minute"
                    keyboardType="numeric"
                    value={time.getMinutes().toString()}
                    onChangeText={(input) => {
                      const newTime = new Date(time);
                      newTime.setMinutes(parseInt(input, 10) || 0);
                      setTime(newTime);
                    }}
                  />
                </View>
              </View>
              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  onPress={() => setIsModalVisible(false)}
                  style={styles.modalButton}
                >
                  <Text style={{ color: "red", fontSize: 18 }}>CANCEL</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 18 }}>|</Text>
                <TouchableOpacity
                  onPress={() => {
                    setScheduledDateTime({ date, time });
                    setIsModalVisible(false);
                  }}
                  style={styles.modalButton}
                >
                  <Text style={{ color: "blue", fontSize: 18 }}>OK</Text>
                </TouchableOpacity>

              </View>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          style={styles.addButtonContainer}
          onPress={() => setCommandVis("shown")}
        >
          <MaterialCommunityIcons name="plus" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  headerContainer: {
    marginBottom: 16,
    marginTop: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  arrow: {
    marginLeft: 8,
    alignSelf: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F8FF",
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  icon2: {
    marginLeft: 8,
  },
  input: {
    flex: 1,
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "blue",
    borderRadius: 50,
    padding: 12,
    elevation: 5,
  },
  commandBar: {
    width: "100%",
    flexDirection: "column",
    alignSelf: "center",
    marginBottom: 36
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 12,
  },
  saveContainer: {
    flexDirection: "row",
    backgroundColor: "blue",
    marginTop: 12,
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  saveText: {
    color: "white",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    width: "80%",
    height: "60%",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalButtonsRow: {
    flexDirection: "row",
    position: "absolute",
    bottom: 16,
  },
  modalButton: {
    flex: 1,
    alignItems: "center",
  },
  dateTimeInputs: {
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
  },
  inputs: {
    backgroundColor: "#fff",
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 6,
    backgroundColor: "#F3F8FF",
    padding: 8,
    borderRadius: 8,
    marginVertical: 8,
    fontSize: 18
  },
  modalText: {
    fontSize: 17,
    alignSelf: 'center',
    marginTop: 8,
  },
  dateInputContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: 'center',
  },
  timeInputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: 'center',
  },
  scheduledContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  scheduledText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#333",
  },
  todoListContainer: {
    marginTop: 16,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F3F8FF",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  todoText: {
    flex: 1,
    marginRight: 8,
  },
  section: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16
  },
  scrollV: {
    flex: 1,
    flexGrow: 1
  }
});

export default TodosScreen;
