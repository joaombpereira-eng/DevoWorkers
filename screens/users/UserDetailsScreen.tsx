import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  CompositeNavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {TabStackParamList} from '../../navigator/TabNavigator';
import {RootStackParamList} from '../../navigator/RootNavigator';
import {useDispatch, useSelector} from 'react-redux';
import {setProject} from '../../redux/slices/projects/projectSlice';
import InfoForm from '../../components/forms/InfoForm';
import IconButton from '../../components/buttons/IconButton';
import Button from '../../components/buttons/Button';
import {
  removeUser,
  selectUserById,
  setUsers,
} from '../../redux/slices/users/usersListSlice';
import {selectUserLogged} from '../../redux/slices/login/loginSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL} from '../../util/constants';
import {useEffect, useState} from 'react';
import {UserData} from '../../data/users';
import {formattedDate} from '../../util/formattedDate';
import {selectProjects} from '../../redux/slices/projects/projectsListSlice';
import LoadingOverlay from '../../components/LoadingOverlay';
import Icon from 'react-native-vector-icons/FontAwesome';
import {RootState} from '../../redux/store/store';
import {selectUser, setUser} from '../../redux/slices/users/userSlice';

type UserDetailsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList>,
  NativeStackNavigationProp<RootStackParamList, 'UserDetails'>
>;

type UserDetailsScreenRouteProp = RouteProp<RootStackParamList, 'UserDetails'>;

export default function UserDetailsScreen() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [user, setUser] = useState<UserData>();
  const navigation = useNavigation<UserDetailsScreenNavigationProp>();
  const {
    params: {userId},
  } = useRoute<UserDetailsScreenRouteProp>();
  const dispatch = useDispatch();
  const {projects, loading, error} = useSelector(selectProjects);
  const userById = useSelector((state: RootState) =>
    selectUserById(state, userId),
  )[0];
  const myUser = useSelector(selectUserLogged);

  async function getUserById(id?: number) {
    setIsSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('AccessToken');
      const res = await axios.get(`${BASE_URL}/user/${id}`, {
        headers: {
          Authorization: 'bearer ' + token,
        },
      });
      setUser(res.data);
      setIsSubmitting(false);
    } catch (e) {
      console.log('error get user');
      console.log(e);
      setIsSubmitting(false);
    }
  }

  async function deleteUser(id?: number) {
    setIsSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('AccessToken');
      await axios.delete(`${BASE_URL}/user/${id}`, {
        headers: {
          Authorization: 'bearer ' + token,
        },
      });
      setIsSubmitting(false);
    } catch (e) {
      console.log('error delete user');
      console.log(e);
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    getUserById(userId);
  }, [userId]);

  const projectsFilter = projects.filter(item => {
    if (user?.projects.includes(item.projectId)) {
      return true;
    }
  });

  function onDelete() {
    deleteUser(user?.userId);
    dispatch(removeUser(user));
    navigation.navigate('Users');
  }

  if (isSubmitting) {
    return <LoadingOverlay />;
  }

  const projectsSection =
    projectsFilter.length !== 0 ? (
      projectsFilter.map(item => (
        <TouchableOpacity
          onPress={() => {
            dispatch(setProject(item));
            navigation.navigate('ProjectDetails', {
              projectId: item.projectId,
            });
          }}
          key={item.projectId}
          style={styles.valueContainer}>
          <Text style={styles.value}>{item.name}</Text>
        </TouchableOpacity>
      ))
    ) : (
      <View style={styles.valueContainer}>
        <Text style={styles.value}>No Projects</Text>
      </View>
    );

  const sysAdminRole = myUser.role === 'SysAdmin';

  return (
    <View style={styles.container}>
      <View style={styles.iconsContainer}>
        {sysAdminRole && (
          <View style={styles.editIcon}>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditUser', {user: user})}>
              <Icon name="edit" color="black" size={25} />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.exitIcon}>
          <IconButton
            name="close"
            color="black"
            size={25}
            onPress={navigation.goBack}
          />
        </View>
      </View>
      <View style={styles.bodyContainer}>
        <ScrollView>
          <View style={styles.avatar}>
            <Image
              source={{uri: `data:image/png;base64,${user?.avatar}`}}
              style={styles.image}
            />
          </View>
          <View>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{user?.name}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.info}>Personal Information</Text>
            </View>
            <InfoForm info="Email" value={user?.email} />
            <InfoForm info="Birthday" value={formattedDate(user?.birthDate)} />
            <View style={[styles.infoContainer, {marginTop: 20}]}>
              <Text style={styles.info}>DevoWorker Information</Text>
            </View>
            <InfoForm info="Role" value={user?.role} />
            <View style={styles.workContainer}>
              <View style={styles.infoWorkContainer}>
                <Text style={styles.infoWork}>Projects</Text>
              </View>
              {projectsSection}
            </View>
            {sysAdminRole && (
              <View style={styles.buttonContainer}>
                <Button deleteStyle={styles.deleteButton} onPress={onDelete}>
                  Delete
                </Button>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 25,
    marginBottom: 10,
    backgroundColor: '#ffe7c2',
  },
  bodyContainer: {
    justifyContent: 'center',
    paddingBottom: 30,
    marginBottom: 30,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 14,
    paddingRight: 20,
  },
  exitIcon: {
    paddingLeft: 15,
  },
  editIcon: {
    paddingTop: 4,
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  nameContainer: {
    padding: 20,
  },
  name: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 32,
  },
  infoContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#ded3fd',
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  info: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  workContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    flex: 1,
  },
  infoWorkContainer: {
    paddingVertical: 14,
  },
  infoWork: {
    color: 'black',
    fontSize: 18,
  },
  valueContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  value: {
    color: 'black',
    fontSize: 16,
  },
  buttonContainer: {
    marginHorizontal: 120,
  },
  deleteButton: {
    backgroundColor: '#DF4242',
    borderRadius: 20,
  },
});
