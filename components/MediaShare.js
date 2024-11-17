import React, { useState } from 'react';
import { View, Button, Text, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as VideoPicker from 'expo-video-picker';

const MediaShare = () => {
  const [media, setMedia] = useState(null);

  // Function to pick image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setMedia(result.uri);
    }
  };

  // Function to pick video
  const pickVideo = async () => {
    let result = await VideoPicker.launchImageLibraryAsync({
      mediaTypes: VideoPicker.MediaTypeOptions.Videos,
      quality: VideoPicker.VideoQuality['720p'],
    });

    if (!result.cancelled) {
      setMedia(result.uri);
    }
  };

  return (
    <View>
      <Button title="Pick Image" onPress={pickImage} />
      <Button title="Pick Video" onPress={pickVideo} />
      {media && (
        <View>
          <Text>Preview:</Text>
          {media.endsWith('.mp4') ? (
            <Video source={{ uri: media }} style={{ width: 200, height: 200 }} />
          ) : (
            <Image source={{ uri: media }} style={{ width: 200, height: 200 }} />
          )}
        </View>
      )}
    </View>
  );
};

export default MediaShare;
