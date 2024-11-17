import { FAB } from 'react-native-paper'; // Add this import at the top of your file

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <ChatList renderChatItem={renderChatItem} />
      
      {/* FAB button */}
      <FAB
        style={styles.fab}
        icon="message"
        onPress={() => console.log('Start New Chat')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  ...existingStyles,
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#75ab6b', // Match your theme color
  },
});
