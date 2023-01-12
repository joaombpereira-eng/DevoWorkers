import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  Alert,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
} from 'react-native';
import {
  RouteProp,
  useRoute,
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native';
import {RootStackParamList} from '../../navigator/RootNavigator';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {TabStackParamList} from '../../navigator/TabNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import IconButton from '../../components/buttons/IconButton';
import InfoForm from '../../components/forms/InfoForm';
import Button from '../../components/buttons/Button';
import {Dropdown} from 'react-native-element-dropdown';
import {Role, roles} from '../../data/roles';
import {useEffect, useState} from 'react';
import {ProjectData} from '../../data/projects';
import {useDispatch, useSelector} from 'react-redux';
import {selectProjects} from '../../redux/slices/projects/projectsListSlice';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../util/constants';
import InputForm from '../../components/forms/InputForm';
import {UserData} from '../../data/users';
import {setUser} from '../../redux/slices/users/userSlice';
import LoadingOverlay from '../../components/LoadingOverlay';
import {setUsers} from '../../redux/slices/users/usersListSlice';

type EditUserScreenNavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList>,
  NativeStackNavigationProp<RootStackParamList, 'EditUser'>
>;

type EditUserScreenRouteProps = RouteProp<RootStackParamList, 'EditUser'>;

export default function EditUser() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigation = useNavigation<EditUserScreenNavigationProps>();
  const {
    params: {user},
  } = useRoute<EditUserScreenRouteProps>();
  const [rolePicked, setRolePicked] = useState<string | undefined>(user?.role);
  const [imagePicked, setImagePicked] = useState<string>('');
  const [projectPicked, setProjectPicked] = useState<string>('');
  const {projects, loading, error} = useSelector(selectProjects);
  const dispatch = useDispatch();

  function validRole(rolePicked?: string) {
    if (rolePicked) {
      const roleName = roles.filter(role => role.name === rolePicked);
      if (roleName.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  async function fetchUsers() {
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
  }

  async function updateUser() {
    setIsSubmitting(true);
    try {
      const projectAlreadyInUser = user?.projects.includes(projectPicked);
      projectPicked &&
        !projectAlreadyInUser &&
        user?.projects.push(projectPicked);
      const token = await AsyncStorage.getItem('AccessToken');
      const res = await axios.put(
        `${BASE_URL}/user`,
        {
          userId: user?.userId,
          avatar: imagePicked ? imagePicked : user?.avatar,
          role: rolePicked ? rolePicked : user?.role,
          projects: user?.projects,
        },
        {
          headers: {
            Authorization: 'bearer ' + token,
          },
        },
      );
      dispatch(setUser(res.data));
      setIsSubmitting(false);
    } catch (e) {
      console.log('error edit user');
      console.log(e);
      setIsSubmitting(false);
    }
  }

  function updateUserHandler() {
    if (validRole(rolePicked)) {
      updateUser();
      fetchUsers();
      navigation.navigate('UserDetails', {userId: user?.userId});
    } else {
      Alert.alert(
        'Wrong Role!',
        'Insert one of the following Roles: SysAdmin, ProjectManager, Developer, QA or Designer',
      );
    }
  }

  async function requestCameraPermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
            buttonPositive: '',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (e) {
        console.warn(e);
        return false;
      }
    } else return true;
  }

  async function requestExternalWritePermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
            buttonPositive: '',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (e) {
        console.warn(e);
        Alert.alert('Write permission err');
      }
      return false;
    } else return true;
  }

  async function pickImage() {
    const isCameraPermitted = await requestCameraPermission();
    const isStoragePermitted = await requestExternalWritePermission();

    if (isCameraPermitted && isStoragePermitted) {
      let result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        includeBase64: true,
      });

      if (!result.didCancel) {
        setImagePicked(result.assets[0].base64);
      }
    }
  }

  async function captureImage() {
    const isCameraPermitted = await requestCameraPermission();
    const isStoragePermitted = await requestExternalWritePermission();

    if (isCameraPermitted && isStoragePermitted) {
      let result = await launchCamera({
        mediaType: 'photo',
        quality: 1,
        includeBase64: true,
      });

      if (!result.didCancel) {
        setImagePicked(result.assets[0].base64);
      }
    }
  }

  function selectType() {
    Alert.alert(
      'Select',
      'Let us know where you want the photo from',
      [
        {
          text: 'Gallery',
          onPress: () => pickImage(),
          style: 'default',
        },
        {
          text: 'Camera',
          onPress: () => captureImage(),
          style: 'default',
        },
      ],
      {
        cancelable: true,
        onDismiss: () => console.log('Deal later'),
      },
    );
  }

  let avatarOrImagePicked = imagePicked ? (
    <Image
      source={{uri: `data:image/png;base64,${imagePicked}`}}
      style={styles.image}
      resizeMode="contain"
    />
  ) : (
    <Image
      source={{uri: `data:image/png;base64,${user?.avatar}`}}
      style={styles.image}
    />
  );

  if (isSubmitting) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconsContainer}>
        <IconButton
          name="close"
          color="black"
          size={25}
          onPress={navigation.goBack}
        />
      </View>
      <View style={styles.bodyContainer}>
        <ScrollView>
          <View style={styles.avatar}>
            <TouchableOpacity onPress={selectType}>
              {avatarOrImagePicked}
            </TouchableOpacity>
          </View>
          <View>
            <View style={[styles.infoContainer, {marginTop: 20}]}>
              <Text style={styles.info}>DevoWorker Information</Text>
            </View>
            <InputForm
              info="Role"
              text={rolePicked}
              onChangeText={setRolePicked}
              isBirthday={false}
              defaultValue={user?.role}
            />
            <View style={styles.workContainer}>
              <View style={styles.infoWorkContainer}>
                <Text style={styles.infoWork}>Projects</Text>
              </View>
              <Dropdown
                style={styles.dropdown}
                data={projects}
                value={projectPicked}
                onChange={item => setProjectPicked(item.projectId)}
                labelField="name"
                valueField="projectId"
                placeholder="Select Project"
                placeholderStyle={styles.placeholder}
                selectedTextStyle={styles.selectedText}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                deleteStyle={styles.deleteButton}
                onPress={updateUserHandler}>
                Update
              </Button>
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
  dropdown: {
    height: 55,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: 'white',
  },
  placeholder: {
    fontSize: 16,
    color: 'black',
  },
  selectedText: {
    fontSize: 16,
    color: 'black',
  },
});
