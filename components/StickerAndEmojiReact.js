import React, { useState } from 'react';
import { Button, Image } from 'react-native';

const StickerAndEmojiReact = () => {
  const [reaction, setReaction] = useState(null);

  // Mock sticker for the example
  const stickers = ['sticker1.png', 'sticker2.png'];

  return (
    <View>
      <Button title="React with Emoji" onPress={() => setReaction('❤️')} />
      <Button title="Send Sticker" onPress={() => setReaction(stickers[Math.floor(Math.random() * stickers.length)])} />
      {reaction && (
        <View>
          {reaction.includes('.png') ? (
            <Image source={{ uri: reaction }} style={{ width: 100, height: 100 }} />
          ) : (
            <Text>{reaction}</Text>
          )}
        </View>
      )}
    </View>
  );
};

export default StickerAndEmojiReact;
