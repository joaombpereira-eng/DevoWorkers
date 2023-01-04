import {View, StyleSheet, Text, Alert} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootNavigator';
import {useNavigation} from '@react-navigation/native';
import AuthForm from '../components/forms/AuthForm';
import Button from '../components/buttons/Button';
import {useState} from 'react';
import {users} from '../data/users';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');

  const validEmail: boolean = emailInput.includes('@');
  const validPassword: boolean = passwordInput.length > 6;

  function loginHandler() {
    const user = users.filter(item => item.email === emailInput);

    if (user[0]?.password === passwordInput && validEmail && validPassword) {
      const role = user[0].role;
      console.log('ROLE LOGIN');
      console.log(role.name);
      navigation.navigate('Tab');
    } else {
      Alert.alert('Login failed', 'Your email or password is incorrect.');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>DevoWorkers</Text>
      </View>
      <AuthForm isEmail input={emailInput} onChangeText={setEmailInput} />
      <AuthForm
        isEmail={false}
        input={passwordInput}
        onChangeText={setPasswordInput}
      />
      <Button onPress={loginHandler}>Login</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    marginVertical: 60,
  },
  title: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 40,
  },
  buttonForm: {
    marginVertical: 20,
  },
});
