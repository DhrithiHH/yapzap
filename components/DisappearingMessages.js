import React, { useState } from 'react';
import { View, Button, Text, TextInput } from 'react-native';

const DisappearingMessages = () => {
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(10); // Set the timer in seconds

  const sendMessage = () => {
    setTimeout(() => {
      alert('Message has disappeared!');
      setMessage('');
    }, timer * 1000);
  };

  return (
    <View>
      <TextInput
        placeholder="Type your message"
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send Disappearing Message" onPress={sendMessage} />
      <Text>Timer: {timer} seconds</Text>
    </View>
  );
};

export default DisappearingMessages;
