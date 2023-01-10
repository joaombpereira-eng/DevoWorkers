import {View, StyleSheet, Text} from 'react-native';

export default function MyUserScreen() {
  return (
    <View style={styles.container}>
      <Text>My User Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
