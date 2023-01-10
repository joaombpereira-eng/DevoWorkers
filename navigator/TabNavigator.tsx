import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ProjectsScreen from '../screens/projects/ProjectsScreen';
import UsersScreen from '../screens/users/UsersScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import MyUserScreen from '../screens/users/MyUserScreen';

export type TabStackParamList = {
  Users: undefined;
  Projects: undefined;
  MyUser: undefined;
};

const Tab = createBottomTabNavigator<TabStackParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Users"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          if (route.name === 'Users') {
            return (
              <Icon
                name="users"
                size={30}
                color={focused ? '#f4cd8e' : '#EFEDEC'}
              />
            );
          } else if (route.name === 'Projects') {
            return (
              <Icon
                name="folder"
                size={30}
                color={focused ? '#f4cd8e' : '#EFEDEC'}
              />
            );
          } else if (route.name === 'MyUser') {
            return (
              <Icon
                name="user"
                size={30}
                color={focused ? '#f4cd8e' : '#EFEDEC'}
              />
            );
          }
        },
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveBackgroundColor: 'black',
        tabBarInactiveBackgroundColor: 'black',
        tabBarHideOnKeyboard: true,
      })}>
      <Tab.Screen name="Users" component={UsersScreen} />
      <Tab.Screen name="Projects" component={ProjectsScreen} />
      <Tab.Screen name="MyUser" component={MyUserScreen} />
    </Tab.Navigator>
  );
}
