import React, { useState, useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import * as Location from 'expo-location';

const LocationShare = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  return (
    <View>
      <Button title="Share Location" onPress={() => alert(`Location shared: ${location.coords.latitude}, ${location.coords.longitude}`)} />
      {location && (
        <Text>
          Latitude: {location.coords.latitude}, Longitude: {location.coords.longitude}
        </Text>
      )}
    </View>
  );
};

export default LocationShare;
