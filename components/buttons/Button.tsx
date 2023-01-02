import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';

type Props = {
  children: string;
  onPress: () => void | undefined;
  deleteStyle?: Object;
};

export default function Button({children, onPress, deleteStyle}: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, deleteStyle]} onPress={onPress}>
        <Text style={styles.text}>{children}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    marginVertical: 30,
    borderRadius: 20,
  },
  button: {
    paddingHorizontal: 40,
    paddingVertical: 10,
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
});
