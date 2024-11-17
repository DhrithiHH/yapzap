import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar } from 'react-native-elements'; // For Avatar Component
import QRCode from 'react-native-qrcode-svg'; // For QR Code Generation

// Import additional libraries for animations and themes
import { useTheme } from '@react-navigation/native';

// Avatar Customization Component
const AvatarCustomization = ({ onAvatarChange }) => {
  const [avatarStyle, setAvatarStyle] = useState({
    backgroundColor: '#75ab6b', // default color
    animationValue: new Animated.Value(0),
  });

  const handleAvatarClick = () => {
    // Triggering animation (e.g., change pose or expression)
    Animated.timing(avatarStyle.animationValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
    onAvatarChange();
  };

  return (
    <TouchableOpacity onPress={handleAvatarClick}>
      <Animated.View
        style={{
          transform: [
            {
              scale: avatarStyle.animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.2],
              }),
            },
          ],
        }}
      >
        <Avatar
          rounded
          size={100}
          source={require('../assets/icon.png')}
          containerStyle={{
            backgroundColor: avatarStyle.backgroundColor,
            borderColor: '#f5a527',
            borderWidth: 5,
          }}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

// Profile Page Component
const ProfilePage = () => {
  const { colors } = useTheme();
  const [status, setStatus] = useState("Chillin' 😎");
  const [showQRCode, setShowQRCode] = useState(false);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      {/* Avatar and Customization */}
      <View style={{ marginTop: 30, alignItems: 'center' }}>
        <AvatarCustomization onAvatarChange={() => console.log('Avatar changed!')} />
        <Text style={{ fontSize: 18, color: colors.text, marginTop: 10 }}>Change Avatar</Text>
      </View>

      {/* Profile Picture and Frame */}
      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <Image
          source={require('../assets/icon.png')} // Replace with dynamic image
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            borderColor: '#75ab6b',
            borderWidth: 5,
            marginBottom: 10,
          }}
        />
        <Text style={{ color: colors.text, fontSize: 16 }}>Your Awesome Avatar</Text>
      </View>

      {/* Status and Personalized Greeting */}
      <View style={{ marginTop: 30, alignItems: 'center' }}>
        <Text style={{ fontSize: 22, color: colors.text }}>Hey, [User]!</Text>
        <TextInput
          value={status}
          onChangeText={setStatus}
          style={{
            borderBottomWidth: 2,
            width: '80%',
            padding: 10,
            textAlign: 'center',
            fontSize: 18,
            marginTop: 10,
            color: colors.text,
            borderColor: '#75ab6b',
          }}
        />
        <Text style={{ fontSize: 16, color: colors.text, marginTop: 5 }}>Your Status: {status}</Text>
      </View>

      {/* Profile Badges */}
      <View style={{ marginTop: 40, flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={{ marginRight: 10, fontSize: 18, color: '#f5a527' }}>🏆 Chat Master</Text>
        <Text style={{ marginLeft: 10, fontSize: 18, color: '#75ab6b' }}>🎮 Emoji King</Text>
      </View>

      {/* Story Highlights */}
      <View style={{ marginTop: 30, width: '100%', paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 20, color: colors.text, marginBottom: 10 }}>Story Highlights</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ marginRight: 10 }}>
            <Image source={require('../assets/icon.png')} style={{ width: 100, height: 100, borderRadius: 10 }} />
            <Text style={{ textAlign: 'center', color: colors.text }}>Travel</Text>
          </View>
          <View style={{ marginRight: 10 }}>
            <Image source={require('../assets/icon.png')} style={{ width: 100, height: 100, borderRadius: 10 }} />
            <Text style={{ textAlign: 'center', color: colors.text }}>Friends</Text>
          </View>
        </ScrollView>
      </View>

      {/* QR Code for Sharing Profile */}
      <View style={{ marginTop: 30, alignItems: 'center' }}>
        <TouchableOpacity onPress={() => setShowQRCode(!showQRCode)}>
          <Text style={{ fontSize: 18, color: '#f5a527' }}>Share Profile</Text>
        </TouchableOpacity>
        {showQRCode && (
          <View style={{ marginTop: 20 }}>
            <QRCode value="https://chatgpt.com/c/6739ea2e-f300-8011-b4f1-be71522b7e76" size={150} />
          </View>
        )}
      </View>

      {/* Privacy Settings */}
      <View style={{ marginTop: 30, alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: colors.text }}>Privacy Settings</Text>
        <LinearGradient colors={['#75ab6b', '#f5a527']} style={{ padding: 10, borderRadius: 5, marginTop: 20 }}>
          <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
            <Text style={{ color: 'white', fontSize: 16 }}>Edit Privacy Settings</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </ScrollView>
  );
};

export default ProfilePage;
