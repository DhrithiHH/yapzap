import React from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Badge } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import { Avatar } from 'react-native-paper'; // optional, for static avatar or fallback

const chatData = [
  {
    id: '1',
    name: 'Alice',
    avatar: require('../assets/avatar1.json'), // Lottie animation for avatar
    lastMessage: 'Hey there! How are you?',
    unreadCount: 2,
    status: 'online',
  },
  {
    id: '2',
    name: 'Bob',
    avatar: require('../assets/avatar2.json'),
    lastMessage: 'See you later!',
    unreadCount: 0,
    status: 'offline',
  },
  {
    id: '3',
    name: 'Charlie',
    avatar: require('../assets/avatar3.json'),
    lastMessage: 'Let\'s catch up soon!',
    unreadCount: 1,
    status: 'online',
  },
  // Add more sample chat data as needed
];

const ChatList = ({ renderChatItem }) => (
  <FlatList
    data={chatData}
    keyExtractor={(item) => item.id}
    renderItem={renderChatItem}
    showsVerticalScrollIndicator={false}
  />
);

const HomeScreen = () => {
  const renderChatItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <LottieView
          source={item.avatar}
          autoPlay
          loop
          style={styles.avatar}
        />
        {/* Online Status */}
        {item.status === 'online' && (
          <Badge style={styles.onlineBadge}></Badge>
        )}
      </View>

      {/* Chat Information */}
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>

      {/* Unread Count */}
      {item.unreadCount > 0 && (
        <Badge style={styles.unreadBadge}>{item.unreadCount}</Badge>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ChatList renderChatItem={renderChatItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // for android
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  lastMessage: {
    fontSize: 14,
    color: '#777',
  },
  unreadBadge: {
    backgroundColor: '#f00',
    marginLeft: 10,
    paddingHorizontal: 8,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0f0',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
});

export default HomeScreen;
