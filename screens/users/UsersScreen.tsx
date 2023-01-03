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
import {UserData, users} from '../../data/users';
import {useEffect, useState} from 'react';
import UserCard from '../../components/cards/UserCard';
import Input from '../../components/forms/Input';
import IconButton from '../../components/buttons/IconButton';

export type UsersScreenNavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, 'Users'>,
  NativeStackNavigationProp<RootStackParamList, 'Tab'>
>;

type UsersScreenRouteProp = RouteProp<RootStackParamList, 'Tab'>;

export default function UsersScreen() {
  const [filteredData, setFilteredData] = useState<UserData[]>([]);
  const [search, setSearch] = useState<string>('');
  const navigation = useNavigation<UsersScreenNavigationProps>();
  const route = useRoute<UsersScreenRouteProp>();
  console.log('Route');
  console.log(route.params);

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
        {/* {route.params.role === 'SysAdmin' && ( */}
        <View style={styles.iconsContainer}>
          <IconButton
            name="user-plus"
            color="black"
            onPress={() => {
              navigation.navigate('AddNewUser');
            }}
            size={25}
          />
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
        {/* )} */}
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
