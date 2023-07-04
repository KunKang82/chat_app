import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Alert } from 'react-native';
import { getAuth, signInAnonymously } from "firebase/auth";

const Start = ({ navigation }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const auth = getAuth();

  const signInUser = () => {
    signInAnonymously(auth)
      .then(result => {
        // Pass the user's name and selected background color
        navigation.navigate("Chat", {userID: result.user.uid, name: name, color: color });
        Alert.alert("Signed in Successfully!");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, try later again.");
      })
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/Background_Image.png')} resizeMode="cover" style={styles.image}>
        <Text style={styles.title}>Chat App!</Text>
        <View style={styles.subContainer}>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder='Type your username here'
            placeholderTextColor="#757083"
          />
          <Text style={styles.colorText}>Choose your background color</Text>
          <View style={styles.colorContainer}>
            <TouchableOpacity
              style={[styles.color, { backgroundColor: '#090C08' }]}
              onPress={() => setColor('#090C08')}
            />
            <TouchableOpacity
              style={[styles.color, { backgroundColor: '#474056' }]}
              onPress={() => setColor('#474056')}
            />
            <TouchableOpacity
              style={[styles.color, { backgroundColor: '#8A95A5' }]}
              onPress={() => setColor('#8A95A5')}
            />
            <TouchableOpacity
              style={[styles.color, { backgroundColor: '#B9C6AE' }]}
              onPress={() => setColor('#B9C6AE')}
            />
          </View>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#757083' }]}
            onPress={() => {signInUser(name, color)}}
          >
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      {/* fix for blocked view on android */}
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    width: '88%',
    padding: 15,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15,
    fontSize: 16,
    fontWeight: '300',
    color: 'black'
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: '30%',
  },
  colorContainer: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },
  subContainer: {
    width: '88%',
    height: '44%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
    backgroundColor: 'white'
  },
  color: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  colorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 1
  },
  button: {
    width: '88%',
    height: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    backgroundColor: '#757083'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Start;
