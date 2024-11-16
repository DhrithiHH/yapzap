import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import {
  checkIfEmailExists,
  checkIfUserIdExists,
  registerWithCustomUserId,
  signInWithGoogle,
  checkIfUsernameExistsForGoogleUser,
  addUsernameForGoogleUser,
} from '../auth'; // Ensure paths are correct

const RegisterScreen = () => {
  const navigation = useNavigation();

  // State variables for inputs and animations
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [isUserIdTaken, setIsUserIdTaken] = useState(false);
  const [googleAccount, setGoogleAccount] = useState(false);
  const [inputRefEmail, setInputRefEmail] = useState(null);
  const [inputRefUserId, setInputRefUserId] = useState(null);

  // Animated progress bar
  const progressAnim = new Animated.Value(0);

  // Handle progress bar animation
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (step / 3) * 100,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [step]);

  // Handle Google Sign-In (with useEffect)
  const handleGoogleSignIn = async () => {
    try {
      const googleUser = await signInWithGoogle();
      const userId = googleUser.uid;
      const usernameExists = await checkIfUsernameExistsForGoogleUser(userId);

      if (usernameExists) {
        navigation.navigate('Home');
      } else {
        setGoogleAccount(true);
        setStep(1);
      }
    } catch (error) {
      Alert.alert('Google Sign-In Error', error.message);
    }
  };

  // Handle Google user save (with useEffect)
  const handleGoogleUserSave = async () => {
    if (username && userId) {
      try {
        const googleUser = await signInWithGoogle();
        await addUsernameForGoogleUser(userId, googleUser, username);
        Alert.alert('Success', `Welcome ${username}, your Google account is now linked.`);
        navigation.navigate('Home');
      } catch (error) {
        Alert.alert('Error', 'Failed to save Google user details. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please enter a valid username and User ID.');
    }
  };

  // Handle input validations (useEffect)
  const handleNextStep = async () => {
    if (step === 1) {
      const userIdCheck = await checkIfUserIdExists(userId);
      setIsUserIdTaken(userIdCheck);
      if (userIdCheck) {
        if (inputRefUserId) inputRefUserId.shake(800);
        return;
      }
    }

    if (step === 2) {
      const emailCheck = await checkIfEmailExists(email);
      setEmailExists(emailCheck);
      if (emailCheck) {
        if (inputRefEmail) inputRefEmail.shake(800);
        return;
      }
    }

    if (step === 3) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      handleSignUp();
    } else {
      setStep(step + 1);
    }
  };

  // Handle regular sign-up (useEffect)
  const handleSignUp = async () => {
    if (username && email && password && userId) {
      try {
        await registerWithCustomUserId(userId, email, password, username);
        // Alert.alert('Welcome!', `Hello ${username}, your account is registered.`);
        navigation.navigate('Home');
      } catch (error) {
        Alert.alert('Registration Error', error.message);
      }
    } else {
      Alert.alert('Error', 'Please fill all fields before signing up.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create Your Account</Text>

        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progressBar, { width: `${progressAnim._value}%` }]} />
        </View>

        {step === 1 && (
          <>
            <Animatable.View ref={(ref) => setInputRefUserId(ref)} animation="fadeIn">
              <TextInput
                style={[styles.input, isUserIdTaken && styles.inputError]}
                placeholder="UserID"
                placeholderTextColor="#aaa"
                value={userId}
                onChangeText={setUserId}
              />
            </Animatable.View>

            <Animatable.View animation="fadeIn">
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#aaa"
                value={username}
                onChangeText={setUsername}
              />
            </Animatable.View>
          </>
        )}

        {step === 2 && (
          <Animatable.View ref={(ref) => setInputRefEmail(ref)} animation="fadeIn">
            <TextInput
              style={[styles.input, emailExists && styles.inputError]}
              placeholder="Email"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </Animatable.View>
        )}

        {step === 3 && (
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        )}

        <TouchableOpacity style={styles.signUpButton} onPress={handleNextStep}>
          <Text style={styles.signUpText}>{step === 3 ? 'Sign Up' : 'Next'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
          <Text style={styles.googleText}>Sign up with Google</Text>
        </TouchableOpacity>

        {showConfetti && <ConfettiCannon count={200} origin={{ x: 0, y: 0 }} />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: '#f8f8f8',
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    height: 6,
    backgroundColor: '#333',
    borderRadius: 5,
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#00c853',
    borderRadius: 5,
  },
  input: {
    backgroundColor: '#333',
    color: '#f8f8f8',
    padding: 12,
    marginVertical: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  signUpButton: {
    backgroundColor: '#6200ea',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  googleButton: {
    backgroundColor: '#db4437',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  googleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inputError: {
    borderColor: '#ff0000',
    borderWidth: 1,
  },
});

export default RegisterScreen;
