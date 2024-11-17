import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
// import HomeScreen from '../screens/HomeScreen';
import ForgotPassword from '../screens/ForgotPasswordScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import ProfilePage from '../screens/ProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/chatpage';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Welcome">
      {/* Welcome Screen */}
      <Stack.Screen name="Welcome" component={WelcomeScreen} />

      {/* Authentication Screens */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />


      
      {/* Main App Screen */}
     {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
      <Stack.Screen name="Profile" component={ProfilePage} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
