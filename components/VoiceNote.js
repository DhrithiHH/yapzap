import React, { useState } from 'react';
import { View, Button, Text, Audio } from 'react-native';
import Voice from 'react-native-voice';

const VoiceNote = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);

  // Start recording voice note
  const startRecording = () => {
    Voice.start('en-US');
    setIsRecording(true);
  };

  // Stop recording and play the voice note
  const stopRecording = () => {
    Voice.stop();
    setIsRecording(false);
  };

  Voice.onSpeechResults = (event) => {
    setRecording(event.value[0]);
  };

  return (
    <View>
      <Button title={isRecording ? "Stop Recording" : "Start Recording"} onPress={isRecording ? stopRecording : startRecording} />
      {recording && <Text>Recording: {recording}</Text>}
    </View>
  );
};

export default VoiceNote;
