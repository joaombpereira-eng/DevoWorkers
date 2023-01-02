import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import {StatusBar} from 'react-native';
import UserDetailsScreen from '../screens/users/UserDetailsScreen';
import AddNewUserScreen from '../screens/users/AddNewUserScreen';
import ProjectDetailsScreen from '../screens/projects/ProjectDetailsScreen';

export type RootStackParamList = {
  Login: undefined;
  Tab: {role: string};
  UserDetails: undefined;
  ProjectDetails: undefined;
  AddNewUser: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle={'dark-content'}
      />
      <RootStack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          contentStyle: {backgroundColor: '#ffe7c2'},
        }}>
        <RootStack.Group>
          <RootStack.Screen name="Login" component={LoginScreen} />
          <RootStack.Screen name="Tab" component={TabNavigator} />
        </RootStack.Group>
        <RootStack.Group>
          <RootStack.Screen name="UserDetails" component={UserDetailsScreen} />
        </RootStack.Group>
        <RootStack.Group>
          <RootStack.Screen
            name="ProjectDetails"
            component={ProjectDetailsScreen}
          />
        </RootStack.Group>
        <RootStack.Group>
          <RootStack.Screen name="AddNewUser" component={AddNewUserScreen} />
        </RootStack.Group>
      </RootStack.Navigator>
    </>
  );
}
