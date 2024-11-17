import React, { useEffect, useState } from "react";
import {
    View,
    TextInput,
    FlatList,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { auth, db } from "../firebase";
import {
    collection,
    doc,
    getDocs,
    query,
    orderBy,
    getDoc,
} from "firebase/firestore";
import TabNavigator from "../components/TabNavigator";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
    const [chats, setChats] = useState([]);
    const [searchText, setSearchText] = useState("");
    const navigation = useNavigation();

    useEffect(() => {
        const fetchChats = async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                console.error("User not authenticated");
                return;
            }

            const currentUserId = currentUser.uid;

            // Fetch current user's contacts
            const contactsRef = collection(db, `users/${currentUserId}/contacts`);
            const contactsSnapshot = await getDocs(contactsRef);
            const contacts = contactsSnapshot.docs.map((doc) => doc.id); // List of contact userIds

            const chatData = [];
            for (const contactId of contacts) {
                // Construct messageId
                const messageId = [currentUserId, contactId].sort().join("-");

                // Fetch last message time from messages collection
                const messageDocRef = doc(db, `messages/${messageId}`);
                const messageDoc = await getDoc(messageDocRef);

                if (messageDoc.exists()) {
                    const { lastMessageTime, lastMessage, contactName, profilePic } =
                        messageDoc.data();

                    chatData.push({
                        messageId,
                        lastMessageTime,
                        lastMessage,
                        contactName,
                        profilePic,
                        contactId,
                    });
                }
            }

            // Sort chats by lastMessageTime (most recent first)
            chatData.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
            setChats(chatData);
        };

        fetchChats();
    }, []);

    const filteredChats = chats.filter((chat) =>
        chat.contactName.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <TextInput
                style={styles.searchBar}
                placeholder="Search chats..."
                value={searchText}
                onChangeText={setSearchText}
            />

            {/* Chats List */}
            <FlatList
                data={filteredChats}
                keyExtractor={(item) => item.messageId}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.chatCard}
                        onPress={() =>
                            navigation.navigate("Chat", {
                                messageId: item.messageId,
                                contactId: item.contactId,
                                contactName: item.contactName,
                                profilePic: item.profilePic,
                            })
                        }
                    >
                        <View>
                            <Text style={styles.contactName}>{item.contactName}</Text>
                            <Text style={styles.lastMessage}>
                                {item.lastMessage || "No messages yet"}
                            </Text>
                        </View>
                        <Text style={styles.time}>
                            {new Date(item.lastMessageTime).toLocaleString()}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            {/* Tab Navigator */}
            <TabNavigator />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: "white" },
    searchBar: {
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    chatCard: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "lightgray",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    contactName: { fontSize: 16, fontWeight: "bold", color: "green" },
    lastMessage: { fontSize: 14, color: "gray" },
    time: { fontSize: 12, color: "lightgray" },
});

export default HomeScreen;
