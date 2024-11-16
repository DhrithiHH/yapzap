import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithCredential, 
  sendPasswordResetEmail, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "./firebase"; // Firebase initialization file
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser'; 
import { Alert } from 'react-native';

// Complete the OAuth session (needed for Expo Auth flow)
WebBrowser.maybeCompleteAuthSession();

// Utility function to check if input is an email
const isEmail = (identifier) => /\S+@\S+\.\S+/.test(identifier);

// Function to log in with email or custom userId
export const loginWithEmailOrUserId = async (identifier, password) => {
  try {
    let email = identifier;

    // Check if the identifier is not an email
    if (!isEmail(identifier)) {
      // Look up the email using the userId
      const userRef = collection(db, "users");
      const userQuery = query(userRef, where("userId", "==", identifier));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        // Extract the email from the document
        const userDoc = querySnapshot.docs[0];
        email = userDoc.data().email;
      } else {
        throw new Error("User ID not found.");
      }
    }

    // Sign in with email and password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User logged in:", user);
    return user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

// Function to check if userId exists in Firestore
export const checkIfUserIdExists = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      console.log("User ID is already in use.");
      return true; // User ID exists
    }
    return false; // User ID does not exist
  } catch (error) {
    console.error("Error checking user ID:", error);
    return false; // Return false in case of error
  }
};

// Function to check if the email already exists in Firestore
export const checkIfEmailExists = async (email) => {
  try {
    const userRef = collection(db, "users");
    const emailQuery = query(userRef, where("email", "==", email));
    const emailQuerySnapshot = await getDocs(emailQuery);
    
    if (!emailQuerySnapshot.empty) {
      console.log("Email is already in use.");
      return true; // Email exists
    }
    return false; // Email does not exist
  } catch (error) {
    console.error("Error checking email:", error);
    return false; // Return false in case of error
  }
};

// Function to register a user with a custom userId
export const registerWithCustomUserId = async (userId, email, password, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      userId,
      username,
      email,
      createdAt: new Date(),
      lastSeen: null,
      profilePic: "",
      status: "offline",
      contacts: [],
      archiveMessages: [],
      additionalInfo: {}
    });

    console.log("New user registered with custom userId:", userId);
    return user;
  } catch (error) {
    console.error("Error registering user:", error);
    return null;
  }
};

// Function to sign in with Google using Expo Auth
export const signInWithGoogle = async () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '911343565754-7smib2dlin3fklcv11m0rn1j98ssss0m.apps.googleusercontent.com', // Replace with your actual Android client ID
  });

  // Handle OAuth success response
  if (response?.type === 'success') {
    const { id_token } = response.authentication;
    const credential = GoogleAuthProvider.credential(id_token);

    try {
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;
      console.log('User signed in with Google:', user);
      return user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  } else {
    // Show the Google sign-in prompt if the user hasn't completed the OAuth session
    await promptAsync();
  }
};

// Function to check if the username exists for a Google user
export const checkIfUsernameExistsForGoogleUser = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      return !!userData.username; // Return true if username exists
    }
    return false; // Username doesn't exist
  } catch (error) {
    console.error('Error checking username:', error);
    throw error;
  }
};

// Function to add a username for a Google user
export const addUsernameForGoogleUser = async (userId, googleUser, username) => {
  try {
    const userRef = doc(db, 'users', userId); // Use custom userId instead of googleUser.uid
    await setDoc(userRef, {
      userId,
      username,
      email: googleUser.email,
      profilePic: googleUser.photoURL || '',
      createdAt: new Date(),
      lastSeen: null,
      status: 'online',
      contacts: [],
      archiveMessages: [],
      additionalInfo: {}
    }, { merge: true });

    console.log('Username added for Google user with custom userId:', userId);
  } catch (error) {
    console.error('Error adding username for Google user:', error);
    throw error;
  }
};

// Function to reset password via email
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent to:", email);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

// Function to sign out the user
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    console.log("User signed out.");
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Listener to monitor authentication state changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
