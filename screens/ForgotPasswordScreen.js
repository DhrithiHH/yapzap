import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Switch } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { MotiView } from "moti";

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true); // Audio toggle state

  const handlePasswordReset = () => {
    if (email.trim() === "") {
      Alert.alert("Oops! 😜", "Enter your email, superstar!");
    } else {
      setSubmitted(true);
      if (audioEnabled) {
        // Play sound if audio is enabled (you can use any sound library here)
      }
      setTimeout(() => {
        Alert.alert("🎉 Success!", "Check your inbox, champ! 💌");
        setSubmitted(false);
        setEmail("");
      }, 2000);
    }
  };

  return (
    <LinearGradient colors={["#FFDEE9", "#B5FFFC"]} style={styles.container}>
      <Text style={styles.heading}>🔑 Forgot Password?</Text>

      {/* Sassy Emoji Animation */}
      <LottieView
        source={require("./assets/emoji.json")}
        autoPlay
        loop
        style={styles.emojiAnimation}
      />

      {/* Floating Mascot Animation */}
      <LottieView
        source={require("./assets/floatingMascot.json")}
        autoPlay
        loop
        style={styles.floatingMascot}
      />

      {/* Sassy Callout Sticker */}
      <MotiView
        from={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", delay: 500 }}
      >
        <Text style={styles.callout}>“No stress, we got this! 😎”</Text>
      </MotiView>

      {/* Input Field */}
      <TextInput
        style={styles.input}
        placeholder="Enter your email ✨"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
      />

      {/* Reset Button with Bouncy Animation */}
      <MotiView
        from={{ scale: 1 }}
        animate={{ scale: 1.1 }}
        transition={{
          type: "timing",
          duration: 500,
          loop: true,
        }}
      >
        <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
          <Text style={styles.buttonText}>Send Magic Link ✨</Text>
        </TouchableOpacity>
      </MotiView>

      {/* Reward Confetti Animation */}
      {submitted && (
        <LottieView
          source={require("./assets/confetti.json")}
          autoPlay
          loop={false} // Play once
          style={styles.confetti}
        />
      )}

      {/* Reward Message (Gamification Feature) */}
      {submitted && (
        <View style={styles.rewardMessage}>
          <Text style={styles.rewardText}>🎉 You earned 10 points!</Text>
        </View>
      )}

      {/* Audio Toggle */}
      <View style={styles.audioToggleContainer}>
        <Text style={styles.audioToggleText}>Enable Audio</Text>
        <Switch
          value={audioEnabled}
          onValueChange={() => setAudioEnabled(!audioEnabled)}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1A1A1A", // Dark background to make neon colors pop
    padding: 20,
  },
  heading: {
    fontSize: 30,
    color: "#39FF14", // Neon green for heading
    marginBottom: 15,
    fontWeight: "bold",
  },
  callout: {
    backgroundColor: "#FFEB3B", // Bright yellow for callouts
    color: "#000",
    fontSize: 18,
    padding: 10,
    borderRadius: 10,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "80%",
    padding: 12,
    marginBottom: 15,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#39FF14", // Neon green button background
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emojiAnimation: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  floatingMascot: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  confetti: {
    width: 250,
    height: 250,
    marginTop: 20,
  },
  rewardMessage: {
    backgroundColor: "#9C27B0", // Purple for reward message for a playful contrast
    padding: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  rewardText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  audioToggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  audioToggleText: {
    color: "#39FF14", // Neon green text color for the toggle
    fontSize: 16,
    marginRight: 10,
  },
});
