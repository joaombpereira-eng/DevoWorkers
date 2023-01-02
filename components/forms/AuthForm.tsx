import {StyleSheet, Text, TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  isEmail: boolean;
  input: string;
  onChangeText: (text: string) => void;
};

export default function AuthForm({isEmail, onChangeText, input}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{isEmail ? 'Email' : 'Password'}</Text>
      <View style={styles.inputContainer}>
        <Icon
          style={styles.icon}
          name={isEmail ? 'alternate-email' : 'lock'}
          color="white"
          size={16}
        />
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={onChangeText}
          keyboardType={isEmail ? 'email-address' : 'default'}
          secureTextEntry={isEmail ? false : true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  text: {
    marginVertical: 8,
    color: 'black',
    fontSize: 16,
  },
  inputContainer: {
    width: '100%',
    height: 50,
    backgroundColor: 'black',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 20,
  },
  input: {
    marginLeft: 10,
    width: '70%',
    color: 'white',
    fontSize: 16,
  },
});
