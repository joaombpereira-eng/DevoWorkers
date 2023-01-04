import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RootNavigator from './navigator/RootNavigator';
import {Provider} from 'react-redux';
import {store} from './redux/store/store';
import {StatusBar} from 'react-native';

export default function App() {
  return (
    <>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle={'dark-content'}
      />
      <NavigationContainer>
        <Provider store={store}>
          <RootNavigator />
        </Provider>
      </NavigationContainer>
    </>
  );
}
