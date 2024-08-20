import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import your screen components
import HomePage from "../screens/HomePage";
import Login from "../screens/Login";
import Signup from "../screens/Singup";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

const RootNavigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null as initial value to check loading state

  useEffect(() => {
    const checkLoggedStatus = async () => {
      const loggedUser = await AsyncStorage.getItem("loggedUser");
      setIsLoggedIn(loggedUser !== null);
    };

    checkLoggedStatus();
  }, []);

  console.log(isLoggedIn);

  // If isLoggedIn is null, you can show a loading screen or a blank screen while checking the login status
  if (isLoggedIn === null) {
    return null; // Or you can return a loading spinner here
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isLoggedIn ? "home" : "login"}
        screenOptions={{
          headerShown: false,
          gestureEnabled: false, // Disable gesture back navigation on all screens
        }}
      >
        <Stack.Screen
          options={{
            headerShown: false,
            gestureEnabled: false, // Prevent back swipe on home
            animationEnabled: false, // Disable animation if needed
          }}
          name="home"
          component={HomePage}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="login"
          component={Login}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="signup"
          component={Signup}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
