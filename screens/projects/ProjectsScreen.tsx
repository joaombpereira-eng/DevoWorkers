import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {TabStackParamList} from '../../navigator/TabNavigator';
import {RootStackParamList} from '../../navigator/RootNavigator';
import Input from '../../components/forms/Input';
import IconButton from '../../components/buttons/IconButton';
import ProjectCard from '../../components/cards/ProjectCard';
import {useEffect, useState} from 'react';
import {ProjectData} from '../../data/projects';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectProjects,
  setProjects,
} from '../../redux/slices/projects/projectsListSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../util/constants';
import axios from 'axios';
import LoadingOverlay from '../../components/LoadingOverlay';

export type ProjectsScreenNavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, 'Projects'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function ProjectsScreen() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<ProjectData[]>([]);
  const [search, setSearch] = useState<string>('');
  const [dateAscending, setDateAscending] = useState<boolean>(false);
  const [nameAscending, setNameAscending] = useState<boolean>(true);
  const [nameSort, setNameSort] = useState<boolean>(true);
  const dispatch = useDispatch();
  const {projects, loading, error} = useSelector(selectProjects);

  async function fetchProjects() {
    setIsSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('AccessToken');
      await axios
        .get(`${BASE_URL}/project`, {
          headers: {
            Authorization: 'bearer ' + token,
          },
        })
        .then(res => {
          setFilteredData(res.data);
          setIsSubmitting(false);
          console.log('res.data');
          console.log(res.data);
        });
    } catch (e) {
      console.log('error project');
      console.log(e);
      setIsSubmitting(false);
    }
    console.log('filteredData');
    console.log(filteredData);
    dispatch(setProjects(filteredData));
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  function onPressHandler(type: string) {
    const newData = projects.filter(item => {
      return item.status === type;
    });
    setFilteredData(newData);
  }

  function date() {
    if (!nameSort) {
      let dateSorted = [...filteredData];
      dateSorted = dateSorted.sort((a, b) => {
        if (dateAscending) {
          return a.startDate > b.startDate ? 1 : -1;
        } else {
          return a.startDate < b.startDate ? 1 : -1;
        }
      });
      return dateSorted;
    } else {
      let nameSorted = [...filteredData];
      nameSorted = nameSorted.sort((a, b) => {
        if (nameAscending) {
          return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
        } else {
          return a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1;
        }
      });
      return nameSorted;
    }
  }

  function lengthDataFiltered(type: string) {
    const dataFiltered = projects.filter(project => {
      return project.status === type;
    });
    return dataFiltered.length;
  }

  function searchFilter(text: string) {
    if (text) {
      const newData = filteredData.filter(item => {
        const itemData = item.name.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.includes(textData);
      });
      setFilteredData(newData);
      setSearch(text);
    } else {
      setFilteredData(projects);
      setSearch(text);
    }
  }

  if (isSubmitting) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Projects</Text>
        <View style={styles.sortContainer}>
          <View style={styles.sort}>
            {nameAscending ? (
              <IconButton
                name="sort-alpha-asc"
                size={25}
                color="black"
                onPress={() => {
                  setNameAscending(!nameAscending);
                  setNameSort(true);
                }}
              />
            ) : (
              <IconButton
                name="sort-alpha-desc"
                size={25}
                color={'black'}
                onPress={() => {
                  setNameAscending(!nameAscending);
                  setNameSort(true);
                }}
              />
            )}
          </View>
          <View style={styles.sort}>
            {dateAscending ? (
              <IconButton
                name="sort-amount-asc"
                size={25}
                color="black"
                onPress={() => {
                  setDateAscending(!dateAscending);
                  setNameSort(false);
                }}
              />
            ) : (
              <IconButton
                name="sort-amount-desc"
                size={25}
                color="black"
                onPress={() => {
                  setDateAscending(!dateAscending);
                  setNameSort(false);
                }}
              />
            )}
          </View>
        </View>
      </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          onPress={() => {
            setFilteredData(projects);
          }}>
          <Text style={styles.filter}>All ({projects.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressHandler('ToStart')}>
          <Text style={styles.filter}>
            To Start ({lengthDataFiltered('ToStart')})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressHandler('Active')}>
          <Text style={styles.filter}>
            Active ({lengthDataFiltered('Active')})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressHandler('Finished')}>
          <Text style={styles.filter}>
            Finished ({lengthDataFiltered('Finished')})
          </Text>
        </TouchableOpacity>
      </View>
      <Input isUserScreen={false} onChangeText={searchFilter} text={search} />
      <View style={styles.bodyContainer}>
        <FlatList
          data={date()}
          renderItem={({item}) => <ProjectCard {...item} />}
          keyExtractor={item => item.projectId}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffe7c2',
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    height: '15%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    flexDirection: 'row',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    color: 'black',
  },
  bodyContainer: {
    backgroundColor: '#EFEDEC',
    flex: 1,
  },
  sortContainer: {
    flexDirection: 'row',
  },
  sort: {
    marginLeft: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filter: {
    color: 'black',
    fontSize: 16,
  },
});
