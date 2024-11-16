import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { loginWithEmailOrUserId } from '../auth';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

const LoginScreen = ({ navigation }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await loginWithEmailOrUserId(identifier, password);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Login Error', error.message);
    }
  };

  return (
    <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.container}>
      <Animatable.View animation="fadeInDown" style={styles.header}>
        <Text style={styles.title}>Welcome to YapZap!</Text>
        <Image source={require('../assets/chat-logo.png')} style={styles.logo} />
      </Animatable.View>
      <Animatable.View animation="fadeInUp" style={styles.form}>
        <TextInput
          label="Email or User ID"
          value={identifier}
          onChangeText={setIdentifier}
          style={styles.input}
        />
        <TextInput
          label="Password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
          style={styles.input}
        />
        <Button mode="contained" onPress={handleLogin} style={styles.button}>
        {/* <Button mode="contained"  style={styles.button}> */}
          Login
        </Button>
        <Button mode="text" onPress={() => navigation.navigate('Register')}>
          New here? Register
        </Button>
      </Animatable.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  logo: { height: 100, width: 100, marginVertical: 20 },
  form: { flex: 1.5, backgroundColor: '#fff', borderTopLeftRadius: 30, padding: 20 },
  input: { marginBottom: 15 },
  button: { backgroundColor: '#2575fc', marginVertical: 10 },
});

export default LoginScreen;
