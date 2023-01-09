import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {UsersScreenNavigationProps} from '../../screens/users/UsersScreen';
import {setUser} from '../../redux/slices/users/userSlice';
import {useDispatch} from 'react-redux';

type Props = {
  userId: number;
  name: string;
  email: string;
  role: string;
  password: string;
  birthDate: Date;
  avatar: string;
  projects: string[];
};

export default function UserCard({
  userId,
  name,
  email,
  role,
  password,
  birthDate,
  avatar,
  projects,
}: Props) {
  const navigation = useNavigation<UsersScreenNavigationProps>();
  const dispatch = useDispatch();

  function onPress() {
    dispatch(
      setUser({
        userId,
        name,
        email,
        role,
        password,
        birthDate,
        avatar,
        projects,
      }),
    );
    navigation.navigate('UserDetails', {userId: userId});
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
                <Text style={styles.role}>{role}</Text>
              </View>
            </View>
          </View>
          <View style={styles.avatarContainer}>
            <Image
              source={{uri: `data:image/png;base64,${avatar}`}}
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
