import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {useState} from 'react';
import IconButton from '../../components/buttons/IconButton';
import InputForm from '../../components/forms/InputForm';
import {Dropdown} from 'react-native-element-dropdown';
import {projects} from '../../data/projects';
import {roles} from '../../data/roles';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {TabStackParamList} from '../../navigator/TabNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigator/RootNavigator';
import Button from '../../components/buttons/Button';
import {users} from '../../data/users';

type AddNewUserScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList>,
  NativeStackNavigationProp<RootStackParamList, 'AddNewUser'>
>;

export default function AddNewUserScreen() {
  const [role, setRole] = useState<string>('');
  const [project, setProject] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [birthday, setBirthday] = useState<string>('');
  const navigation = useNavigation<AddNewUserScreenNavigationProp>();
  function onPress() {
    navigation.goBack();
  }

  function saveHandler() {
    const projectSaved = projects.filter(item => item.name === project.name);
    const roleSaved = roles.indexOf(role);

    if (!name || !email || !project || !role) {
      Alert.alert('Fill the Boxes!');
      return;
    }

    users.push({
      id: Math.random(),
      name: name,
      email: email,
      role: roles[roleSaved],
      project: [projectSaved[0].projectId],
      password: '',
      avatar: 'https://picsum.photos/seed/picsum20/200/300',
      birthday: new Date(),
    });

    navigation.navigate('Users');
  }

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
          <View style={styles.infoContainer}>
            <Text style={styles.info}>Personal Information</Text>
          </View>
          <InputForm info="Email" text={email} onChangeText={setEmail} />
          <InputForm info="Name" text={name} onChangeText={setName} />
          <InputForm
            info="Birthday"
            text={birthday}
            onChangeText={setBirthday}
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
            value={role}
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
            value={project}
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
});
