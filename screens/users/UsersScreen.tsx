import {View, Text, StyleSheet, FlatList} from 'react-native';
import {RootStackParamList} from '../../navigator/RootNavigator';
import {TabStackParamList} from '../../navigator/TabNavigator';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import UserCard from '../../components/cards/UserCard';
import Input from '../../components/forms/Input';
import IconButton from '../../components/buttons/IconButton';
import LoadingOverlay from '../../components/LoadingOverlay';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectUsers, setUsers} from '../../redux/slices/users/usersListSlice';
import {selectUserLogged} from '../../redux/slices/login/loginSlice';
import {setProjects} from '../../redux/slices/projects/projectsListSlice';
import {UserData} from '../../data/users';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../util/constants';

export type UsersScreenNavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, 'Users'>,
  NativeStackNavigationProp<RootStackParamList, 'Tab'>
>;

export default function UsersScreen() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<UserData[]>([]);
  const [search, setSearch] = useState<string>('');
  const dispatch = useDispatch();
  const {users} = useSelector(selectUsers);
  const myUser = useSelector(selectUserLogged);
  const navigation = useNavigation<UsersScreenNavigationProps>();

  const fetchUsers = async () => {
    setIsSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('AccessToken');
      const res = await axios.get(`${BASE_URL}/user`, {
        headers: {
          Authorization: 'bearer ' + token,
        },
      });
      setIsSubmitting(false);
      dispatch(setUsers(res.data));
    } catch (e) {
      console.log('error fetching users');
      console.log(e);
      setIsSubmitting(false);
    }
  };

  const fetchProjects = async () => {
    setIsSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('AccessToken');
      const res = await axios.get(`${BASE_URL}/project`, {
        headers: {
          Authorization: 'bearer ' + token,
        },
      });
      dispatch(setProjects(res.data));
      setIsSubmitting(false);
    } catch (e) {
      console.log('error project');
      console.log(e);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, [myUser]);

  const searchFilter = (text: string) => {
    if (text) {
      const newData = users.filter(item => {
        const itemData = item.name.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.includes(textData);
      });
      setFilteredData(newData);
      setSearch(text);
    } else {
      setFilteredData([]);
      setSearch(text);
    }
  };

  const onLogoutIconPress = async () => {
    try {
      delete axios.defaults.headers.common['Authorization'];
      AsyncStorage.removeItem('AccessToken');
      navigation.navigate('Login');
    } catch (e) {
      console.log(e);
      setIsSubmitting(false);
    }
  };

  const onAddUserIconPress = () => {
    navigation.navigate('AddNewUser');
  };

  if (isSubmitting) {
    return <LoadingOverlay />;
  }

  const sysAdminRole = myUser.role === 'SysAdmin';

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Users</Text>
        <View style={styles.iconsContainer}>
          {sysAdminRole && (
            <IconButton
              name="user-plus"
              color="black"
              onPress={onAddUserIconPress}
              size={25}
            />
          )}
          <View style={styles.logoutContainer}>
            <IconButton
              name="sign-out"
              color="black"
              onPress={onLogoutIconPress}
              size={25}
            />
          </View>
        </View>
      </View>
      <Input isUserScreen onChangeText={searchFilter} text={search} />
      <View style={styles.bodyContainer}>
        <FlatList
          data={
            filteredData !== users && filteredData.length !== 0
              ? filteredData
              : users
          }
          renderItem={({item}) => <UserCard {...item} />}
          keyExtractor={item => (item.userId + Math.random()).toString()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffe7c2',
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    height: '15%',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconsContainer: {
    flexDirection: 'row',
  },
  logoutContainer: {
    marginLeft: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    color: 'black',
  },
  bodyContainer: {
    backgroundColor: '#EFEDEC',
    flex: 1,
  },
});
