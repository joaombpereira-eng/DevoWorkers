import {StyleSheet, Text, View} from 'react-native';
import {RootStackParamList} from '../navigator/RootNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {setUserLogged} from '../redux/slices/login/loginSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode, {JwtPayload} from 'jwt-decode';

type SplashScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  'Splash'
>;

export default function SplashScreen() {
  const navigation = useNavigation<SplashScreenNavigationProps>();
  const dispatch = useDispatch();

  const handleToken = async () => {
    const token = await AsyncStorage.getItem('AccessToken');
    if (token) {
      const decoded = jwt_decode(token);
      dispatch(setUserLogged({role: decoded?.role, email: decoded?.email}));
      navigation.navigate('Tab');
    } else {
      navigation.navigate('Login');
    }
  };

  useEffect(() => {
    setTimeout(() => {
      handleToken();
    }, 2500);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>DevoWorkers</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'black',
    fontSize: 40,
    fontWeight: 'bold',
  },
});
