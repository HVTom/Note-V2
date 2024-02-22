import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ResetAsyncStorageButton = () => {
  const resetAsyncStorage = useCallback(async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert("AsyncStorage Reset", "AsyncStorage has been reset successfully.");
    } catch (error) {
      console.error("Error resetting AsyncStorage:", error);
      Alert.alert("Error", "Failed to reset AsyncStorage. Please check the console for more details.");
    }
  }, []);

  return (
    <TouchableOpacity style={styles.resetButton} onPress={resetAsyncStorage}>
      <Text style={styles.resetButtonText}>Reset AsyncStorage</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  resetButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  resetButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ResetAsyncStorageButton;
