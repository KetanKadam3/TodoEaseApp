import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function Signup() {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleFormInput = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = async () => {
    if (Object.values(formData).includes("")) {
      Alert.alert("Error", "You haven't filled all the required fields", [
        { text: "OK" },
      ]);
      return;
    }

    if (!validateEmail(formData.email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.", [
        { text: "OK" },
      ]);
      return;
    }

    try {
      const oldEntries = JSON.parse(await AsyncStorage.getItem("users")) || [];
      const values = [...oldEntries, formData];
      await AsyncStorage.setItem("users", JSON.stringify(values));

      Alert.alert("Success", "You have signed up successfully!", [
        { text: "OK", onPress: () => navigation.navigate("login") },
      ]);
    } catch (error) {
      Alert.alert("Error", "Something went wrong during sign up.", [
        { text: "OK" },
      ]);
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign Up</Text>
      <Text style={styles.inputText}>Username</Text>
      <TextInput
        style={styles.inputBox}
        value={formData.username}
        placeholder="Enter your username"

        onChangeText={(text) => handleFormInput("username", text)}
      />

      <Text style={styles.inputText}>Email</Text>
      <TextInput
        style={styles.inputBox}
        value={formData.email}
        placeholder="Enter your email"

        onChangeText={(text) => handleFormInput("email", text)}
      />

      <Text style={styles.inputText}>Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputBox}
          value={formData.password}
          onChangeText={(text) => handleFormInput("password", text)}
          placeholder="Enter your password"
          secureTextEntry={!visible}
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setVisible(!visible)}
        >
          {visible ? (
            <Image
              source={require("../assets/view.png")} // Path to your icon image
              style={styles.icon}
            />
          ) : (
            <Image
              source={require("../assets/hide.png")} // Path to your icon image
              style={styles.icon}
            />
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => handleSignup()}
        style={styles.buttonContainer}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={{ color: "white", marginTop: 20 }}>Have an account?</Text>
      <Text
        style={{
          color: "#C4E4FF",
          fontWeight: "bold",
        }}
        onPress={() => navigation.navigate("login")}
      >
        {" "}
        Click here to login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5D5FEF",
    alignItems: "center",
    justifyContent: "center",
    padding:30
  },
  heading: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold",
    textDecorationLine: "underline",
    textShadowColor: "#2B1887",
    textShadowRadius: 10,
  },
  inputContainer: {
    width: '100%',
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "white",
  },
  icon: {
    width: 20,
    height: 20,
    position: "absolute",
    right: 10,
  },
  inputBox: {
    paddingLeft: 10, // Make space for the icon
    paddingRight: 45,
    height: 50,
    fontSize: 16,
    width: '100%',
    borderRadius: 10,
    backgroundColor: "#F4F2FF",
    color: "#2B1887",
  },
  inputText: {
    fontSize: 20,
    color: "white",
    textAlign: "left",
    alignSelf: "flex-start",
    marginTop: 20,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
  },
  buttonContainer: {
    width: '100%',
    marginTop: 30,
    backgroundColor: "#2B1887",
    padding: 10,
    display: "flex",
    justifyContent: "center",
    borderRadius: 13,
  },
});
