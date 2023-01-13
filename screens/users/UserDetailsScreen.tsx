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
import {RootStackParamList} from '../../navigator/RootNavigator';
import {TabStackParamList} from '../../navigator/TabNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import InfoForm from '../../components/forms/InfoForm';
import IconButton from '../../components/buttons/IconButton';
import Button from '../../components/buttons/Button';
import LoadingOverlay from '../../components/LoadingOverlay';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store/store';
import {setProject} from '../../redux/slices/projects/projectSlice';
import {
  removeUser,
  selectUserById,
  setUsers,
} from '../../redux/slices/users/usersListSlice';
import {selectUserLogged} from '../../redux/slices/login/loginSlice';
import {selectProjects} from '../../redux/slices/projects/projectsListSlice';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../util/constants';
import {formattedDate} from '../../util/formattedDate';
import {formattedImage} from '../../util/formattedImage';
import {UserData} from '../../data/users';
import {ProjectData} from '../../data/projects';

type UserDetailsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList>,
  NativeStackNavigationProp<RootStackParamList, 'UserDetails'>
>;

type UserDetailsScreenRouteProp = RouteProp<RootStackParamList, 'UserDetails'>;

export default function UserDetailsScreen() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(true);
  const [user, setUser] = useState<UserData>();
  const navigation = useNavigation<UserDetailsScreenNavigationProp>();
  const {
    params: {userId},
  } = useRoute<UserDetailsScreenRouteProp>();
  const dispatch = useDispatch();
  const {projects} = useSelector(selectProjects);
  const userById = useSelector((state: RootState) =>
    selectUserById(state, userId),
  )[0];
  const myUser = useSelector(selectUserLogged);

  const getUserById = async (id?: number) => {
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
  };

  const deleteUser = async (id?: number) => {
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
  };

  const fetchUsers = async () => {
    setIsSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('AccessToken');
      const res = await axios.get(`${BASE_URL}/user`, {
        headers: {
          Authorization: 'bearer ' + token,
        },
      });
      dispatch(setUsers(res.data));
      setIsSubmitting(false);
    } catch (e) {
      console.log('error');
      console.log(e);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    getUserById(userId);
  }, [userById]);

  const projectsFilter = projects.filter(item => {
    if (user?.projects.includes(item.projectId)) {
      return true;
    }
  });

  const onDeletePress = () => {
    deleteUser(user?.userId);
    dispatch(removeUser(user));
    navigation.navigate('Users');
  };

  const onClosePress = () => {
    fetchUsers();
    navigation.navigate('Tab');
  };

  const onEditIconPress = () => {
    navigation.navigate('EditUser', {user: user});
  };

  const onProjectPress = (project: ProjectData) => {
    dispatch(setProject(project));
    navigation.navigate('ProjectDetails', {
      projectId: project.projectId,
    });
  };

  if (isSubmitting) {
    return <LoadingOverlay />;
  }

  const projectsSection =
    projectsFilter.length !== 0 ? (
      projectsFilter.map(item => (
        <TouchableOpacity
          onPress={() => onProjectPress(item)}
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
  const sysAdminEmail = myUser.email === user?.email;

  return (
    <View style={styles.container}>
      <View style={styles.iconsContainer}>
        {sysAdminRole && (
          <View style={styles.editIcon}>
            <TouchableOpacity onPress={onEditIconPress}>
              <Icon name="edit" color="black" size={25} />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.exitIcon}>
          <IconButton
            name="close"
            color="black"
            size={25}
            onPress={onClosePress}
          />
        </View>
      </View>
      <View style={styles.bodyContainer}>
        <ScrollView>
          <View style={styles.avatar}>
            <Image
              source={{uri: formattedImage(user?.avatar)}}
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
            {sysAdminRole && !sysAdminEmail && (
              <View style={styles.buttonContainer}>
                <Button
                  deleteStyle={styles.deleteButton}
                  onPress={onDeletePress}>
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
