import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {ProjectsScreenNavigationProps} from '../../screens/projects/ProjectsScreen';
import {setProject} from '../../redux/slices/projects/projectSlice';

type Props = {
  projectId: string;
  name: string;
  workforce: number[];
  status: string;
  logo: string;
  startDate: Date;
  endDate: Date;
  budget: number;
};

export default function ProjectCard({
  name,
  startDate,
  status,
  projectId,
  workforce,
  endDate,
  budget,
  logo,
}: Props) {
  const navigation = useNavigation<ProjectsScreenNavigationProps>();
  const dispatch = useDispatch();

  function onPress() {
    dispatch(
      setProject({
        name,
        startDate,
        status,
        projectId,
        workforce,
        endDate,
        budget,
        logo,
      }),
    );
    navigation.navigate('ProjectDetails', {projectId: projectId});
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.rootContainer}>
          <View>
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{name}</Text>
              {/* <Text style={styles.startDate}>
                {startingDate.toLocaleDateString('en-GB')}
              </Text> */}
            </View>
            <View style={styles.statusContainer}>
              <Text style={styles.status}>{status}</Text>
            </View>
          </View>
          {/* <View style={styles.logoContainer}>
            <Image source={{uri: logo}} style={styles.logo} />
          </View> */}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: 'white',
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 4,
  },
  rootContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoContainer: {
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
  },
  startDate: {
    color: 'black',
  },
  statusContainer: {
    marginTop: 20,
  },
  status: {
    color: 'black',
  },
  logoContainer: {
    justifyContent: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});
