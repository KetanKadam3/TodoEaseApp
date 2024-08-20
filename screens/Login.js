import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  TouchableOpacity,
} from "react-native";

export default function Login() {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleFormInput = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    if (Object.values(formData).includes("")) {
      Alert.alert("Error", "You haven't filled all the required fields", [
        { text: "OK" },
      ]);
      return;
    }
    try {
      const data = JSON.parse(await AsyncStorage.getItem("users")) || [];
      const user = data.find((user) => user.email === formData.email);
      if (user) {
        await AsyncStorage.setItem("loggedUser", JSON.stringify(user));
        Alert.alert("Success", `${user.username} logged in successfully!`, [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("home");
            },
          },
        ]);
      } else {
        Alert.alert("Error", "You haven't registered. Please sign up.", [
          { text: "OK" },
        ]);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.", [
        { text: "OK" },
      ]);
      console.error("Login Error: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>

      <Text style={styles.inputText}>Email</Text>
      <TextInput
        style={styles.inputBox}
        value={formData.email}
        onChangeText={(text) => handleFormInput("email", text)}
        keyboardType="email-address"
        placeholder="Enter your email"
        autoCapitalize="none"
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

      <TouchableOpacity onPress={handleLogin} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={{ color: "white", marginTop: 20 }}>
        Don't have an account?
      </Text>

      <Text
        style={styles.signupLink}
        onPress={() => navigation.navigate("signup")}
      >
        Click here to sign up
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
    padding:30,
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
  signupLink: {
    color: "#C4E4FF",
    fontWeight: "bold",
  },
});
