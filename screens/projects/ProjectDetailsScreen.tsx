import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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
import IconButton from '../../components/buttons/IconButton';
import {setUser} from '../../redux/slices/users/userSlice';
import {selectProjectById} from '../../redux/slices/projects/projectsListSlice';
import {RootState} from '../../redux/store/store';
import {useEffect, useState} from 'react';
import {ProjectData} from '../../data/projects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../util/constants';
import axios from 'axios';

type ProjectDetailsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList>,
  NativeStackNavigationProp<RootStackParamList, 'ProjectDetails'>
>;

type ProjectScreenRouteProp = RouteProp<RootStackParamList, 'ProjectDetails'>;

export default function ProjectDetailsScreen() {
  const [project, setProject] = useState<ProjectData>();
  const navigation = useNavigation<ProjectDetailsScreenNavigationProp>();
  const {
    params: {projectId},
  } = useRoute<ProjectScreenRouteProp>();
  const dispatch = useDispatch();

  async function getProjectById(id: string) {
    try {
      const token = await AsyncStorage.getItem('AccessToken');
      const res = await axios.get(`${BASE_URL}/project/${id}`, {
        headers: {
          Authorization: 'bearer ' + token,
        },
      });
      setProject(res.data);
    } catch (e) {
      console.log('error');
      console.log(e);
    }
  }

  useEffect(() => {
    getProjectById(projectId);
  }, []);

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
          {/* <View style={styles.logoContainer}>
            <Image source={{uri: project?.logo}} style={styles.logo} />
          </View> */}
          <View>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{project?.name}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.info}>Project Information</Text>
            </View>
            <View style={styles.workContainer}>
              <View style={styles.infoWorkContainer}>
                <Text style={styles.infoWork}>Workforce</Text>
              </View>
              {/* {project?.workForce.map(item => (
                <TouchableOpacity
                  onPress={() => {
                    dispatch(setUser(item));
                    navigation.navigate('UserDetails', {userId: item.id});
                  }}
                  key={item.id}
                  style={styles.valueContainer}>
                  <Text style={styles.value}>{item.name}</Text>
                </TouchableOpacity>
              ))} */}
            </View>
            <InfoForm info="Status" value={project?.status} />
            <View style={styles.dateContainer}>
              {/* <InfoForm
                info="Start at"
                value={project?.startingDate.toLocaleDateString('en-GB')}
              />
              <InfoForm
                info="End at"
                value={project?.endDate.toLocaleDateString('en-GB')}
              /> */}
            </View>
            <InfoForm info="Budget" value={`${project?.budget.toString()}€`} />
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
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  logo: {
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
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
});
