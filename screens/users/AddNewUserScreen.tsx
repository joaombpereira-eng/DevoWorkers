import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {useState} from 'react';
import IconButton from '../../components/buttons/IconButton';
import InputForm from '../../components/forms/InputForm';
import DateForm from '../../components/forms/DateForm';
import Button from '../../components/buttons/Button';
import {Dropdown} from 'react-native-element-dropdown';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {TabStackParamList} from '../../navigator/TabNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigator/RootNavigator';
import {ProjectData} from '../../data/projects';
import {Role, roles} from '../../data/roles';
import {users} from '../../data/users';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import {addUser} from '../../redux/slices/users/usersListSlice';
import {selectProjects} from '../../redux/slices/projects/projectsListSlice';

type AddNewUserScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList>,
  NativeStackNavigationProp<RootStackParamList, 'AddNewUser'>
>;

export default function AddNewUserScreen() {
  const [role, setRole] = useState<Role>(roles[0]);
  const projects = useSelector(selectProjects);
  const [project, setProject] = useState<ProjectData>(projects[0]);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [birthday, setBirthday] = useState<Date>(new Date());
  const [imagePicked, setImagePicked] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const navigation = useNavigation<AddNewUserScreenNavigationProp>();
  const dispatch = useDispatch();

  function onPress() {
    navigation.goBack();
  }

  function saveHandler() {
    const projectSaved = projects.filter(item => item.name === project.name);
    const roleSaved = roles.indexOf(role);

    const validBirthday: boolean = birthday < new Date();
    const validEmail: boolean = email.includes('@');
    const validName: boolean = name.trim().length > 1;

    if (!validEmail) {
      Alert.alert('Invalid Email!');
      return;
    }

    if (!validName) {
      Alert.alert('Invalid Name!');
      return;
    }

    if (!validBirthday) {
      Alert.alert('Invalid Date!');
      return;
    }

    if (!imagePicked) {
      Alert.alert('Pick an Image!');
      return;
    }

    if (!name || !project || !role) {
      Alert.alert('Fill the Boxes!');
      return;
    }

    dispatch(
      addUser({
        id: users.length,
        name: name,
        email: email,
        role: roles[roleSaved],
        project: [projectSaved[0].projectId],
        password: '',
        avatar: imagePicked,
        birthday: new Date(birthday),
      }),
    );

    navigation.navigate('Users');
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
      });

      if (!result.didCancel) {
        setImagePicked(result.assets[0].uri);
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
      });

      console.log(result);

      if (!result.didCancel) {
        setImagePicked(result.assets[0].uri);
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

  let imageOrIcon = imagePicked ? (
    <Image
      source={{uri: imagePicked}}
      style={styles.image}
      resizeMode="contain"
    />
  ) : (
    <Icon name="camera" size={30} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <IconButton
          name="chevron-left"
          color="black"
          size={30}
          onPress={onPress}
        />
        <Text style={styles.header}>Add New User</Text>
      </View>
      <View style={styles.bodyContainer}>
        <ScrollView>
          <View style={styles.cameraContainer}>
            <TouchableOpacity
              style={styles.touchableCamera}
              onPress={selectType}>
              {imageOrIcon}
            </TouchableOpacity>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.info}>Personal Information</Text>
          </View>
          <InputForm
            info="Email"
            text={email}
            onChangeText={setEmail}
            isBirthday={false}
          />
          <InputForm
            info="Name"
            text={name}
            onChangeText={setName}
            isBirthday={false}
          />
          <DateForm
            info="Birthday"
            value={birthday.toLocaleDateString('en-GB')}
            open={open}
            date={birthday}
            onConfirm={date => {
              setOpen(false);
              setBirthday(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
            onPressButton={() => setOpen(true)}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.info}>Project Information</Text>
          </View>
          <View style={styles.projectInfoContainer}>
            <Text style={styles.projectInfo}>Role</Text>
          </View>
          <Dropdown
            style={styles.dropdown}
            data={roles}
            value={role.name}
            onChange={item => setRole(item)}
            labelField="name"
            valueField="id"
            placeholder="Select Role"
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
          />
          <View style={styles.projectInfoContainer}>
            <Text style={styles.projectInfo}>Project</Text>
          </View>
          <Dropdown
            style={styles.dropdown}
            data={projects}
            value={project.name}
            onChange={item => setProject(item)}
            labelField="name"
            valueField="projectId"
            placeholder="Select Project"
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
          />
          <View style={styles.buttonContainer}>
            <Button onPress={saveHandler}>Save</Button>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  header: {
    fontWeight: 'bold',
    fontSize: 30,
    color: 'black',
  },
  bodyContainer: {
    backgroundColor: '#EFEDEC',
    flex: 1,
    paddingBottom: 20,
  },
  infoContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#ded3fd',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  info: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropdown: {
    height: 60,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    marginHorizontal: 20,
  },
  placeholder: {
    fontSize: 16,
    color: 'black',
  },
  selectedText: {
    fontSize: 16,
    color: 'black',
  },
  projectInfoContainer: {
    paddingVertical: 14,
    marginHorizontal: 20,
  },
  projectInfo: {
    color: 'black',
    fontSize: 16,
  },
  buttonContainer: {
    marginHorizontal: 120,
  },
  cameraContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  touchableCamera: {
    backgroundColor: '#A0A0A0',
    height: 150,
    width: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 150,
    width: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
