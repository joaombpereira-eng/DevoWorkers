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

export default function MyUserScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconsContainer}>
        <View style={styles.editIcon}>
          <TouchableOpacity onPress={() => {}}>
            <Icon name="edit" color="black" size={25} />
          </TouchableOpacity>
        </View>
        <View style={styles.exitIcon}>
          <IconButton name="close" color="black" size={25} onPress={() => {}} />
        </View>
      </View>
      <View style={styles.bodyContainer}>
        <ScrollView>
          <View style={styles.avatar}>
            <Image
              source={{uri: `data:image/png;base64,${user?.avatar}`}}
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
