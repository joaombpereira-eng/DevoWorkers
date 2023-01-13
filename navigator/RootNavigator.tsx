import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import UserDetailsScreen from '../screens/users/UserDetailsScreen';
import AddNewUserScreen from '../screens/users/AddNewUserScreen';
import EditUserScreen from '../screens/users/EditUserScreen';
import ProjectDetailsScreen from '../screens/projects/ProjectDetailsScreen';
import SplashScreen from '../screens/SplashScreen';
import {UserData} from '../data/users';
import EditMyUserScreen from '../screens/users/EditMyUserScreen';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Tab: undefined;
  UserDetails: {userId: number | undefined};
  ProjectDetails: {projectId: string};
  AddNewUser: undefined;
  EditUser: {user: UserData | undefined};
  EditMyUser: {user: UserData | undefined};
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <RootStack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: '#ffe7c2'},
      }}>
      <RootStack.Group>
        <RootStack.Screen name="Splash" component={SplashScreen} />
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
      <RootStack.Group>
        <RootStack.Screen name="EditUser" component={EditUserScreen} />
      </RootStack.Group>
      <RootStack.Group>
        <RootStack.Screen name="EditMyUser" component={EditMyUserScreen} />
      </RootStack.Group>
    </RootStack.Navigator>
  );
}
