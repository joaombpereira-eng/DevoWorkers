import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {RootStackParamList} from '../../navigator/RootNavigator';
import {TabStackParamList} from '../../navigator/TabNavigator';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import InfoForm from '../../components/forms/InfoForm';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import {selectUserLogged} from '../../redux/slices/login/loginSlice';
import {selectUsers} from '../../redux/slices/users/usersListSlice';
import {setProject} from '../../redux/slices/projects/projectSlice';
import {selectProjects} from '../../redux/slices/projects/projectsListSlice';
import {formattedDate} from '../../util/formattedDate';
import {formattedImage} from '../../util/formattedImage';
import {ProjectData} from '../../data/projects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../util/constants';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {UserData} from '../../data/users';
import LoadingOverlay from '../../components/LoadingOverlay';
import {axiosApiInstance} from '../../api/axiosApiInstance';

export type MyUserScreenNavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, 'Users'>,
  NativeStackNavigationProp<RootStackParamList, 'Tab'>
>;

export default function MyUserScreen() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(true);
  const [user, setUser] = useState<UserData>();
  const myUserFromToken = useSelector(selectUserLogged);
  const {users} = useSelector(selectUsers);
  const {projects} = useSelector(selectProjects);
  const dispatch = useDispatch();
  const navigation = useNavigation<MyUserScreenNavigationProps>();

  const myUser = users.filter(user => user.email === myUserFromToken.email);

  const getUserById = async (id?: number) => {
    setIsSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('AccessToken');
      const res = await axiosApiInstance.get(`${BASE_URL}/user/${id}`, {
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

  useEffect(() => {
    getUserById(myUser[0].userId);
  }, [myUser[0]]);

  const onProjectPress = (project: ProjectData) => {
    dispatch(setProject(project));
    navigation.navigate('ProjectDetails', {
      projectId: project.projectId,
    });
  };

  const onEditIconPress = () => {
    navigation.navigate('EditMyUser', {user: myUser[0]});
  };

  const projectsFilter = projects.filter(item => {
    if (user?.projects.includes(item.projectId)) {
      return true;
    }
  });

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

  if (isSubmitting) {
    <LoadingOverlay />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={onEditIconPress}>
          <Icon name="edit" color="black" size={25} />
        </TouchableOpacity>
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
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    paddingBottom: 15,
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
    padding: 20,
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
