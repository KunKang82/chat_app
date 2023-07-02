// import the screens
import Start from './components/Start';
import Chat from './components/Chat';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//import firebase and firestore
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Create the navigator
const Stack = createNativeStackNavigator();

// The app’s main Chat component that renders the chat UI
const App = () => {
// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAh216Ud4G42LCeZQSX1eYy-LtMHLbWbvQ",
  authDomain: "chatapp-be8d0.firebaseapp.com",
  projectId: "chatapp-be8d0",
  storageBucket: "chatapp-be8d0.appspot.com",
  messagingSenderId: "579769078008",
  appId: "1:579769078008:web:b70d7ea19f4d019370eb0d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen
          name="Chat"
        >
          {props => <Chat db={db} {...props} />}
        </Stack.Screen>        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
