import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
} from "react-native";
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase"; // Import your Firebase configuration
import Ionicons from "react-native-vector-icons/Ionicons";
import WebRTCClient from "../utils/WebRTCClient";

const ChatScreen = ({ route, navigation }) => {
    const { userId, userName, profilePic } = route.params;
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const currentUser = "currentUserId"; // Replace with the authenticated user's ID
    const webRTCClient = useRef(null);

    const chatId = [currentUser, userId].sort().join("_");

    // Initialize WebRTCClient
    useEffect(() => {
        webRTCClient.current = new WebRTCClient(
            "http://localhost:3000", // Replace with your signaling server URL
            handleLocalStream,
            handleRemoteStream
        );
        webRTCClient.current.register(currentUser);

        // Listen for new messages via WebRTC
        webRTCClient.current.socket.on("new-message", handleWebRTCMessage);

        return () => {
            if (webRTCClient.current) {
                webRTCClient.current.socket.disconnect();
            }
        };
    }, []);

    // Fetch message history from Firebase
    useEffect(() => {
        const messagesRef = collection(db, `messages/${chatId}/chatMessages`);
        const q = query(messagesRef, orderBy("messageTime", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const loadedMessages = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(loadedMessages);
        });

        return () => unsubscribe();
    }, [chatId]);

    const handleLocalStream = (stream) => {
        console.log("Local Stream Initialized", stream);
    };

    const handleRemoteStream = (stream) => {
        console.log("Remote Stream Received", stream);
    };

    const handleWebRTCMessage = (message) => {
        // Add the message to the local state
        setMessages((prevMessages) => [...prevMessages, message]);

        // Persist the message in Firebase
        saveMessageToFirebase(message);
    };

    const saveMessageToFirebase = async (message) => {
        const messagesRef = collection(db, `messages/${chatId}/chatMessages`);
        await addDoc(messagesRef, {
            from: message.from,
            to: message.to,
            message: message.message,
            messageTime: message.messageTime,
        });
    };

    // Send a new message via WebRTC and Firebase
    const sendMessage = async () => {
        if (messageText.trim()) {
            const newMessage = {
                id: Date.now().toString(),
                from: currentUser,
                to: userId,
                message: messageText,
                messageTime: new Date().toISOString(),
            };

            // Send message via WebRTC
            webRTCClient.current.socket.emit("send-message", newMessage);

            // Update local state and Firebase
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            await saveMessageToFirebase(newMessage);

            setMessageText("");
        }
    };

    // Header Setup
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View style={styles.header}>
                    <Image source={{ uri: profilePic }} style={styles.profilePic} />
                    <View>
                        <Text style={styles.userName}>{userName}</Text>
                        <Text style={styles.status}>Last Seen: 2 mins ago</Text> {/* Update with real-time status */}
                    </View>
                </View>
            ),
            headerRight: () => (
                <View style={styles.headerIcons}>
                    <TouchableOpacity onPress={startVoiceCall}>
                        <Ionicons name="call" size={24} color="green" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginHorizontal: 15 }} onPress={startVideoCall}>
                        <Ionicons name="videocam" size={24} color="green" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-horizontal" size={24} color="green" />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation, userName, profilePic]);

    const startVoiceCall = async () => {
        webRTCClient.current.callUser(userId);
    };

    const startVideoCall = async () => {
        webRTCClient.current.startLocalStream({ video: true, audio: true });
        webRTCClient.current.callUser(userId);
    };

    return (
        <View style={styles.container}>
            {/* Messages List */}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View
                        style={[
                            styles.messageContainer,
                            item.from === currentUser
                                ? styles.messageRight
                                : styles.messageLeft,
                        ]}
                    >
                        <Text style={styles.messageText}>{item.message}</Text>
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: 80 }}
                inverted
            />

            {/* Input Bar */}
            <View style={styles.inputBar}>
                <TouchableOpacity>
                    <Ionicons name="attach" size={24} color="gray" />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={messageText}
                    onChangeText={setMessageText}
                />
                <TouchableOpacity>
                    <Ionicons name="happy" size={24} color="gray" />
                </TouchableOpacity>
                <TouchableOpacity onPress={sendMessage}>
                    <Ionicons name="send" size={24} color="green" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f0f5f5" },
    header: { flexDirection: "row", alignItems: "center" },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    userName: { fontWeight: "bold", fontSize: 16, color: "#333" },
    status: { fontSize: 12, color: "gray" },
    headerIcons: { flexDirection: "row", alignItems: "center" },
    messageContainer: {
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 10,
        maxWidth: "70%",
    },
    messageLeft: { backgroundColor: "#e0f7e0", alignSelf: "flex-start" },
    messageRight: { backgroundColor: "#d4d4f7", alignSelf: "flex-end" },
    messageText: { fontSize: 14, color: "#333" },
    inputBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "white",
        borderTopWidth: 1,
        borderColor: "#ddd",
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 20,
        padding: 10,
        marginHorizontal: 10,
    },
});

export default ChatScreen;
