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
import LoadingOverlay from '../../components/LoadingOverlay';
import {Dropdown} from 'react-native-element-dropdown';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {TabStackParamList} from '../../navigator/TabNavigator';
import {RootStackParamList} from '../../navigator/RootNavigator';
import {Role, roles} from '../../data/roles';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useDispatch} from 'react-redux';
import {addUser, setUsers} from '../../redux/slices/users/usersListSlice';
import {formattedDate} from '../../util/formattedDate';
import {formattedImage} from '../../util/formattedImage';
import {BASE_URL, COMMON_AVATAR_BASE64} from '../../util/constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {axiosApiInstance} from '../../api/axiosApiInstance';

type AddNewUserScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList>,
  NativeStackNavigationProp<RootStackParamList, 'AddNewUser'>
>;

export default function AddNewUserScreen() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [role, setRole] = useState<Role>(roles[0]);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [imagePicked, setImagePicked] = useState<string | undefined>('');
  const [open, setOpen] = useState<boolean>(false);
  const navigation = useNavigation<AddNewUserScreenNavigationProp>();
  const dispatch = useDispatch();

  const onLeftArrowPress = () => {
    navigation.goBack();
  };

  const addNewUser = async () => {
    setIsSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('AccessToken');
      await axiosApiInstance
        .post(
          `${BASE_URL}/user`,
          {
            name: name,
            email: email,
            password: '12345678',
            role: role.name,
            birthDate: birthDate.toISOString(),
            avatar: imagePicked ? imagePicked : COMMON_AVATAR_BASE64,
          },
          {
            headers: {
              Authorization: 'bearer ' + token,
            },
          },
        )
        .then(res => {
          setIsSubmitting(false);
          dispatch(
            addUser({
              userId: res.data.data,
              name: name,
              email: email,
              password: '12345678',
              role: role.name,
              birthDate: birthDate.toISOString(),
              avatar: imagePicked ? imagePicked : COMMON_AVATAR_BASE64,
              projects: [],
            }),
          );
        });
    } catch (e) {
      console.log('error add user');
      console.log(e);
      setIsSubmitting(false);
    }
  };

  const onSaveButtonPress = () => {
    const validBirthday: boolean = birthDate < new Date();
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

    if (!name || !role || !email) {
      Alert.alert('Fill the Boxes!');
      return;
    }

    addNewUser();
    navigation.navigate('Users');
  };

  const requestCameraPermission = async () => {
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
  };

  const requestExternalWritePermission = async () => {
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
  };

  const pickImage = async () => {
    const isCameraPermitted = await requestCameraPermission();
    const isStoragePermitted = await requestExternalWritePermission();

    if (isCameraPermitted && isStoragePermitted) {
      let result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        includeBase64: true,
      });

      const image = result.assets && result.assets[0].base64;

      if (!result.didCancel) {
        setImagePicked(image);
      }
    }
  };

  const captureImage = async () => {
    const isCameraPermitted = await requestCameraPermission();
    const isStoragePermitted = await requestExternalWritePermission();

    if (isCameraPermitted && isStoragePermitted) {
      let result = await launchCamera({
        mediaType: 'photo',
        quality: 1,
        includeBase64: true,
      });

      const image = result.assets && result.assets[0].base64;

      if (!result.didCancel) {
        setImagePicked(image);
      }
    }
  };

  const selectType = () => {
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
  };

  let imageOrIcon = imagePicked ? (
    <Image
      source={{uri: formattedImage(imagePicked)}}
      style={styles.image}
      resizeMode="contain"
    />
  ) : (
    <Icon name="camera" size={30} />
  );

  if (isSubmitting) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <IconButton
          name="chevron-left"
          color="black"
          size={30}
          onPress={onLeftArrowPress}
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
            defaultValue=""
          />
          <InputForm
            info="Name"
            text={name}
            onChangeText={setName}
            isBirthday={false}
            defaultValue=""
          />
          <DateForm
            info="Birthday"
            value={formattedDate(birthDate)}
            open={open}
            date={birthDate}
            onConfirm={date => {
              setOpen(false);
              setBirthDate(date);
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
          <View style={styles.buttonContainer}>
            <Button onPress={onSaveButtonPress}>Save</Button>
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
    borderRadius: 10,
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
