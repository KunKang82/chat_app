import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Chat = ({ route, navigation }) => {
  const { name, color } = route.params;

  useEffect(() => {
    //Set creen title according to give name from prop
    navigation.setOptions({ title: name });
  }, []);

  return (
    //Set background color according to given prop color from start screen
    <View style={[styles.container, { backgroundColor: color }]}>
      <Text>Hello {name}!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default Chat;
