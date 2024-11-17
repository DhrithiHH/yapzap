import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "../screens/HomeScreen";
import GroupsScreen from "../screens/GroupsScreen";
import GetConnectScreen from "../screens/GetConnectScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === "Messages") {
                        iconName = focused ? "chatbubble" : "chatbubble-outline";
                    } else if (route.name === "Groups") {
                        iconName = focused ? "people" : "people-outline";
                    } else if (route.name === "Get Connect") {
                        iconName = focused ? "add-circle" : "add-circle-outline";
                    } else if (route.name === "Profile") {
                        iconName = focused ? "person" : "person-outline";
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "green",
                tabBarInactiveTintColor: "gray",
                tabBarStyle: { backgroundColor: "white" },
            })}
        >
            <Tab.Screen name="Messages" component={HomeScreen} />
            <Tab.Screen name="Groups" component={GroupsScreen} />
            <Tab.Screen name="Get Connect" component={GetConnectScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export default TabNavigator;
