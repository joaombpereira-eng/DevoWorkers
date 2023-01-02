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
  useNavigation,
  RouteProp,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {TabStackParamList} from '../../navigator/TabNavigator';
import {RootStackParamList} from '../../navigator/RootNavigator';
import InfoForm from '../../components/forms/InfoForm';
import {useDispatch, useSelector} from 'react-redux';
import {selectUser} from '../../redux/slices/userSlice';
import IconButton from '../../components/buttons/IconButton';
import {ProjectData, projects} from '../../data/projects';
import {setProject} from '../../redux/slices/projectSlice';
import Button from '../../components/buttons/Button';
import {users} from '../../data/users';

type UserDetailsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList>,
  NativeStackNavigationProp<RootStackParamList, 'UserDetails'>
>;

export default function UserDetailsScreen() {
  const navigation = useNavigation<UserDetailsScreenNavigationProp>();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const moreThanOneProject: boolean = user.project.length > 1;

  const projectFilter: ProjectData[] = projects.filter(item =>
    user.project.includes(item.projectId),
  );

  function onDelete() {
    users.filter(item => item.id !== user.id);
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
      <ScrollView>
        <View style={styles.avatar}>
          <Image source={{uri: user.avatar}} style={styles.image} />
        </View>
        <View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{user.name}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.info}>Personal Information</Text>
          </View>
          <InfoForm info="Email" value={user.email} />
          <InfoForm
            info="Birthday"
            value={user.birthday.toLocaleDateString()}
          />
          <View style={[styles.infoContainer, {marginTop: 20}]}>
            <Text style={styles.info}>DevoWorker Information</Text>
          </View>
          <InfoForm info="Role" value={user.role.name} />
          <View style={styles.workContainer}>
            <View style={styles.infoWorkContainer}>
              <Text style={styles.infoWork}>
                {moreThanOneProject ? 'Projects' : 'Project'}
              </Text>
            </View>
            {projectFilter.map(item => (
              <TouchableOpacity
                onPress={() => {
                  dispatch(setProject(item));
                  navigation.navigate('ProjectDetails');
                }}
                key={item.projectId}
                style={styles.valueContainer}>
                <Text style={styles.value}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.buttonContainer}>
            <Button deleteStyle={styles.deleteButton} onPress={onDelete}>
              Delete
            </Button>
          </View>
        </View>
      </ScrollView>
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
    backgroundColor: '#EC5800',
    borderRadius: 20,
  },
});
