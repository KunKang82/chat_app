import { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { collection, query, orderBy, addDoc, onSnapshot } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

const Chat = ({ route, navigation, db, isConnected, storage }) => {

  // Destructre the parameters form the route object
  const { name, color, userID } = route.params;

  // Set the initial state for messages
  const [messages, setMessages] = useState([]);

  // Need to declare unsubMessages variable outside the useEffect() callback function, but inside the compnent so that
  // you can unsubscribe and disable the old onSnapshot listener before you lose any reference to it. This is because
  // re-initializing any kind of listener doesn’t override and remove the old listener, it only removes the reference
  // to that old listener, while keeping it alive somewhere in the memory without a way of reaching it, resulting in a memory leak.
  let unsubMessages;

  // if there's a connection: fetch messages from firebase, if not: load from Async storage (loadCachedMessages)
  useEffect(() => {
    //Set screen title according to give name from prop
    navigation.setOptions({ title: name })

    // Check if connected to the internet
    if (isConnected === true) {
      // Unregister current onSnapshot() listener to avoid registering multiple
      // listeners when useEffect code is re-executed.
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      // Create stream with database to read messages
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      // Subscribe to real-teim updates using onSnapshot
      unsubMessages = onSnapshot(q, docs => {
        let newMessages = [];
        // process each document and create a new message object
        docs.forEach(doc => {
          newMessages.push({
            id: doc.id, // Set unique _id value for each message
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis())
          });
        });
        // Cache the messages and update the state
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
      // Load cached messages if not connected
    } else loadCachedMessages();

    // Clean up code
    return () => {
      if (unsubMessages) unsubMessages();
    }
  }, [isConnected]); // Allows the component to call the callback of useEffect whenever the isConnected prop's value changes

  // Load messages from AsyncStorage cache and stores messages to localStorage (asyncStorage)
  const loadCachedMessages = async () => {
    // || [] will assign an empty array to cachedMessages in case AsyncStorage.getItem("chat") fails when the chat item has 
    // been set yet in AsyncStorage. Known as "logical OR assignment operator" in jS
    const cachedMessages = await AsyncStorage.getItem("messages") || [];
    setMessages(JSON.parse(cachedMessages));
  }

  // same logic as when using localStorage, and "try-catch" is an error handler to prevent the app from crashing in case
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  }

  // Handle sending a new message
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0])
  }

  // Customize the appearance of the message bubble
  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#000"
        },
        left: {
          backgroundColor: "#FFF"
        }
      }}
    />
  }

  // Render the input toolbar if connected to online
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  }

  const renderCustomActions = (props) => {
    return <CustomActions userID={userID} storage={storage} {...props} />;
  };

  // Render  element with map and geolocation
  const renderCustomView = (props) => {
    const { currentMessage} = props;
    if (currentMessage.location) { // render a amp
      return (
          <MapView
            style={{width: 150,
              height: 100,
              borderRadius: 13,
              margin: 3}}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
      );
    }
    return null;
  }

  // Render the Chat component
  return (
    //Set background color according to given prop color from start screen
    <View style={[styles.container, { backgroundColor: color }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar} //function that returns <InputToolbar {...props}/> if there’s a connection, otherwise, it returns a null
        onSend={messages => onSend(messages)}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        user={{
          _id: userID,
          name
        }}
      />
      {/* fix for blocked view on android */}
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoutButton: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "#C00",
    padding: 10,
    zIndex: 1
  },
  logoutButtonText: {
    color: "#FFF",
    fontSize: 10
  }
});

export default Chat;
