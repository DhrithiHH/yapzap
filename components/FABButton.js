import React from 'react';
import { FAB } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const FABButton = ({ onPress }) => {
  return (
    <FAB
      style={styles.fab}
      icon="message"
      onPress={onPress}
      label="New Chat"
    />
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#75ab6b', // Matches the YapZap theme color
  },
});

export default FABButton;
