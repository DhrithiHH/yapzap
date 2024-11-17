import React from 'react';
import { View, Text } from 'react-native';
import MediaShare from '../components/MediaShare';
import VoiceNote from '../components/VoiceNote';
import DocumentShare from '../components/DocumentShare';
import LocationShare from '../components/LocationShare';
import DisappearingMessages from '../components/DisappearingMessages';
import StickerAndEmojiReact from '../components/StickerAndEmojiReact';

const ChatScreen = () => {
  return (
    <View>
      <Text>YapZap Chat</Text>
      <MediaShare />
      <VoiceNote />
      <DocumentShare />
      <LocationShare />
      <DisappearingMessages />
      <StickerAndEmojiReact />
    </View>
  );
};

export default ChatScreen;
