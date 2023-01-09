import {View, StyleSheet, Text, Alert} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootNavigator';
import {useNavigation} from '@react-navigation/native';
import AuthForm from '../components/forms/AuthForm';
import Button from '../components/buttons/Button';
import {useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../util/constants';
import {useDispatch} from 'react-redux';
import {setUserLogged} from '../redux/slices/login/loginSlice';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const dispatch = useDispatch();

  const validEmail: boolean = emailInput.includes('@');
  const validPassword: boolean = passwordInput.length > 6;

  function cleanInputs() {
    setEmailInput('');
    setPasswordInput('');
  }

  async function login(email: string, password: string) {
    try {
      const res = await axios.post(`${BASE_URL}/user/login`, {
        email: email,
        password: password,
      });
      AsyncStorage.setItem('AccessToken', res.data.data);
      AsyncStorage.setItem('MyUserEmail', email);
      axios.defaults.headers.common[
        'Authorization'
      ] = `bearer ${res.data.data}`;
      navigation.navigate('Tab');
    } catch (e) {
      Alert.alert('Ops! There was a problem!', `Message: ${e}`);
    }
  }

  function loginHandler() {
    if (validEmail && validPassword) {
      login(emailInput, passwordInput);
      dispatch(setUserLogged({email: emailInput}));
      cleanInputs();
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
