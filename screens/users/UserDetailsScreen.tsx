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
import {removeUser} from '../../redux/slices/users/usersListSlice';
import {selectUserLogged} from '../../redux/slices/login/loginSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL} from '../../util/constants';
import {useEffect, useState} from 'react';
import {UserData} from '../../data/users';
import {ProjectData} from '../../data/projects';
import {formattedDate} from '../../util/formattedDate';

type UserDetailsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList>,
  NativeStackNavigationProp<RootStackParamList, 'UserDetails'>
>;

type UserDetailsScreenRouteProp = RouteProp<RootStackParamList, 'UserDetails'>;

export default function UserDetailsScreen() {
  const [user, setUser] = useState<UserData>();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const navigation = useNavigation<UserDetailsScreenNavigationProp>();
  const {
    params: {userId},
  } = useRoute<UserDetailsScreenRouteProp>();
  const dispatch = useDispatch();
  const userLogged = useSelector(selectUserLogged);

  async function getUserById(id: number) {
    try {
      const token = await AsyncStorage.getItem('AccessToken');
      const res = await axios.get(`${BASE_URL}/user/${id}`, {
        headers: {
          Authorization: 'bearer ' + token,
        },
      });
      setUser(res.data);
    } catch (e) {
      console.log('error');
      console.log(e);
    }
  }

  async function fetchProjects() {
    try {
      const token = await AsyncStorage.getItem('AccessToken');
      await axios
        .get(`${BASE_URL}/project`, {
          headers: {
            Authorization: 'bearer ' + token,
          },
        })
        .then(res => {
          setProjects(res.data);
        });
    } catch (e) {
      console.log('error project');
      console.log(e);
    }
  }

  useEffect(() => {
    getUserById(userId);
    fetchProjects();
  }, []);

  const projectsFilter = projects.filter(item => {
    if (user?.projects.includes(item.projectId)) {
      return true;
    }
  });

  function onDelete() {
    dispatch(removeUser(user));
    navigation.navigate('Users');
  }

  return (
    <View style={styles.container}>
      <View style={styles.exitButton}>
        <IconButton
          name="close"
          color="black"
          size={25}
          onPress={navigation.goBack}
        />
      </View>
      <View style={styles.bodyContainer}>
        <ScrollView>
          {/* <View style={styles.avatar}>
            <Image source={{uri: user.avatar}} style={styles.image} />
          </View> */}
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
              {projectsFilter.map(item => (
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
              ))}
            </View>
            {userLogged.role === 'SysAdmin' &&
              userLogged.name !== user?.name && (
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
  exitButton: {
    alignItems: 'flex-end',
    padding: 14,
    paddingRight: 20,
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
