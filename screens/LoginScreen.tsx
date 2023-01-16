import {View, StyleSheet, Text, Alert} from 'react-native';
import {RootStackParamList} from '../navigator/RootNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import AuthForm from '../components/forms/AuthForm';
import Button from '../components/buttons/Button';
import LoadingOverlay from '../components/LoadingOverlay';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {setUserLogged} from '../redux/slices/login/loginSlice';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import {BASE_URL} from '../util/constants';
import {axiosApiInstance} from '../api/axiosApiInstance';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const dispatch = useDispatch();

  const validEmail: boolean = emailInput.includes('@');
  const validPassword: boolean = passwordInput.length > 6;

  const cleanInputs = () => {
    setEmailInput('');
    setPasswordInput('');
  };

  const login = async (email: string, password: string) => {
    setIsSubmitting(true);
    try {
      const res = await axiosApiInstance.post(`${BASE_URL}/auth/login`, {
        email: email,
        password: password,
      });
      AsyncStorage.setItem('AccessToken', res.data.data.accessToken);
      AsyncStorage.setItem('RefreshToken', res.data.data.refreshToken);
      axios.defaults.headers.common[
        'Authorization'
      ] = `bearer ${res.data.data.accessToken}`;
      const decoded =
        res.data.data.accessToken && jwt_decode(res.data.data.accessToken);
      dispatch(setUserLogged({role: decoded?.role, email: decoded?.email}));
      navigation.navigate('Tab');
    } catch (e) {
      Alert.alert('Ops! There was a problem!', `Message: ${e}`);
      setIsSubmitting(false);
      navigation.navigate('Login');
    }
  };

  const onLoginPress = () => {
    if (validEmail && validPassword) {
      login(emailInput, passwordInput);
      dispatch(setUserLogged({email: emailInput}));
      cleanInputs();
    } else {
      Alert.alert('Login failed', 'Your email or password is incorrect.');
    }
  };

  if (isSubmitting) {
    return <LoadingOverlay />;
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
      <Button onPress={onLoginPress}>Login</Button>
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
