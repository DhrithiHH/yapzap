import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient"; // Updated for Expo
import { MotiView } from "moti";

export default function HomeScreen({ navigation }) {
  // Floating Avatar Animation
  const floatAnim = useSharedValue(0);

  React.useEffect(() => {
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1500 }),
        withTiming(10, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const avatarStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatAnim.value }],
  }));

  return (
    <LinearGradient colors={["#ff9a9e", "#fad0c4"]} style={styles.container}>
      <Text style={styles.heading}>Welcome to YapZap!</Text>

      {/* Floating Avatar */}
      <Animated.Image
        source={{ uri: "https://example.com/avatar.png" }}
        style={[styles.avatar, avatarStyle]}
      />

      {/* Navigation Buttons with Ripple Effect */}
      {["Login", "Register", "Forgot Password"].map((screen, index) => (
        <MotiView
          key={index}
          from={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{
            type: "timing",
            duration: 1000,
            loop: true,
          }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate(screen)}
          >
            <Text style={styles.buttonText}>{screen}</Text>
          </TouchableOpacity>
        </MotiView>
      ))}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    fontFamily: "Helvetica Neue",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 40,
    borderWidth: 3,
    borderColor: "#fff",
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    fontFamily: "Avenir Next",
  },
});
