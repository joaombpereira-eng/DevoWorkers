import {View, Text, StyleSheet, FlatList} from 'react-native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {
  CompositeNavigationProp,
  useNavigation,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {TabStackParamList} from '../../navigator/TabNavigator';
import {RootStackParamList} from '../../navigator/RootNavigator';
import {UserData} from '../../data/users';
import {useEffect, useState} from 'react';
import UserCard from '../../components/cards/UserCard';
import Input from '../../components/forms/Input';
import IconButton from '../../components/buttons/IconButton';
import {useSelector} from 'react-redux';
import {selectUsers} from '../../redux/slices/users/usersListSlice';
import {selectUserLogged} from '../../redux/slices/login/loginSlice';

export type UsersScreenNavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, 'Users'>,
  NativeStackNavigationProp<RootStackParamList, 'Tab'>
>;

type UsersScreenRouteProp = RouteProp<RootStackParamList, 'Tab'>;

export default function UsersScreen() {
  const [filteredData, setFilteredData] = useState<UserData[]>([]);
  const [search, setSearch] = useState<string>('');
  const users = useSelector(selectUsers);
  const navigation = useNavigation<UsersScreenNavigationProps>();
  const userLogged = useSelector(selectUserLogged);

  useEffect(() => {
    setFilteredData(users);
  }, [users]);

  function searchFilter(text: string) {
    if (text) {
      const newData = filteredData.filter(item => {
        const itemData = item.name.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.includes(textData);
      });
      setFilteredData(newData);
      setSearch(text);
    } else {
      setFilteredData(users);
      setSearch(text);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Users</Text>
        <View style={styles.iconsContainer}>
          {userLogged.role.name === 'SysAdmin' && (
            <IconButton
              name="user-plus"
              color="black"
              onPress={() => {
                navigation.navigate('AddNewUser');
              }}
              size={25}
            />
          )}
          <View style={styles.logoutContainer}>
            <IconButton
              name="sign-out"
              color="black"
              onPress={() => {
                navigation.navigate('Login');
              }}
              size={25}
            />
          </View>
        </View>
      </View>
      <Input isUserScreen onChangeText={searchFilter} text={search} />
      <View style={styles.bodyContainer}>
        <FlatList
          data={filteredData}
          renderItem={({item}) => <UserCard {...item} />}
          keyExtractor={item => (item.id + Math.random()).toString()}
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
    marginRight: 10,
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
    marginRight: 10,
  },
});
