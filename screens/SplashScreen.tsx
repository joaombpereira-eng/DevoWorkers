import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {RootStackParamList} from '../navigator/RootNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SplashScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  'Splash'
>;

export default function SplashScreen() {
  const navigation = useNavigation<SplashScreenNavigationProps>();

  async function handleToken() {
    const token = await AsyncStorage.getItem('AccessToken');
    if (token) {
      navigation.navigate('Tab');
    } else {
      navigation.navigate('Login');
    }
  }

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
