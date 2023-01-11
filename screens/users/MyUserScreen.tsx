import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import InfoForm from '../../components/forms/InfoForm';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconButton from '../../components/buttons/IconButton';
import {formattedDate} from '../../util/formattedDate';
import {useDispatch, useSelector} from 'react-redux';
import {selectUserLogged} from '../../redux/slices/login/loginSlice';
import {selectUsers} from '../../redux/slices/users/usersListSlice';
import {useEffect} from 'react';
import {setProject} from '../../redux/slices/projects/projectSlice';
import {TabStackParamList} from '../../navigator/TabNavigator';
import {RootStackParamList} from '../../navigator/RootNavigator';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {selectProjects} from '../../redux/slices/projects/projectsListSlice';

export type MyUserScreenNavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, 'Users'>,
  NativeStackNavigationProp<RootStackParamList, 'Tab'>
>;

export default function MyUserScreen() {
  const myUserFromToken = useSelector(selectUserLogged);
  const {users} = useSelector(selectUsers);
  const {projects} = useSelector(selectProjects);
  const dispatch = useDispatch();
  const navigation = useNavigation<MyUserScreenNavigationProps>();

  const myUser = users.filter(user => user.email === myUserFromToken.email);

  const projectsFilter = projects.filter(item => {
    if (myUser[0]?.projects.includes(item.projectId)) {
      return true;
    }
  });

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

  return (
    <View style={styles.container}>
      <View style={styles.iconsContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditUser', {user: myUser[0]})}>
          <Icon name="edit" color="black" size={25} />
        </TouchableOpacity>
      </View>
      <View style={styles.bodyContainer}>
        <ScrollView>
          <View style={styles.avatar}>
            <Image
              source={{uri: `data:image/png;base64,${myUser[0]?.avatar}`}}
              style={styles.image}
            />
          </View>
          <View>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{myUser[0]?.name}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.info}>Personal Information</Text>
            </View>
            <InfoForm info="Email" value={myUser[0]?.email} />
            <InfoForm
              info="Birthday"
              value={formattedDate(myUser[0]?.birthDate)}
            />
            <View style={[styles.infoContainer, {marginTop: 20}]}>
              <Text style={styles.info}>DevoWorker Information</Text>
            </View>
            <InfoForm info="Role" value={myUser[0]?.role} />
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
