import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {UsersScreenNavigationProps} from '../../screens/users/UsersScreen';
import {setUser} from '../../redux/slices/userSlice';
import {useDispatch} from 'react-redux';
import {Role} from '../../data/roles';
import {ProjectData} from '../../data/projects';

type Props = {
  id: number;
  name: string;
  email: string;
  role: Role;
  password: string;
  birthday: Date;
  avatar: string;
  project: string[];
};

export default function UserCard({
  id,
  name,
  email,
  role,
  password,
  birthday,
  avatar,
  project,
}: Props) {
  const navigation = useNavigation<UsersScreenNavigationProps>();
  const dispatch = useDispatch();

  function onPress() {
    dispatch(
      setUser({id, name, email, role, password, birthday, avatar, project}),
    );
    navigation.navigate('UserDetails', {userId: id});
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.rootContainer}>
          <View style={styles.infoOuterContainer}>
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.email}>{email}</Text>
            </View>
            <View>
              <View style={styles.roleContainer}>
                <Text style={styles.role}>{role.name}</Text>
              </View>
            </View>
          </View>
          <View style={styles.avatarContainer}>
            <Image
              source={{uri: avatar}}
              style={styles.avatar}
              resizeMode="contain"
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: 'white',
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 4,
  },
  rootContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoOuterContainer: {
    justifyContent: 'flex-start',
  },
  infoContainer: {
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
  },
  email: {
    color: 'black',
  },
  avatarContainer: {
    justifyContent: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  roleContainer: {
    marginTop: 20,
  },
  role: {
    color: 'black',
  },
});
